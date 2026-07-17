terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket         = "aws-s3-buckets-app-eks-12345"
    key            = "ms-app/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ms-app-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

locals {
  common_tags = merge(var.tags, {
    Project     = var.cluster_name
    Environment = var.environment
    ManagedBy   = "terraform"
  })
}

module "vpc" {
  source = "./modules/vpc"

  cluster_name         = var.cluster_name
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  tags                 = local.common_tags
}

module "eks" {
  source = "./modules/eks"

  cluster_name           = var.cluster_name
  kubernetes_version     = var.kubernetes_version
  vpc_id                 = module.vpc.vpc_id
  public_subnet_ids      = module.vpc.public_subnet_ids
  private_subnet_ids     = module.vpc.private_subnet_ids
  endpoint_public_access = var.endpoint_public_access
  cluster_log_types      = var.cluster_log_types
  node_instance_types    = var.node_instance_types
  node_disk_size         = var.node_disk_size
  node_capacity_type     = var.node_capacity_type
  node_desired_size      = var.node_desired_size
  node_min_size          = var.node_min_size
  node_max_size          = var.node_max_size
  node_labels            = var.node_labels
  tags                   = local.common_tags
}
