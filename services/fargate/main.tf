resource "aws_ecs_cluster" "peakcore_cluster" {
    name = "peakcore-cluster"
}

resource "aws_ecr_repository" "peakcore_repository" {
    name = "peakcore-repository"
    image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecs_task_definition" "peakcore_task" {

    family = "peakcore_task"
    requires_compatibilities = ["FARGATE"]
    network_mode = "awsvpc"
    cpu = "256"
    memory = "512"
    execution_role_arn = var.fargate_execution_role_arn

    container_definitions = jsonencode([
        {
            name = "peakcore-staleness-checker"
            image = "${aws_ecr_repository.peakcore_repository.repository_url}:latest"
            environment = [
                { name = "DYNAMODB_TABLE_NAME", value = var.dynamodb_table_name },
                { name = "SQS_QUEUE_URL", value = var.sqs_queue_url }
            ]
        }
    ])
}

