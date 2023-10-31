import json
import boto3
import re

s3 = boto3.client('s3')
s3_client = boto3.client('s3')

object_arn = 'arn:aws:s3:::phantom-vote-data/vote-count.json'  # Replace with your S3 ARN or S3 URI


def get_bucket_and_key_from_arn(arn):
    match = re.match(r'arn:aws:s3:::([^/]+)/(.+)', arn)
    if match:
        bucket_name = match.group(1)
        object_key = match.group(2)
        return bucket_name, object_key
    else:
        raise ValueError('Invalid S3 ARN or URI')


bucket_name, file_name = get_bucket_and_key_from_arn(object_arn)

def lambda_handler(event, context):
    if event['httpMethod'] == 'POST':
        if isinstance(event['body'], dict):
            body = event['body']
        else:
            body = json.loads(event['body'])
        option = body['option']
        #body = json.loads(event['body'])
        if 'option' not in body or body['option'] not in ['Yes', 'No']:
            return {'statusCode': 400, 'body': 'Bad Request'}
        else:
            vote_count = body['option']
            update_vote_count(option)
            return {'statusCode': 200, 'body': 'Vote Count Updated'}
    elif event['httpMethod'] == 'GET':
        vote_count = get_vote_count()
        return {'statusCode': 200, 'body': json.dumps(vote_count)}
    else:
        return {'statusCode': 405, 'body': 'Method Not Allowed'}

def get_vote_count():
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        vote_count_json = response['Body'].read().decode('utf-8')
        vote_count_data = json.loads(vote_count_json)
        if 'Yes' in vote_count_data and 'No' in vote_count_data:
            return {'statusCode': 200, 'body': {'Yes': vote_count_data['Yes'], 'No': vote_count_data['No']}}
        else:
            return {'statusCode': 500, 'body': 'Error: Yes and No keys not found in vote data'}
    except (s3_client.exceptions.NoSuchKey, json.JSONDecodeError, KeyError, ValueError) as e:
        return {'statusCode': 500, 'body': 'Error getting the vote count'}
        
def update_vote_count(vote_count):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        vote_count_json = response['Body'].read().decode('utf-8')
        vote_count_data = json.loads(vote_count_json)
        if vote_count in vote_count_data:
            vote_count_data[vote_count] = vote_count_data.get(vote_count, 0) + 1
            updated_vote_count_json = json.dumps(vote_count_data)
            s3_client.put_object(Bucket=bucket_name, Key=file_name, Body=updated_vote_count_json)
            return True
        else:
            return False
    except (json.JSONDecodeError, KeyError, ValueError):
        return False