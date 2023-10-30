import boto3
import re
import json

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


bucket_name, object_key = get_bucket_and_key_from_arn(object_arn)


def get_vote_count_from_s3():
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        vote_count_json = response['Body'].read().decode('utf-8')
        vote_count_data = json.loads(vote_count_json)
        if isinstance(vote_count_data, int):
            return vote_count_data
        else:
            return vote_count_data.get('vote_count', 0)
    except (json.JSONDecodeError, KeyError, ValueError):
        return 0

def update_vote_count_in_s3(vote_count):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        vote_count_json = response['Body'].read().decode('utf-8')
        vote_count_data = json.loads(vote_count_json)
        vote_count_data['vote_count'] = vote_count
        updated_vote_count_json = json.dumps(vote_count_data)
        s3_client.put_object(Bucket=bucket_name, Key=object_key, Body=updated_vote_count_json)
    except (json.JSONDecodeError, KeyError, ValueError):
        pass

def lambda_handler(event, context):
    if event['httpMethod'] == 'GET':
        vote_count = get_vote_count_from_s3()
        return {
            'statusCode': 200,
            'body': {
                'vote_count': vote_count
            }
        }

    if event['httpMethod'] == 'POST':
        try:
            vote = event['body']['option']
        except (KeyError, TypeError):
            return {
                'statusCode': 400,
                'body': 'Invalid request format. Vote must be in the format: {"option": "Yes"} or {"option": "No"}'
            }
        
        if vote != "Yes" and vote != "No":
            return {
                'statusCode': 400,
                'body': 'Invalid vote. Only "Yes" or "No" options are allowed.'
            }

        vote_count = get_vote_count_from_s3()
        vote_count += 1
        update_vote_count_in_s3(vote_count)

        return {
            'statusCode': 200,
            'body': {
                'vote_count': vote_count
            }
        }

    return {
        'statusCode': 405,
        'body': 'Method not allowed'
    }
