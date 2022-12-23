from flask import Flask, request
from flask_cors import CORS
from user import NewUser, User
import json

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# http://127.0.0.1:5000/login?username=x&password=x
@app.route('/login')
def login():
    args = request.args
    user = args.get('username')
    psw = args.get('password')
    user = User(user, psw)
    return json.dumps(user, default=lambda o: o.__dict__, indent=4)


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)