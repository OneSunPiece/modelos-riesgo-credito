# Quickstart

1. make venv
```sh
python3 -m venv .venv
```

2. activate env
```sh
source .venv/bin/activate
```

3. Enjoy (?)

---

For test 

```sh
curl -X POST "https://<api_gateway_url>/predict" \
     -H "Content-Type: application/json" \
     -d '{"features": [1.2, 3.4, 5.6]}'
```