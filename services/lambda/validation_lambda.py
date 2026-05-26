import json
import boto3
import os 
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client("sqs")
SQS_QUEUE_URL = os.environ["SQS_QUEUE_URL"]

input_fields = {
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

multiselect_fields = [
    "goals", "home_gym_equipment"
]

def input_validation(body, input_fields):

    for key, value in input_fields.items():
        if key not in body or body[key] == "" or body[key] is None:
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} is required"})}
        
        if value == int and isinstance(body[key], bool):
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} must be of an integer"})}
        
        if not isinstance(body[key], value):
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} must be of type {value.__name__}"})}
    
    return 


def multiselect_validation(body, multi_fields):

    for field in multi_fields:

        if field not in body:
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} is required"})}
        
        if not isinstance(body[field], list):
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} must be of type array"})}
        
        if len(body[field]) == 0:
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} cannot be empty"})}
    
    return

def conditional_validation():

    
def lambda_handler(event, context):
    body = json.loads(event.get("body") or "{}")

    input_error = input_validation(body, input_fields)
    if input_error: 
        return input_error
    multiselect_error = multiselect_validation(body, multiselect_fields)
    if multiselect_error:
        return multiselect_error
    
    if body["event_name"] 
    
    claims = event["requestContext"]["authorizer"]["claims"]
    user_id = claims["sub"]
    user_email = claims["email"]

