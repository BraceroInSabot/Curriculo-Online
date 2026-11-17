output "url" {
  description = "Endereço público do site."
  value       = "https://${var.domains[0]}"
}

output "image" {
  description = "Imagem em produção."
  value       = var.image
}
