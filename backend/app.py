import json
import boto3
import os
import pickle
import numpy as np

# Load model during cold start
MODEL_PATH = "/tmp/model.h5"
S3_BUCKET = "s3-bucket-name"
MODEL_KEY = "model.pkl"

def load_model():
    if not os.path.exists(MODEL_PATH):
        s3 = boto3.client("s3")
        s3.download_file(S3_BUCKET, MODEL_KEY, MODEL_PATH)
    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)

model = load_model()

def handler(event, context):
    try:
        body = json.loads(event["body"])
        features = np.array(body["features"]).reshape(1, -1)
        prediction = model.predict(features)
        return {
            "statusCode": 200,
            "body": json.dumps({"prediction": prediction.tolist()})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

