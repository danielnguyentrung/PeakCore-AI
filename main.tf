# API GATEWAY MODULE 
module "api_gateway" {
  source = "./services/api_gateway"
  peakcore_validation_arn = module.lambda.peakcore_validation_arn
  peakcore_read_arn = module.lambda.peakcore_read_arn
  user_pool_id = module.cognito.user_pool_id
  user_pool_client_id = module.cognito.user_pool_client_id
}

# BEDROCK MODULE 

module "bedrock" {
  source = "./services/bedrock"
  peakcore_model = var.peakcore_model 
}

# CLOUDFRONT MODULE 

module "cloudfront" {
  source = "./services/cloudfront"
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
  source = "./services/eventbridge"
}

# FARGATE MODULE 

module "fargate" {
  source = "./services/fargate"
  dynamodb_table_name = module.dynamodb.dynamodb_table_name
  sqs_queue_url = module.sqs.sqs_queue_url
}

# IAM MODULE 

module "iam" {
  source = "./services/iam"
  dynamodb_table_arn = module.dynamodb.dynamodb_table_arn
  s3_frontend_arn = module.s3.s3_frontend_arn
  s3_workout_plans_arn = module.s3.s3_workout_plans_arn
  sqs_queue_arn = module.sqs.sqs_queue_arn
}

# LAMBDA MODULE

module "lambda" {
  source                    = "./services/lambda"
  lambda_execution_role_arn = module.iam.lambda_execution_role_arn
  sqs_queue_arn = module.sqs.sqs_queue_arn 
  sqs_queue_url = module.sqs.sqs_queue_url
  dynamodb_table_name = module.dynamodb.dynamodb_table_name
  bedrock_model_id = module.bedrock.bedrock_model_id
  ses_sender_email = var.email_sender
  app_url = module.api_gateway.app_url
  
}

# S3 MODULE 

module "s3" {
  source = "./services/s3"
}

# SES MODULE 

module "ses" {
  source = "./services/ses"
  email_sender = var.email_sender
}

# SQS MODULE 

module "sqs" {
  source = "./services/sqs"
}

