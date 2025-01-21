output "api_gateway_url" {
  description = "The URL of the API Gateway for the credit risk project"
  value       = aws_apigatewayv2_api.api_gateway.api_endpoint
}

output "api_gateway_stage_name" {
  description = "The name of the API Gateway stage for the credit risk project"
  value       = aws_apigatewayv2_stage.default_stage.name
}

output "api_gateway_integration_id" {
  description = "The ID of the API Gateway integration with Lambda for credit risk project"
  value       = aws_apigatewayv2_integration.lambda_integration.id
}
