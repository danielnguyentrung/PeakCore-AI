# Package Lambda Files 

data "archive_file" "validation_zip" {
  type = "zip"
  source_file = "${path.module}/peakcore_validation.py"
  output_path = "${path.module}/validation.zip"
}

data "archive_file" "core_zip" {
  type = "zip"
  source_file = "${path.module}/peakcore_core.py"
  output_path = "${path.module}/core.zip"
}

data "archive_file" "read_zip" {
  type = "zip"
  source_file = "${path.module}/peakcore_read.py"
  output_path = "${path.module}/read.zip"
}

data "archive_file" "notification_zip" {
  type = "zip"
  source_file = "${path.module}/peakcore_check.py"
  output_path = "${path.module}/notification.zip"
}

resource "aws_lambda_function" "peakcore_validation" {
  function_name = "peakcore-validation"
  runtime       = "python3.12"
  handler       = "peakcore_validation.lambda_handler"
  role          =  var.lambda_execution_role_arn 

  filename         = data.archive_file.validation_zip.output_path
  source_code_hash = data.archive_file.validation_zip.output_base64sha256


    environment {
      variables = {
        SQS_QUEUE_URL = var.sqs_queue_url
      }
    }
  }

resource "aws_lambda_function" "peakcore_read" {
  function_name = "peakcore-read"
  runtime       = "python3.12"
  handler       = "peakcore_read.lambda_handler"
  role          =  var.lambda_execution_role_arn

  filename = data.archive_file.read_zip.output_path
  source_code_hash = data.archive_file.read_zip.output_base64sha256

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = var.dynamodb_table_name
      }
    }
  }

resource "aws_lambda_function" "peakcore_core" {
  function_name = "peakcore-core"
  runtime       = "python3.12"
  handler       = "peakcore_core.lambda_handler"
  role          =  var.lambda_execution_role_arn

  filename         = data.archive_file.core_zip.output_path
  source_code_hash = data.archive_file.core_zip.output_base64sha256

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = var.dynamodb_table_name
      BEDROCK_MODEL_ID = var.bedrock_model_id
      SES_SENDER_EMAIL = var.ses_sender_email
      }
    }
  }

resource "aws_lambda_event_source_mapping" "peakcore_core_to_queue_connection" {
  event_source_arn = var.sqs_queue_arn
  function_name = aws_lambda_function.peakcore_core.arn
  batch_size = 10
}

resource "aws_lambda_function" "peakcore_check" {
  function_name = "peakcore-check"
  runtime       = "python3.12"
  handler       = "peakcore_check.lambda_handler"
  role          =  var.lambda_execution_role_arn

  filename         = data.archive_file.notification_zip.output_path
  source_code_hash = data.archive_file.notification_zip.output_base64sha256

  environment {
    variables = {
      SES_SENDER_EMAIL = var.ses_sender_email
      APP_URL = var.app_url
      }
    }
  }

resource "aws_lambda_event_source_mapping" "peakcore_check_to_queue_connection" {
  event_source_arn = var.sqs_notification_queue_arn
  function_name = aws_lambda_function.peakcore_check.arn
  batch_size = 10 
}
  