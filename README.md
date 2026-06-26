# PeakCore AI 

An AI-powered fitness application that generates personalized workout plans built on AWS leveraging Amazon S3, CloudFront, API Gateway, AWS Cognito, SQS, Lambda, Bedrock, SES, and Eventbridge. 

## Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Infrastructure**

![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

**AWS Services**

![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Amazon DynamoDB](https://img.shields.io/badge/Amazon_DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![Amazon SQS](https://img.shields.io/badge/Amazon_SQS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon SES](https://img.shields.io/badge/Amazon_SES-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon Cognito](https://img.shields.io/badge/Amazon_Cognito-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![API Gateway](https://img.shields.io/badge/API_Gateway-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![CloudFront](https://img.shields.io/badge/CloudFront-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon Bedrock](https://img.shields.io/badge/Amazon_Bedrock-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon ECS](https://img.shields.io/badge/Amazon_ECS-FF9900?style=for-the-badge&logo=amazonecs&logoColor=white)
![EventBridge](https://img.shields.io/badge/EventBridge-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

## Objective 

Workout plans take time to create, research, and customize to fit our environment and schedules. With PeakCore AI, users can generate a personalized workout plan tailored to their schedule and environment within minutes.

## Solution Overview 

Users create an account on the PeakCore AI website and fill out a questionnaire covering their measurements, schedule, environment, and fitness goals. Once submitted, the data is sent to the backend where a validation Lambda function reviews the input. If valid, it is passed to the core Lambda function which uses AI to generate a personalized workout plan. The user then receives an email with a link to view their plan on the website.

### Workflow 

#### New Users 

1. User creates an account on the PeakCore AI website.
2. Once the account is created, the user is directed to the home page and selects "Get Started Free" to begin the questionnaire.
3. Once the questionnaire is completed, the user selects submit and the data is sent from the frontend through API Gateway to the validation Lambda function.
4. The validation Lambda function checks that all fields in the questionnaire have been provided. It also sets a cooldown timer on submission to prevent duplicate requests. If the user submits multiple requests within the cooldown period, they will be denied until the timer expires.
5. Once the data has been validated, the validation Lambda sends the data to an SQS queue, which triggers the core Lambda function.
6. The core Lambda function will:
- Send the questionnaire data to Amazon Bedrock using a Claude AI model to generate a personalized workout plan
- Store the user data and AI-generated workout plan in DynamoDB
- Send an email to the user via SES with a link to view their workout plan on the website

#### Returning Users 

1. User logs into the PeakCore AI website.
2. User hovers over their first name and selects "My Workout Plan" from the dropdown menu.
3. The read Lambda function is triggered and retrieves the user's workout plan from DynamoDB.
4. If the workout plan is found, it is displayed on the frontend. If not, the user receives a 404 error: "No workout plan found, please generate a plan first."

### Expiring Workout Plans

1. EventBridge triggers a Fargate task every day at midnight to scan DynamoDB and evaluate the age of each user's workout plan based on their fitness level.
2. Once the scan is complete, the data is sent to the notification SQS queue.
3. The check Lambda function processes each record:
- If the workout plan is stale, an email is sent to the user via SES prompting them to generate a new plan.
- If the workout plan is not stale, no action is taken.


### Architecture Diagram

## Lessons Learned 