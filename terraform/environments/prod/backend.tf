# =============================================================================
# Production Environment - Backend Configuration
# =============================================================================
# Configure remote state storage for the production environment.
# Production MUST use remote state with locking for safety.
# =============================================================================

# -----------------------------------------------------------------------------
# Option 1: Local Backend (NOT RECOMMENDED FOR PRODUCTION)
# -----------------------------------------------------------------------------
# Only use for initial testing - switch to remote backend before production use

terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# -----------------------------------------------------------------------------
# Option 2: Terraform Cloud Backend (RECOMMENDED)
# -----------------------------------------------------------------------------
# Uncomment and configure for Terraform Cloud state management
# Provides state locking, versioning, and team collaboration
#
# terraform {
#   cloud {
#     organization = "your-organization"
#     
#     workspaces {
#       name = "dragndrop-prod"
#     }
#   }
# }

# -----------------------------------------------------------------------------
# Option 3: AWS S3 Backend with DynamoDB Locking (RECOMMENDED)
# -----------------------------------------------------------------------------
# Uncomment and configure for S3 state storage with state locking
#
# terraform {
#   backend "s3" {
#     bucket         = "your-terraform-state-bucket"
#     key            = "dragndrop/prod/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#     
#     # Additional security for production
#     skip_metadata_api_check = false
#     
#     # Enable versioning on the S3 bucket for state history
#   }
# }

# -----------------------------------------------------------------------------
# Option 4: Cloudflare R2 Backend
# -----------------------------------------------------------------------------
# Uncomment and configure for Cloudflare R2 state storage
# Note: R2 doesn't support native locking - use with caution
#
# terraform {
#   backend "s3" {
#     bucket                      = "terraform-state"
#     key                         = "dragndrop/prod/terraform.tfstate"
#     region                      = "auto"
#     skip_credentials_validation = true
#     skip_metadata_api_check     = true
#     skip_region_validation      = true
#     endpoints = {
#       s3 = "https://<account_id>.r2.cloudflarestorage.com"
#     }
#   }
# }

# =============================================================================
# IMPORTANT: Production State Management Best Practices
# =============================================================================
#
# 1. ALWAYS use remote state with locking for production
# 2. Enable state encryption at rest
# 3. Enable state versioning for rollback capability
# 4. Restrict access to state files (contains sensitive data)
# 5. Use separate state files per environment
# 6. Never commit terraform.tfstate to version control
# 7. Regularly backup state files
# 8. Use terraform plan before apply
# 9. Require approval for production changes
#
# =============================================================================
