## How to deploy?

1. Login into AWS ecr with docker credentials
```SH
aws ecr get-login-password --region [aws_region] | docker login --username [username] --password-stdin [aws_account_id].dkr.ecr.[aws_region].amazonaws.com
```

2. Build the docker image, provide a tag and the dockerfile location
```SH
docker build -t [tag] [dockerfile_location]
```

3. Tag it
```SH
docker tag test/lambda-model-api:latest [aws_account_id].dkr.ecr.[aws_region].amazonaws.com/[tag]:latest
```

4. Push it into ECR
```SH
docker push [aws_account_id].dkr.ecr.[aws_region].amazonaws.com/[repository]:latest
```


## How to test it?

Way to test the lambda

```JSON
{
  "resource": "/",
  "path": "/",
  "httpMethod": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"data\": [5000.00, 0.00, 10.65, 162.87, 4.00, 12.00, 1.00, 24000.00, 2.00, 1.00, 0.00]}",
  "isBase64Encoded": false
}
```