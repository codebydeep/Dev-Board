output "vpc_id" {
  description = "ID of the VPC."
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets."
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets."
  value       = module.vpc.private_subnet_ids
}

output "instance_id" {
  description = "ID of the EC2 instance."
  value       = module.ec2.instance_id
}

output "instance_public_ip" {
  description = "Public IP of the EC2 instance."
  value       = module.ec2.instance_public_ip
}

output "instance_private_ip" {
  description = "Private IP of the EC2 instance."
  value       = module.ec2.instance_private_ip
}

output "ec2_security_group_id" {
  description = "Security group ID attached to the EC2 instance."
  value       = module.ec2.security_group_id
}
