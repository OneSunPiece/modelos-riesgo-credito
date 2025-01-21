variable "s3_bucket_name" {
  description = "Name for the S3 bucket that will store the model file"
  type        = string
  default     = "credit_risk_score_bucket"
}

variable "s3_bucket_tags" {
  description = "Tags for the S3 bucket"
  type        = map(string)
  default = {
    Name        = "s3-model-credit-risk-score"
    Environment = "Dev"
    Project     = "credit-risk-score"
  }
}

variable "s3_model_path" {
  description = "The path to the model file in the repository"
  type        = string
  default     = "${path.module}/../model/knn_model.pkl" # Relative path to the zip file
}