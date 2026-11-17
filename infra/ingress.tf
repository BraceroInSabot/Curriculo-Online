# Entrada HTTPS do site: Traefik (já vem no k3s) + certificado do Let's Encrypt
# emitido e renovado automaticamente pelo cert-manager.
#
# Pré-requisitos no cluster (feitos uma vez, veja docs/PRODUCAO.md):
#   - cert-manager instalado (CRDs cert-manager.io)
#   - redirecionamento HTTP → HTTPS global no Traefik (deploy/k3s/traefik-config.yaml)

resource "kubernetes_manifest" "cluster_issuer" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt"
    }
    spec = {
      acme = {
        server = var.acme_server
        email  = var.acme_email
        privateKeySecretRef = {
          name = "letsencrypt-account-key"
        }
        solvers = [
          {
            http01 = {
              ingress = {
                ingressClassName = "traefik"
              }
            }
          }
        ]
      }
    }
  }
}

# HSTS: o navegador passa a usar só HTTPS neste domínio por 1 ano.
# includeSubDomains fica desligado para não afetar outros subdomínios
# (ex.: arquivia.bracero.com.br) que não estejam neste cluster.
resource "kubernetes_manifest" "hsts" {
  manifest = {
    apiVersion = "traefik.io/v1alpha1"
    kind       = "Middleware"
    metadata = {
      name      = "hsts"
      namespace = kubernetes_namespace_v1.site.metadata[0].name
    }
    spec = {
      headers = {
        stsSeconds           = 31536000
        stsIncludeSubdomains = false
        stsPreload           = false
      }
    }
  }
}

resource "kubernetes_ingress_v1" "site" {
  metadata {
    name      = local.app_name
    namespace = kubernetes_namespace_v1.site.metadata[0].name
    labels    = local.labels
    annotations = {
      "cert-manager.io/cluster-issuer"                   = "letsencrypt"
      "traefik.ingress.kubernetes.io/router.entrypoints" = "websecure"
      "traefik.ingress.kubernetes.io/router.tls"         = "true"
      "traefik.ingress.kubernetes.io/router.middlewares" = "${var.namespace}-hsts@kubernetescrd"
    }
  }

  spec {
    ingress_class_name = "traefik"

    tls {
      hosts       = var.domains
      secret_name = "${local.app_name}-tls"
    }

    dynamic "rule" {
      for_each = var.domains
      content {
        host = rule.value
        http {
          path {
            path      = "/"
            path_type = "Prefix"
            backend {
              service {
                name = kubernetes_service_v1.site.metadata[0].name
                port {
                  name = "http"
                }
              }
            }
          }
        }
      }
    }
  }

  depends_on = [kubernetes_manifest.cluster_issuer, kubernetes_manifest.hsts]
}
