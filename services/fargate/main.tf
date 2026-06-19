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
                { name = "SQS_NOTIFICATION_QUEUE_URL", value = var.sqs_notification_queue_url }
            ]
        }
    ])
}

data "aws_vpc" "default" {
    default = true 
}

data "aws_subnets" "default" {
    filter {
        name = "vpc-id"
        values = [data.aws_vpc.default.id]
    }
}

resource "aws_security_group" "peakcore_fargate_sg" {
    name = "peakcore-fargate-sg"
    vpc_id = data.aws_vpc.default.id
    egress {
        from_port = 0
        to_port = 0 
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_ecs_service" "peakcore_staleness_service" {

    network_configuration {
      subnets = data.aws_subnets.default.ids
      security_groups = [aws_security_group.peakcore_fargate_sg.id]
      assign_public_ip = true
    }

    name = "peakcore-staleness-service"
    cluster = aws_ecs_cluster.peakcore_cluster.id
    task_definition = aws_ecs_task_definition.peakcore_task.arn
    launch_type = "FARGATE"
    desired_count = 0
}

