# =============================================================================
# THREE HORIZONS PLATFORM - OUTPUTS
# =============================================================================

# -----------------------------------------------------------------------------
# RESOURCE GROUP
# -----------------------------------------------------------------------------

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.main.id
}

# -----------------------------------------------------------------------------
# NETWORKING
# -----------------------------------------------------------------------------

output "vnet_id" {
  description = "ID of the virtual network"
  value       = module.networking.vnet_id
}

output "vnet_name" {
  description = "Name of the virtual network"
  value       = module.networking.vnet_name
}

output "aks_subnet_id" {
  description = "ID of the AKS subnet"
  value       = module.networking.aks_subnet_id
}

# -----------------------------------------------------------------------------
# AKS CLUSTER
# -----------------------------------------------------------------------------

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = module.aks.cluster_name
}

output "aks_cluster_id" {
  description = "ID of the AKS cluster"
  value       = module.aks.cluster_id
}

output "aks_cluster_fqdn" {
  description = "FQDN of the AKS cluster"
  value       = module.aks.cluster_fqdn
}

output "aks_kubelet_identity" {
  description = "Kubelet managed identity"
  value       = module.aks.kubelet_identity
}

output "kube_config" {
  description = "Kubernetes config for kubectl"
  value       = module.aks.kube_config
  sensitive   = true
}

# -----------------------------------------------------------------------------
# DATABASE
# -----------------------------------------------------------------------------

output "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  value       = module.databases.server_name
}

output "postgresql_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = module.databases.server_fqdn
}

output "postgresql_connection_string" {
  description = "Connection string for PostgreSQL"
  value       = module.databases.connection_string
  sensitive   = true
}

# -----------------------------------------------------------------------------
# KEY VAULT
# -----------------------------------------------------------------------------

output "keyvault_name" {
  description = "Name of the Key Vault"
  value       = module.security.keyvault_name
}

output "keyvault_uri" {
  description = "URI of the Key Vault"
  value       = module.security.keyvault_uri
}

# -----------------------------------------------------------------------------
# PLATFORM URLS
# -----------------------------------------------------------------------------

output "argocd_url" {
  description = "ArgoCD dashboard URL"
  value       = var.enable_argocd ? module.argocd[0].argocd_url : null
}

output "grafana_url" {
  description = "Grafana dashboard URL"
  value       = var.enable_observability ? module.observability[0].grafana_url : null
}

# -----------------------------------------------------------------------------
# AI FOUNDRY (if enabled)
# -----------------------------------------------------------------------------

output "ai_foundry_endpoint" {
  description = "Azure AI Foundry endpoint"
  value       = var.enable_ai_foundry ? module.ai_foundry[0].endpoint : null
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------

output "deployment_summary" {
  description = "Summary of deployed resources"
  value = {
    project     = var.project_name
    environment = var.environment
    location    = var.location

    endpoints = {
      aks_fqdn = module.aks.cluster_fqdn
      keyvault = module.security.keyvault_uri
      argocd   = var.enable_argocd ? module.argocd[0].argocd_url : "Not deployed"
      grafana  = var.enable_observability ? module.observability[0].grafana_url : "Not deployed"
    }

    features = {
      ai_foundry = var.enable_ai_foundry
      argocd     = var.enable_argocd
    }
  }
}
