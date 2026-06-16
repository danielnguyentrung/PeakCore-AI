import json
import boto3
import os
import logging
from datetime import datetime, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
bedrock = boto3.client("bedrock-runtime")
ses = boto3.client("ses")

DYNAMODB_TABLE_NAME = os.environ["DYNAMODB_TABLE_NAME"]
BEDROCK_MODEL_ID = os.environ["BEDROCK_MODEL_ID"]
SES_SENDER_EMAIL = os.environ["SES_SENDER_EMAIL"]
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

def workout_generator(profile):
    
    prompt = f"""
    You are a professional personal trainer with over 20 years of experience. You are tasked with creating a workout plan for your client. You had asked the client to answer
    a questionnaire to gather information about them. 

    Here are the questions and answers provided by the client:

    1)	What is your first name? 
        Answer: {profile["first_name"]}

    2)	What is your last name?
        Answer: {profile["last_name"]}

    3)	What gender are you? (Male/Female)
        Answer: {profile["gender"]}

    4)	How old are you? 
        Answer: {profile["age"]}

    5)	How much do you weigh? 
        Answer: {profile["weight"]}

    6)	How tall are you? (Empty box and then we can let them choose ft/cm)
        Answer: {profile["height"]}

    7)	What are your workout goals? (Build Muscle, Build Strength, Build Cardiovascular Health, Mobility, Lose Weight, Event) 
        Answer: {profile["goals"]}

    8)	How long have you been consistently going to the gym for? (0 years, 1-2 years, 2-4 years, 5+ years) 
        Answer: {profile["fitness_experience"]}

    9)	What would you classify your experience level? (Beginner, Intermediate, Pro, Expert) 
        Answer: {profile["fitness_rank"]}

    10)	Are you training for any specific event? (Yes/No)
        Answer: {profile["event_training"]}

    11)	 Please specify the event. 
        Answer: {profile["event_name"]}

    12)	 If you are planning on participating in a fitness event, would you want a workout specifically for training for that event? (Y/N)
        Answer: {profile["event_customization"]}

    13)	 How many hours a week do you work? 
        Answer: {profile["work_hours"]}

    14)	 How long per a workout session?
        Answer: {profile["workout_duration"]}

    15)	 How demanding is your job (Low/ Moderate/ High) 
        Answer: {profile["job_difficulty"]}

    16)	 Do you have any injuries? If yes, please specify. 
        Answer: {profile["injuries"]}

    17)	 What access equipment do you have access to? (Bodyweight Only, Home gym, Full Commercial gym) 
        Answer: {profile["environment"]}

    18)	 If Home Gym was selected, please specify the gym equipment:
        Here is the list provided in the question: 
        a.	Dumbbells
        b.	Barbells + plates
        c.	Resistance bands 
        d.	Kettlebells
        e.	Bench 
        f.	Squat Rack 
        g.	Smith Machine
        h.	Cable Machle 
        i.	Leg Press Machine
        j.	Pull Up Bar 
        k.	Dip Bars 
        l.	Adjustable Bench
        m.	Other
        Answer: {profile.get("home_gym_equipment", "N/A")}

    Please structure the workout plan as follow: 
    - Weekly overview
    - Each day: Day name, muscle groups targeted, exercises with sets, reps, and rest periods 
    - Brief form notes for all exercises/complex movements 

    The workout must also consider the age of the client which is {profile["age"]} years old 

    Each session should be approximately {profile["workout_duration"]} minutes long 

    Consider that this person works {profile["work_hours"]} hours per week with {profile["job_difficulty"]} job demands when scheduling intensity and recovery days.

    Their primary goals are: {profile["goals"]}

    Ensure all exercises are appropriate for someone with the following injuries or limitations: {profile["injuries"]}

    Based on the equipment create a workout based on the setting they have access to: {profile["environment"]}. 
    
    If they have a home gym utilize the equipment they have selected: Equipment: {profile.get("home_gym_equipment", "N/A")}. If the home gym was not select you may ignore this 

    Include a brief motivational message for the client. 

    """

    response = bedrock.converse(
        modelId=BEDROCK_MODEL_ID,
        messages=[
            {"role": "user", "content": [{"text":prompt}]}
        ]
    )

    workout_plan = response["output"]["message"]["content"][0]["text"]

    return workout_plan


def db_store(user_id, email, profile, workout_plan):
    table.put_item(
        Item={
            "user_id": user_id,
            "email": email, 
            "profile": profile, 
            "workout_plan": workout_plan, 
            "plan_generated_at": datetime.now(timezone.utc).isoformat()
        }
    )

    logger.info(f"Saved workout plan for {user_id}")
    return


def send_email(email, workout_plan):
    ses.send_email(
        Source=SES_SENDER_EMAIL, 
        Destination={"ToAddresses": [email]},
        Message={
            "Subject": {"Data": "Your AI Gym trainer has created a Workout Plan for you!"},
            "Body": {
                "Text": {"Data": workout_plan}
                }
            }
        )
    logger.info(f"Sent workout plan email to {email}")
    return


def lambda_handler(event, context):

    for record in event["Records"]:
        body = json.loads(record.get("body") or "{}") 

        user_id = body["user_id"]
        email = body["email"]
        profile = body["profile"]

        workout_plan = workout_generator(profile)

        db_store(user_id, email, profile, workout_plan)
        send_email(email, workout_plan)
        logger.info(f"Successfully processed workout plan for {user_id}")




