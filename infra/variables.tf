variable "kubeconfig_path" {
  description = "Caminho do kubeconfig usado para falar com o cluster."
  type        = string
  default     = "~/.kube/config"
}

variable "image" {
  description = "Imagem a publicar, de preferência com digest: ghcr.io/braceroinsabot/curriculo-online@sha256:..."
  type        = string

  validation {
    condition     = can(regex("^ghcr\\.io/braceroinsabot/curriculo-online[:@]", var.image))
    error_message = "A imagem deve vir de ghcr.io/braceroinsabot/curriculo-online (com :tag ou @sha256:digest)."
  }
}

variable "domains" {
  description = "Domínios do site. O primeiro é o principal. Todos precisam apontar (DNS tipo A) para o IP do VPS."
  type        = list(string)

  validation {
    condition     = length(var.domains) > 0
    error_message = "Informe pelo menos um domínio."
  }
}

variable "acme_email" {
  description = "E-mail da conta no Let's Encrypt (contato sobre problemas com os certificados)."
  type        = string
}

variable "acme_server" {
  description = "Servidor ACME. Produção por padrão; use o de staging para testes (certificado não confiável, mas sem limite de emissões)."
  type        = string
  default     = "https://acme-v02.api.letsencrypt.org/directory"
  # staging: "https://acme-staging-v02.api.letsencrypt.org/directory"
}

variable "namespace" {
  description = "Namespace do site no cluster."
  type        = string
  default     = "curriculo"
}

variable "replicas" {
  description = "Número de pods. Com 2, um deploy ou reinício de pod não derruba o site."
  type        = number
  default     = 2
}
