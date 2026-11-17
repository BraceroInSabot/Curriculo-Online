locals {
  app_name = "curriculo-online"
  labels = {
    "app.kubernetes.io/name"       = local.app_name
    "app.kubernetes.io/managed-by" = "terraform"
  }
  selector = { "app.kubernetes.io/name" = local.app_name }
}

resource "kubernetes_namespace_v1" "site" {
  metadata {
    name = var.namespace
    labels = {
      # Pod Security Admission. Os pods do site já seguem o perfil "restricted"
      # (o mais rígido); o bloqueio fica no "baseline" para não barrar o pod
      # temporário que o cert-manager cria aqui ao emitir o certificado.
      # Avisos e auditoria continuam apontando qualquer desvio do "restricted".
      "pod-security.kubernetes.io/enforce" = "baseline"
      "pod-security.kubernetes.io/warn"    = "restricted"
      "pod-security.kubernetes.io/audit"   = "restricted"
    }
  }
}

resource "kubernetes_deployment_v1" "site" {
  metadata {
    name      = local.app_name
    namespace = kubernetes_namespace_v1.site.metadata[0].name
    labels    = local.labels
  }

  # O Terraform espera o rollout terminar; se os pods novos não ficarem
  # prontos, o apply falha (e o pipeline fica vermelho).
  wait_for_rollout = true

  timeouts {
    create = "5m"
    update = "5m"
  }

  spec {
    replicas               = var.replicas
    revision_history_limit = 5 # versões guardadas para `kubectl rollout undo`

    selector {
      match_labels = local.selector
    }

    strategy {
      type = "RollingUpdate"
      rolling_update {
        max_unavailable = "0" # nunca fica com menos pods prontos que o desejado
        max_surge       = "1"
      }
    }

    template {
      metadata {
        labels = local.labels
      }

      spec {
        automount_service_account_token  = false
        termination_grace_period_seconds = 30

        security_context {
          run_as_non_root = true
          run_as_user     = 101
          run_as_group    = 101
          seccomp_profile {
            type = "RuntimeDefault"
          }
        }

        container {
          name              = "web"
          image             = var.image
          image_pull_policy = "IfNotPresent"

          port {
            name           = "http"
            container_port = 8080
          }

          resources {
            requests = { cpu = "10m", memory = "16Mi" }
            limits   = { memory = "64Mi" }
          }

          security_context {
            allow_privilege_escalation = false
            read_only_root_filesystem  = true
            capabilities {
              drop = ["ALL"]
            }
          }

          readiness_probe {
            http_get {
              path = "/healthz"
              port = "http"
            }
            period_seconds = 5
          }

          liveness_probe {
            http_get {
              path = "/healthz"
              port = "http"
            }
            period_seconds    = 10
            failure_threshold = 3
          }

          lifecycle {
            pre_stop {
              exec {
                command = ["sleep", "5"]
              }
            }
          }

          volume_mount {
            name       = "tmp"
            mount_path = "/tmp"
          }
        }

        volume {
          name = "tmp"
          empty_dir {
            medium     = "Memory"
            size_limit = "16Mi"
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "site" {
  metadata {
    name      = local.app_name
    namespace = kubernetes_namespace_v1.site.metadata[0].name
    labels    = local.labels
  }

  spec {
    selector = local.selector

    port {
      name        = "http"
      port        = 80
      target_port = "http"
    }
  }
}

# Com 2 réplicas, garante que manutenções do nó (ex.: atualização do k3s com
# `kubectl drain`) nunca derrubem os dois pods ao mesmo tempo.
resource "kubernetes_pod_disruption_budget_v1" "site" {
  count = var.replicas > 1 ? 1 : 0

  metadata {
    name      = local.app_name
    namespace = kubernetes_namespace_v1.site.metadata[0].name
  }

  spec {
    min_available = "1"
    selector {
      match_labels = local.selector
    }
  }
}
