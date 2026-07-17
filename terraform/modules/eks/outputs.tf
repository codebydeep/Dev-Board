output "cluster_name" {
  description = "Name of the EKS cluster."
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "API server endpoint of the EKS cluster."
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_certificate_authority" {
  description = "Base64-encoded certificate authority data."
  value       = aws_eks_cluster.this.certificate_authority[0].data
  sensitive   = true
}

output "cluster_version" {
  description = "Kubernetes version of the cluster."
  value       = aws_eks_cluster.this.version
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the control plane."
  value       = aws_security_group.cluster.id
}

output "node_group_role_arn" {
  description = "ARN of the IAM role used by the node group."
  value       = aws_iam_role.node_group.arn
}

output "oidc_provider_arn" {
  description = "ARN of the IAM OIDC provider (for IRSA)."
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_provider_url" {
  description = "URL of the OIDC provider."
  value       = aws_iam_openid_connect_provider.eks.url
}
