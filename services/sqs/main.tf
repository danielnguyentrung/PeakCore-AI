resource "aws_sqs_queue" "peakcore_queue" {
  name                       = "peakcore-queue"
  visibility_timeout_seconds = 600
}

resource "aws_sqs_queue" "peakcore_notification_queue" {
  name = "peakcore_notification_queue"
}