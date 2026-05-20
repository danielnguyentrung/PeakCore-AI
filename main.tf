# API GATEWAY MODULE 
module "api_gateway" {
  source = "./services/api_gateway"
}

# BEDROCK MODULE 

module "bedrock" {
  source = "./services/bedrock"
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

