import json
import boto3
import os
import pickle
import numpy as np
import random

# S3 client
s3 = boto3.client('s3')

# LEN of data
INPUT_LEN = 11

# Temporary path to store the model in the Lambda environment
MODEL_PATH = '/tmp/model.pkl'

# Specify your S3 bucket and model file name
S3_BUCKET = 'myawzbucket'
MODEL_FILE = 'knn_model.pkl'

# Load the model (with caching to avoid reloading on every invocation)
model = None

def load_model_from_s3():
    global model
    if not os.path.exists(MODEL_PATH):
        print("Downloading model from S3...")
        s3.download_file(S3_BUCKET, MODEL_FILE, MODEL_PATH)
        print("Model downloaded.")
    if model is None:
        print("Loading model...")
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f) 
        print("Model loaded.")

    return model

def dummy_prediction():
    return random.random()
    

def lambda_handler(event, context):

    try:
        # Parse input from the API (assumes JSON input)
        body = json.loads(event['body'])
        input_data = body.get('data')  # Expecting {"data": [1, 2, 3, 4, 5]}
        type_data = type(input_data)

        print(f'Input Data: {input_data}')
        print(f'Type: {type_data}')
        print(f'Length: {len(input_data)}')
        
        if not input_data or not isinstance(input_data, list):
            return {
                'statusCode': 400,
                'body': json.dumps({'ERROR': 'Invalid input. Provide a list of numbers in "data".'})
            }
        if not input_data:
            return {
                'statusCode': 400,
                'body': json.dumps({'ERROR': 'Invalid input. No input data'})
            }
        if not all(isinstance(x, (int, float)) for x in input_data):
            return {
                'statusCode': 400,
                'body': json.dumps({'ERROR': 'Invalid input. All elements in the list must be numbers.'})
            }
        if len(input_data) != INPUT_LEN:
            return {
                'statusCode': 400,
                'body': json.dumps({'ERROR': 'Invalid input. Provide a list of {INPUT_LEN} numbers in "data".'})
            }
        
        # Convert input to numpy array
        input_array = np.array([input_data])
        
        # Load the model if not already loaded
        model = load_model_from_s3()
        
        # Make predictions
        prediction = model.predict(input_array)
        prediction = prediction.tolist()  # Convert numpy array to list for JSON serialization

        print(f"Prediction: {prediction}")
        
        # Return the prediction
        return {
            'statusCode': 200,
            'body': json.dumps({'prediction': prediction})
        }
    
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
