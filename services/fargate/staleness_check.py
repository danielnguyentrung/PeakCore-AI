import json
import boto3
import os 
import logging 
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client("sqs")
dynamodb = boto3.resource("dynamodb")

DYNAMODB_TABLE_NAME = os.environ["DYNAMODB_TABLE_NAME"]
SQS_NOTIFICATION_QUEUE_URL = os.environ["SQS_NOTIFICATION_QUEUE_URL"]

table = dynamodb.Table(DYNAMODB_TABLE_NAME)

WORKOUT_STALE_MAP = {
    "Beginner": 12, 
    "Intermediate": 8, 
    "Pro": 6, 
    "Expert": 6
}

def is_plan_stale(fitness_rank, plan_generated_at):
    weeks_threshold = WORKOUT_STALE_MAP.get(fitness_rank, 8)
    generated_date = datetime.fromisoformat(plan_generated_at)
    weeks_elapsed = (datetime.now(timezone.utc) - generated_date).days / 7
    return weeks_elapsed >= weeks_threshold

def scan_and_notify():
    response = table.scan()
    users = response["Items"]

    for user in users:
        user_id = user["user_id"]
        email = user["email"]
        first_name = user["profile"]["first_name"]
        fitness_rank = user["profile"]["fitness_rank"]
        plan_generated_at = user["plan_generated_at"]

        if is_plan_stale(fitness_rank, plan_generated_at):
            sqs.send_message(
                QueueUrl=SQS_NOTIFICATION_QUEUE_URL,
                MessageBody=json.dumps({
                    "user_id": user_id,
                    "email": email,
                    "first_name": first_name,
                    "fitness_rank": fitness_rank,
                    "plan_generated_at": plan_generated_at
                })
            )

            logger.info(f"Queue stale notification for {user_id}")
    
    logger.info("Scan complete.")

if __name__ == "__main__":
    scan_and_notify()