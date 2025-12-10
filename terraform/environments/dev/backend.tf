# =============================================================================
# Development Environment - Backend Configuration
# =============================================================================
# Configure remote state storage for the development environment.
# 
# Options:
# 1. Local backend (default for dev)
# 2. Terraform Cloud
# 3. AWS S3
# 4. Cloudflare R2
# =============================================================================

# -----------------------------------------------------------------------------
# Option 1: Local Backend (Default for Development)
# -----------------------------------------------------------------------------
# Uncomment this for local state storage (not recommended for team environments)

terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# -----------------------------------------------------------------------------
# Option 2: Terraform Cloud Backend
# -----------------------------------------------------------------------------
# Uncomment and configure for Terraform Cloud state management
#
# terraform {
#   cloud {
#     organization = "your-organization"
#     
#     workspaces {
#       name = "dragndrop-dev"
#     }
#   }
# }

# -----------------------------------------------------------------------------
# Option 3: AWS S3 Backend
# -----------------------------------------------------------------------------
# Uncomment and configure for S3 state storage
#
# terraform {
#   backend "s3" {
#     bucket         = "your-terraform-state-bucket"
#     key            = "dragndrop/dev/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }

# -----------------------------------------------------------------------------
# Option 4: Cloudflare R2 Backend (via S3 compatibility)
# -----------------------------------------------------------------------------
# Uncomment and configure for Cloudflare R2 state storage
#
# terraform {
#   backend "s3" {
#     bucket                      = "terraform-state"
#     key                         = "dragndrop/dev/terraform.tfstate"
#     region                      = "auto"
#     skip_credentials_validation = true
#     skip_metadata_api_check     = true
#     skip_region_validation      = true
#     endpoints = {
#       s3 = "https://<account_id>.r2.cloudflarestorage.com"
#     }
#   }
# }
