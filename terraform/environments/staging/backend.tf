# =============================================================================
# Staging Environment - Backend Configuration
# =============================================================================
# Configure remote state storage for the staging environment.
# Staging should use remote state for team collaboration.
# =============================================================================

# -----------------------------------------------------------------------------
# Option 1: Local Backend (Not recommended for staging)
# -----------------------------------------------------------------------------
# Only use for initial testing

terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# -----------------------------------------------------------------------------
# Option 2: Terraform Cloud Backend (Recommended)
# -----------------------------------------------------------------------------
# Uncomment and configure for Terraform Cloud state management
#
# terraform {
#   cloud {
#     organization = "your-organization"
#     
#     workspaces {
#       name = "dragndrop-staging"
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
#     key            = "dragndrop/staging/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }
