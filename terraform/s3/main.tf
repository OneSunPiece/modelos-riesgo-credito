provider "aws" {
  region = "us-east-1"
}

# s3 bucket for lambda deployment
resource "aws_s3_bucket" "lambda_credit_model_bucket" {
  bucket = var.s3_bucket_name
  tags = var.s3_bucket_tags
}

## Files to upload to the bucket
resource "aws_s3_bucket_object" "model.pkl" {
  bucket = var.s3_bucket_name 
  key    = "model.pkl" # Nombre del archivo en el bucket
  source = var.s3_model_path # Ruta local del archivo a subir
}
