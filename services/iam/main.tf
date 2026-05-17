# LAMBDA 

# JSON of Lambda Iam Policy

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Lambda Policy

resource "aws_iam_role" "lambda_execution_role" {
  name               = "lambda-execution-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

# Lambda policy attachment to lambda function

resource "aws_iam_role_policy_attachment" "lambda_execution_role_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# BEDROCK 

# JSON of Bedrock IAM Policy

data "aws_iam_policy_document" "bedrock_invoke_role" {
  statement {
    effect = "Allow"

    actions = ["bedrock:InvokeModel"]
    resources = ["*"]
  }
}

# Bedrock Policy 

resource "aws_iam_policy" "bedrock_invoke_policy" {
  name = "bedrock-invoke-policy"
  policy = data.aws_iam_policy_document.bedrock_invoke_role.json
}

# Bedrock Policy attachment to Lambda Function

resource "aws_iam_role_policy_attachment" "bedrock_policy_attachment" {
  role    = aws_iam_role.lambda_execution_role.name 
  policy_arn = aws_iam_policy.bedrock_invoke_policy.arn
}

# DYNAMODB 

# JSON of DynamoDB IAM Policy 

data "aws_iam_policy_document" "dynamodb_role" { 
  statement {
    effect = "Allow" 
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem", 
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan" 
    ]
    resources = ["*"]
  }
}


# DynamoDB policy 

resource "aws_iam_policy" "dynamodb_policy" {
  name = "dynamodb-policy"
  policy = data.aws_iam_policy_document.dynamodb_role.json
}

# DynamoDB policy attachment to Lambda Function

  resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
    role    = aws_iam_role.lambda_execution_role.name
    policy_arn = aws_iam_policy.dynamodb_policy.arn
}

# S3 

# JSON S3 IAM Policy 

data "aws_iam_policy_document" "s3_role" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]
    resources = ["*"]
  }
}

# S3 policy 

resource "aws_iam_policy" "s3_policy" {
  name = "s3-policy"
  policy = data.aws_iam_policy_document.s3_role.json
}

# s3 policy attachment 

resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role = aws_iam_role.lambda_execution_role.name 
  policy_arn = aws_iam_policy.s3_policy.arn
}

# SQS 

# JSON of SQS Queue IAM Policy

data "aws_iam_policy_document" "sqs_role" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:SendMessage",
      "sqs:ReceiveMessage", 
      "sqs:DeleteMessage"
    ]
    resources = ["*"]
  }
}

# SQS Queue Policy

resource "aws_iam_policy" "sqs_policy" {
  name = "sqs-policy" 
  policy = data.aws_iam_policy_document.sqs_role.json
}

# SQS Policy Attachment 

resource "aws_iam_role_policy_attachment" "sqs_policy_attachment" {
  role = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.sqs_policy.arn
}

# SES 

# JSON of SES IAM Policy

data "aws_iam_policy_document" "ses_role" {
  statement {
    effect = "Allow"
    actions = [
      "ses:SendEmail", 
      "ses:SendRawEmail"
    ]
    resources = ["*"]
  }
}

# SES Policy

resource "aws_iam_policy" "ses_policy" {
  name = "ses-policy" 
  policy = data.aws_iam_policy_document.ses_role.json 
}

# SES Policy Attachment

resource "aws_iam_role_policy_attachment" "ses_policy_attachment" {
  role = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.ses_policy.arn
}
