resource "aws_apigatewayv2_api" "peakcore_gateway" {
  name          = "peakcore-gateway"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://d28mrqncy1yaev.cloudfront.net"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_authorizer" "gateway_auth" {
  api_id           = aws_apigatewayv2_api.peakcore_gateway.id
  authorizer_type  = "JWT"
  name             = "gateway_auth"
  identity_sources = ["$request.header.Authorization"]
  jwt_configuration {
    audience = [var.user_pool_client_id]
    issuer   = "https://cognito-idp.us-east-1.amazonaws.com/${var.user_pool_id}"
  }
}

resource "aws_apigatewayv2_integration" "read_integration" {
  api_id           = aws_apigatewayv2_api.peakcore_gateway.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.peakcore_read_arn
}

resource "aws_apigatewayv2_integration" "validation_integration" {
  api_id           = aws_apigatewayv2_api.peakcore_gateway.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.peakcore_validation_arn
}

resource "aws_apigatewayv2_route" "read_route" {
  api_id             = aws_apigatewayv2_api.peakcore_gateway.id
  route_key          = "GET /plan"
  target             = "integrations/${aws_apigatewayv2_integration.read_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.gateway_auth.id
}

resource "aws_apigatewayv2_route" "validation_route" {
  api_id             = aws_apigatewayv2_api.peakcore_gateway.id
  route_key          = "POST /generate"
  target             = "integrations/${aws_apigatewayv2_integration.validation_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.gateway_auth.id
}

resource "aws_apigatewayv2_stage" "peakcore_stage" {
  api_id      = aws_apigatewayv2_api.peakcore_gateway.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gateway_lambda_tp" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.peakcore_validation_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.peakcore_gateway.execution_arn}/*/*"
}


resource "aws_lambda_permission" "api_gateway_lambda_read_tp" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.peakcore_read_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.peakcore_gateway.execution_arn}/*/*"
}

