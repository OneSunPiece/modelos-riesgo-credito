variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
  default     = "lambda-function-credit-risk-score"
}

variable "lambda_runtime" {
  description = "The runtime environment for the Lambda function"
  type        = string
  default     = "python3.12"
}

variable "lambda_handler" {
  description = "The handler for the Lambda function"
  type        = string
  default     = "app.handler"
}

variable "lambda_memory_size" {
  description = "The amount of memory allocated to the Lambda function"
  type        = number
  default     = 1024
}

variable "lambda_timeout" {
  description = "The timeout for the Lambda function"
  type        = number
  default     = 60 # seconds
}

variable "lambda_zip_file" {
  description = "The path to the zip package used for the lambda file"
  type        = string
  default     = "${path.module}/../backend/lambda_function.zip" # Relative path to the zip file
}

variable "model_path" {
  description = "The path to the model file"
  type        = string
  default     = "/tmp/model.pkl"
}

