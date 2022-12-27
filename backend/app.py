from flask import Flask, request
from flask_cors import CORS
from user import NewUser, User
from food import Food, AllFoods
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


# http://127.0.0.1:5000/newuser?email=${email}&psw=${psw}&fname=${fname}&lname=${lname}&age=${age}&sex=${sex}
# &weight=${weight}&height=${height}&activity_lvl=${activityLevel}
@app.route('/newuser')
def newuser():
    args = request.args
    email = args.get('email')
    psw = args.get('psw')
    fname = args.get('fname')
    lname = args.get('lname')
    age = int(args.get('age'))
    sex = args.get('sex')
    weight = int(args.get('weight'))
    height = int(args.get('height'))
    activity_lvl = int(args.get('activity_lvl'))
    user = NewUser(fname, lname, email, psw, age, sex, weight, height, activity_lvl)
    return json.dumps(user, default=lambda o: o.__dict__, indent=4)


@app.route('/login/plan')
def plan():
    return json.dumps(AllFoods(), default=lambda o: o.__dict__, indent=4)

# http://127.0.0.1:5000/fooditem?food_id=${button.value}&amount=${button.previousElementSibling.value}
@app.route('/fooditem')
def food_item():
    args = request.args
    food_id = int(args.get('food_id'))
    amount = int(args.get('amount'))
    food = Food(food_id, amount)
    return json.dumps(food, default=lambda o: o.__dict__, indent=4)

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
