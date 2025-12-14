# Terraform provider configuration

terraform {
  required_version = ">= 1.6.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration for local dev (use local state)
  # For remote state, uncomment and configure:
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket-name"
  #   key            = "QuantumBallot/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "your-terraform-lock-table"
  # }
}

provider "aws" {
  region = var.aws_region
  # Credentials configured via environment variables, IAM role, or shared credentials file
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}
