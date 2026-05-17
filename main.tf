module "api_gateway" {
  source = "./services/api_gateway"
}

module "bedrock" {
  source = "./services/bedrock"
}

module "cloudfront" {
  source = "./services/cloudfront"
}

module "cognito" {
  source = "./services/cognito"
}

module "dynamodb" {
  source = "./services/dynamodb"
}

module "eventbridge" {
  source = "./services/eventbridge"
}

module "fargate" {
  source = "./services/fargate"
}

module "iam" {
  source = "./services/iam"
}

module "lambda" {
  source                    = "./services/lambda"
  lambda_execution_role_arn = module.iam.lambda_execution_role_arn
}

module "s3" {
  source = "./services/s3"
}

module "ses" {
  source = "./services/ses"
}

module "sqs" {
  source = "./services/sqs"
}

