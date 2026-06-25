# API GATEWAY MODULE 
module "api_gateway" {
  source                  = "./services/api_gateway"
  peakcore_validation_arn = module.lambda.peakcore_validation_arn
  peakcore_read_arn       = module.lambda.peakcore_read_arn
  user_pool_id            = module.cognito.user_pool_id
  user_pool_client_id     = module.cognito.user_pool_client_id
}

# BEDROCK MODULE 

module "bedrock" {
  source         = "./services/bedrock"
  peakcore_model = var.peakcore_model
}

# CLOUDFRONT MODULE 

module "cloudfront" {
  source                               = "./services/cloudfront"
  peakcore_bucket_regional_domain_name = module.s3.peakcore_bucket_regional_domain_name
  s3_frontend_bucket_name              = module.s3.s3_frontend_bucket_name
  s3_frontend_arn                      = module.s3.s3_frontend_arn
}

# COGNITO MODULE

module "cognito" {
  source = "./services/cognito"
}

# DYNAMODB MODULE

module "dynamodb" {
  source = "./services/dynamodb"
}

# EVENTBRIDGE MODULE

module "eventbridge" {
  source                       = "./services/eventbridge"
  peakcore_cluster_arn         = module.fargate.peakcore_cluster_arn
  peakcore_task_definition_arn = module.fargate.peakcore_task_definition_arn
  eventbridge_role_arn         = module.iam.eventbridge_role_arn
}

# FARGATE MODULE 

module "fargate" {
  source                     = "./services/fargate"
  dynamodb_table_name        = module.dynamodb.dynamodb_table_name
  sqs_notification_queue_url = module.sqs.sqs_notification_queue_url
  fargate_execution_role_arn = module.iam.fargate_execution_role_arn
}

#GITHUB Actions 

module "github_actions" {
  source          = "./services/github_actions"
  s3_frontend_arn = module.s3.s3_frontend_arn
}

# IAM MODULE 

module "iam" {
  source                     = "./services/iam"
  dynamodb_table_arn         = module.dynamodb.dynamodb_table_arn
  s3_frontend_arn            = module.s3.s3_frontend_arn
  sqs_queue_arn              = module.sqs.sqs_queue_arn
  sqs_notification_queue_arn = module.sqs.sqs_notification_queue_arn
}

# LAMBDA MODULE

module "lambda" {
  source                     = "./services/lambda"
  lambda_execution_role_arn  = module.iam.lambda_execution_role_arn
  sqs_queue_arn              = module.sqs.sqs_queue_arn
  sqs_queue_url              = module.sqs.sqs_queue_url
  sqs_notification_queue_arn = module.sqs.sqs_notification_queue_arn
  dynamodb_table_name        = module.dynamodb.dynamodb_table_name
  bedrock_model_id           = module.bedrock.bedrock_model_id
  ses_sender_email           = var.email_sender
  app_url                    = var.app_url
}

# S3 MODULE 

module "s3" {
  source = "./services/s3"
}

# SES MODULE 

module "ses" {
  source       = "./services/ses"
  email_sender = var.email_sender
}

# SQS MODULE 

module "sqs" {
  source = "./services/sqs"
}


