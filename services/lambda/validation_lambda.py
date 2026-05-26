import json
import boto3
import os 
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client("sqs")
SQS_QUEUE_URL = os.environ["SQS_QUEUE_URL"]

INPUT_FIELDS = {
    "first_name": str,
    "last_name": str,
    "gender": str, 
    "age":int, 
    "weight": int, 
    "height": int,
    "fitness_experience": str,
    "fitness_rank": str, 
    "event_training": bool,
    "event_name": str,
    "event_customization": bool,
    "work_hours": int,
    "workout_duration": int, 
    "job_difficulty": str, 
    "injuries": str,
    "environment_preference": str
}

MULTISELECT_FIELDS = [
    "goals", "home_gym_equipment"
]

def input_validation(body, input_fields):

    for key, value in input_fields.items():
        if key not in body or body[key] == "" or body[key] is None:
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} is required"})}
        
        if value == int and isinstance(body[key], bool):
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} must be of an integer"})}
        
        if not isinstance(body[key], value):
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} must be of type {value}"})}
    
    return 


def multiselect_validation(body, multi_fields):

    for field in multi_fields:

        if field not in body:
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} is required"})}
        
        if not isinstance(body[field], list):
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} must be of type array"})}
        
        if len(body[field]) == 0:
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} cannot be empty"})}

    


def lambda_handler(event, context):