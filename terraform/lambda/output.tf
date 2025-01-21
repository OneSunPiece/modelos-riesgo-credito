output "lambda_function_arn" {
  description = "The ARN of the Lambda function for the credit risk project"
  value       = aws_lambda_function.api_lambda.arn
}

