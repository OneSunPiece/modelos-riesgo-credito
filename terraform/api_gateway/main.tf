# API Gateway
resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "fastapi-api"
  protocol_type = "HTTP"
  
  ## tags
  tags = {
    Name = "api-gateway-credit-risk-score"
    Environment = "Dev"
    Project = "credit-risk-score"
  }
}


# API Integration with Lambda
/*
  The integration type is set to AWS_PROXY, which allows the API Gateway to pass the request
*/
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.api_gateway.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.api_lambda.arn
  payload_format_version = "2.0"
}

## API Route
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "POST /predict" # HTTP POST method for predictions
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

## API Deployment
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "$default" # stage name
  auto_deploy = true
}