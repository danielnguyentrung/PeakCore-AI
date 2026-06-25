output "cloudfront_url" {
  description = "The URL of the frontend"
  value       = module.cloudfront.cloudfront_url
}

output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = module.api_gateway.app_url
}

output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = module.cognito.user_pool_client_id
}

output "github_actions_role_arn" {
  description = "ARN of the Github Actions role"
  value       = module.github_actions.github_actions_role_arn
}