import json
import logging
import numpy as np
import pickle
import pandas as pd
import boto3
import random
import os

model = None
preprocessor = None
status_error = None

s3 = boto3.client('s3')

# Temporary paths to store files in the Lambda env
MODEL_PATH:str = '/tmp/model.pkl'
PREPROCESSOR_PATH:str = '/tmp/preprocessor.pkl' 

# S3 paths to store files in the Lambda env
S3_BUCKET: str = 'myawzbucket'
MODEL_FILE_NAME:str = 'model.pkl'
PREPROCESSOR_FILE_NAME:str = 'preprocessor.pkl'

COLUMN_NAMES = [
    "loan_amnt",
    "funded_amnt",
    "funded_amnt_inv",
    "term",
    "int_rate",
    "installment",
    "sub_grade",
    "annual_inc",
    "verification_status",
    "dti",
    "delinq_2yrs",
    "revol_util",
    "total_acc",
    "out_prncp",
    "total_rec_prncp",
    "total_rec_int",
    "total_rec_late_fee",
    "recoveries",
    "collection_recovery_fee",
    "collections_12_mths_ex_med",
    "policy_code",
    "acc_now_delinq",
    "tot_cur_bal",
    "total_rev_hi_lim",
    "pymnt_plan",
    "home_ownership"
]

INPUT_LEN:int = len(COLUMN_NAMES) # LEN of data input

def load_files_from_s3():
    """
    Load the model from S3 if it's not already loaded.
    return: model
    params: None
    raise: Exception if the model file does not exist in S3
    """
    global model
    global preprocessor

    # Check if the files exists
    if not os.path.exists(MODEL_PATH):
        print("Downloading model from S3...")
        s3.download_file(S3_BUCKET, MODEL_FILE_NAME, MODEL_PATH)
        print("Model downloaded.")
    if not os.path.exists(PREPROCESSOR_PATH):
        print("Downloading preprocessor from S3...")
        s3.download_file(S3_BUCKET, PREPROCESSOR_FILE_NAME, PREPROCESSOR_PATH)
        print("Preprocessor downloaded.")
    
    # If the model is already loaded, return it
    if model is not None:
        print("Model already loaded.")
    if preprocessor is not None:
        print("Preprocessor already loaded.")
    
    # If not, Load the model
    if model is None:
        print("Loading model...")
        # Unpickle the preprocessor
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded.")

    if preprocessor is None:
        print("Loading preprocessor...")
        # Unpickle the model
        with open(PREPROCESSOR_PATH, 'rb') as f:
            preprocessor = pickle.load(f)
        print("Preprocessor loaded.")

def is_valid_data(input_data):
    """
    Validate the input data.
    return: True if the input is valid, else a JSON response with an error message
    params: input_data (list of numbers)
    raise: Exception if the input data is invalid
    """
    global status_error

    if not input_data or not isinstance(input_data, list):
        status_error = {
            'statusCode': 400,
            'body': json.dumps({'ERROR': 'Invalid input. Provide a list of numbers in "data".'})
        }
        return False

    if not input_data:
        status_error = {
            'statusCode': 400,
            'body': json.dumps({'ERROR': 'Invalid input. No input data'})
        }
        return False

    if len(input_data) != INPUT_LEN:
        status_error = {
            'statusCode': 400,
            'body': json.dumps({'ERROR': f'Invalid input. Provide a list of {INPUT_LEN} numbers in "data".'})
        }
        return False
    else:
        return True

def preprocess_input(input_data):
    """
    Preprocess the input data.
    return: preprocessed input data
    params: input_data (list of numbers)
    raise: Exception if the input data is invalid or the preprocessor fails
    """
    global preprocessor

    try:
        # Convert input_data to a DataFrame
        print('Adding columns to input data...')
        input_data = pd.Series(input_data, index=COLUMN_NAMES)
        print('Converting input data to DataFrame...')
        input_data = input_data.to_frame().T
        # transforme none to np.nan
        print('Transforming None values...')
        input_data = input_data.replace('None', np.nan)
        # Preprocess the data
        print('Preprocessing data...')
        preprocessed_data = preprocessor.transform(input_data)

        return preprocessed_data

    except Exception as e:
        print('preprocess error!')
        status_error = True
        print(f"Error: {e}")
        raise e


def dummy_prediction():
    """
    Just a dummy function to test the Lambda function.
    return: a random prediction
    params: None
    raise: Exception if random function does not work
    """
    return random.random()

def model_prediction(input_data):
    """
    Make predictions using the model.
    return: prediction (number from 0 to 1)
    params: input_data (list of numbers)
    raise: Exception if the model.predict function fails
    """
    global model
    y_pred = model.predict(input_data)

    return y_pred

def lambda_handler(event, context):
    """
    Lambda function handler.
    return: JSON response
    params: event (API Gateway input), context (Lambda context)
    raise: Exception if the input data is invalid or the model fails
    """
    global model
    global status_error

    try:
        body = event.get("body")
        if body:
            # Parse the JSON string
            parsed_body = json.loads(body)
            # Access the "features" key inside "data"
            input_data = parsed_body.get("data")
            # Get the type and length of the input data
            type_data = type(input_data)
            input_items = len(input_data)
            # Debugging logs
            print(f'Input Data: {str(input_data)}')
            print(f'Type: {type_data}')
            print(f'Length: {input_items}')
            #logging.debug(f'Input Data: {str(input_data)}')
            #logging.debug(f'Type: {type_data}')
            #logging.debug(f'Length: {input_data}')
        
        # Validate input
        if is_valid_data(input_data):
            print('Processing data...')
            # Load the model if not already loaded
            load_files_from_s3()
            # Convert input to numpy array
            preprocessed_data = preprocess_input(input_data)
            print(f'Preprocessed Data: {preprocessed_data}')
            # Make predictions
            prediction = model.predict(preprocessed_data)
            print(f"Prediction: {prediction}")
            prediction = prediction.tolist()  # Convert numpy array to list for JSON serialization
            # Put prediction in logs
            print(f"Prediction List: {prediction}")
            #logging.info(f"Prediction: {prediction}")
            # Return the prediction
            return {
                'statusCode': 200,
                'body': json.dumps({'prediction': prediction})
            }
        else:
            return status_error
    
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': [json.dumps({'error': str(e)}), input_data]
        }
