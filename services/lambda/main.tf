resource "aws_lambda_function" "peakcore_validation" {
  function_name = "peakcore-validation"
  runtime     = "python3.12"
  handler     = "lambda_function.lambda_handler"
  role          = var.lambda_execution_role_arn 

  filename         = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")
}

resource "aws_lambda_function" "peakcore_read" {
  function_name = "peakcore-read"
  runtime = "python3.12"
  handler = "lambda_function.lambda_handler"
  role          = var.lambda_execution_role_arn

  filename = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")
}

resource "aws_lambda_function" "peakcore_core" {
  function_name = "peakcore-core"
  runtime       = "python3.12"
  handler       = "lambda_function.lambda_handler"
  role          = var.lambda_execution_role_arn

  filename         = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")
}