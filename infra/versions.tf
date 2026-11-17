terraform {
  required_version = ">= 1.6"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 3.5"
    }
  }
}

# Usa o kubeconfig do usuário que roda o Terraform no servidor
# (no VPS: /home/deploy/.kube/config, copiado do k3s).
provider "kubernetes" {
  config_path = var.kubeconfig_path
}
