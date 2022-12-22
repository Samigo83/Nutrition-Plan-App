import requests
import json

token_url = "https://oauth.fatsecret.com/connect/token"

params = {
    'grant_type': 'client_credentials',
    'client_id': '675e0d6a1de14e47a9629db31a339338',
    'client_secret': '0bb9ca93031a4019b800f0e9abc3a420',
    'scope': 'basic',
}

headers = {
    'content-type': 'application/x-www-form-urlencoded'
}

token = requests.post(token_url, data=params, headers=headers)
data = token.json()

# Replace this with the API endpoint you want to call
api_url = "https://platform.fatsecret.com/rest/server.api"

# Set up the request parameters
params = {
    "method": "foods.search",
    "search_expression": "oatmeal",
    "format": "json",
}

# Set the "Authorization" header with the access token
headers = {
    "Authorization": f"Bearer {data['access_token']}"
}

# Send a GET request to the API endpoint
response = requests.post(api_url, data=params, headers=headers)


# The response from the API will be in JSON format
data = response.json()
json.dumps(data, indent=4)
# You can now access the data returned by the API
print(json.dumps(data, indent=4))
