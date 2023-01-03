from flask import Flask, request
from flask_cors import CORS
from user import NewUser, User
from food import Food, AllFoods
from plan import Plan
import json

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# http://127.0.0.1:5000/login
@app.route('/login', methods=['POST'])
def login():
    json_data = request.get_json()
    user = User(json_data['username'], json_data['psw'])
    return json.dumps(user, default=lambda o: o.__dict__, indent=4)


# http://127.0.0.1:5000/newuser?email=${email}&psw=${psw}&fname=${fname}&lname=${lname}&age=${age}&sex=${sex}
# &weight=${weight}&height=${height}&activity_lvl=${activityLevel}
@app.route('/newuser', methods=['POST'])
def newuser():
    json_data = request.get_json()
    user = NewUser(json_data['fname'].lower(), json_data['lname'].lower(), json_data['email'].lower(),
                   json_data['psw'].lower(), int(json_data['age']), json_data['sex'], int(json_data['weight']),
                                                 int(json_data['height']), int(json_data['activity_lvl']))
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


# http://127.0.0.1:5000/save?user_id=${userId}&plan_name=${planName}&breakfast_ids=${breakfastIdArray}&breakfast_amount=${breakfastAmountarray}
# &lunch_ids=${lunchIdArray}&lunch_amount=${lunchAmountarray}&dinner_ids=${dinnerIdArray}&
# dinner_amount=${dinnerAmountarray}&snack_ids=${snackIdArray}&snack_amount=${snackAmountarray}
# &supper_ids=${supperIdArray}&supper_amount=${supperAmountarray}`)
@app.route('/save')
def save():
    args = request.args

    plan_name = args.get('plan_name').lower()
    user_id = args.get('user_id')

    breakfast_ids = args.get('breakfast_ids')
    if breakfast_ids != 'None':
        breakfast_ids = [int(i) for i in breakfast_ids.split(',')]
        breakfast_amount = args.get('breakfast_amount')
        breakfast_amount = [int(i) for i in breakfast_amount.split(',')]
        breakfast = {'name': 'breakfast', 'ids': [], 'values': []}
        for id, value in zip(breakfast_ids, breakfast_amount):
            breakfast['ids'].append(id)
            breakfast['values'].append(value)
    else:
        breakfast = None

    lunch_ids = args.get('lunch_ids')
    if lunch_ids != 'None':
        lunch_ids = [int(i) for i in lunch_ids.split(',')]
        lunch_amount = args.get('lunch_amount')
        lunch_amount = [int(i) for i in lunch_amount.split(',')]
        lunch = {'name': 'lunch', 'ids': [], 'values': []}
        for id, value in zip(lunch_ids, lunch_amount):
            lunch['ids'].append(id)
            lunch['values'].append(value)
    else:
        lunch = None

    dinner_ids = args.get('dinner_ids')
    if dinner_ids != 'None':
        dinner_ids = [int(i) for i in dinner_ids.split(',')]
        dinner_amount = args.get('dinner_amount')
        dinner_amount = [int(i) for i in dinner_amount.split(',')]
        dinner = {'name': 'dinner', 'ids': [], 'values': []}
        for id, value in zip(dinner_ids, dinner_amount):
            dinner['ids'].append(id)
            dinner['values'].append(value)
    else:
        dinner = None
        
    snack_ids = args.get('snack_ids')
    if snack_ids != 'None':
        snack_ids = [int(i) for i in snack_ids.split(',')]
        snack_amount = args.get('snack_amount')
        snack_amount = [int(i) for i in snack_amount.split(',')]
        snack = {'name': 'snack', 'ids': [], 'values': []}
        for id, value in zip(snack_ids, snack_amount):
            snack['ids'].append(id)
            snack['values'].append(value)
    else:
        snack = None
        
    supper_ids = args.get('supper_ids')
    if  supper_ids != 'None':
        supper_ids = [int(i) for i in supper_ids.split(',')]
        supper_amount = args.get('supper_amount')
        supper_amount = [int(i) for i in supper_amount.split(',')]
        supper = {'name': 'supper', 'ids': [], 'values': []}
        for id, value in zip(supper_ids, supper_amount):
            supper['ids'].append(id)
            supper['values'].append(value)
    else:
        supper = None

    plan = {'user_id': user_id, 'plan_name': plan_name, 'breakfast': breakfast, 'lunch': lunch, 'dinner': dinner, 'snack': snack, 'supper': supper}
    save_status = Plan(**plan).save_plan(**plan)
    return json.dumps(save_status, default=lambda o: o.__dict__, indent=4)


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
