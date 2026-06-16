resource "aws_sqs_queue" "peakcore_queue" {
    name = "peakcore-queue"
}

resource "aws_sqs_queue" "peakcore_notification_queue" {
    name = "peakcore_notification_queue"
}