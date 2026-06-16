output "app_url" {
    description = "URL of the API Gateway"
    value = aws_apigatewayv2_api.peakcore_gateway.api_endpoint
}