from meal import Meal
from config import connection


class Plan:
    def __init__(self, **kwargs):
        self.name = kwargs['plan_name']
        self.total_carb = 0
        self.total_fat = 0
        self.total_protein = 0
        self.total_energy = 0
        if kwargs['breakfast'] is not None:
            self.breakfast = Meal(**kwargs['breakfast'])
            self.total_carb += self.breakfast.carb_amount
            self.total_fat += self.breakfast.fat_amount
            self.total_protein += self.breakfast.protein_amount
            self.total_energy += self.breakfast.energy_amount
        if kwargs['lunch'] is not None:
            self.lunch = Meal(**kwargs['lunch'])
            self.total_carb += self.lunch.carb_amount
            self.total_fat += self.lunch.fat_amount
            self.total_protein += self.lunch.protein_amount
            self.total_energy += self.lunch.energy_amount
        if kwargs['dinner'] is not None:
            self.dinner = Meal(**kwargs['dinner'])
            self.total_carb += self.dinner.carb_amount
            self.total_fat += self.dinner.fat_amount
            self.total_protein += self.dinner.protein_amount
            self.total_energy += self.dinner.energy_amount
        if kwargs['snack'] is not None:
            self.snack = Meal(**kwargs['snack'])
            self.total_carb += self.snack.carb_amount
            self.total_fat += self.snack.fat_amount
            self.total_protein += self.snack.protein_amount
            self.total_energy += self.snack.energy_amount
        if kwargs['supper'] is not None:
            self.supper = Meal(**kwargs['supper'])
            self.total_carb += self.supper.carb_amount
            self.total_fat += self.supper.fat_amount
            self.total_protein += self.supper.protein_amount
            self.total_energy += self.supper.energy_amount


def save_plan(**kwargs):
    sql = f"SELECT plan_name FROM user_plans, users WHERE users.id = user_plans.user_id AND users.id = '{kwargs['user_id']}'"
    query_cursor = connection.cursor()
    query_cursor.execute(sql)
    plan_names = query_cursor.fetchall()
    for name in plan_names:
        if name[0] == kwargs['plan_name']:
            return False
    sql = f"INSERT INTO user_plans (plan_name, user_id) VALUES ('{kwargs['plan_name']}', {kwargs['user_id']});"
    query_cursor.execute(sql)
    sql = f"SELECT id FROM user_plans WHERE plan_name = '{kwargs['plan_name']}' AND user_id = {kwargs['user_id']}"
    query_cursor.execute(sql)
    plan_id = query_cursor.fetchone()[0]
    if kwargs['breakfast'] is not None:
        for id, value in zip(kwargs['breakfast']['ids'], kwargs['breakfast']['values']):
            sql = f"INSERT INTO plan_br (plan_id, br_id, br_amount) VALUES ({plan_id}, {id}, {value})"
            query_cursor.execute(sql)
    if kwargs['lunch'] is not None:
        for id, value in zip(kwargs['lunch']['ids'], kwargs['lunch']['values']):
            sql = f"INSERT INTO plan_lnc (plan_id, lnc_id, lnc_amount) VALUES ({plan_id}, {id}, {value})"
            query_cursor.execute(sql)
    if kwargs['dinner'] is not None:
        for id, value in zip(kwargs['dinner']['ids'], kwargs['dinner']['values']):
            sql = f"INSERT INTO plan_din (plan_id, din_id, din_amount) VALUES ({plan_id}, {id}, {value})"
            query_cursor.execute(sql)
    if kwargs['snack'] is not None:
        for id, value in zip(kwargs['snack']['ids'], kwargs['snack']['values']):
            sql = f"INSERT INTO plan_snc (plan_id, snc_id, snc_amount) VALUES ({plan_id}, {id}, {value})"
            query_cursor.execute(sql)
    if kwargs['supper'] is not None:
        for id, value in zip(kwargs['supper']['ids'], kwargs['supper']['values']):
            sql = f"INSERT INTO plan_sup (plan_id, sup_id, sup_amount) VALUES ({plan_id}, {id}, {value})"
            query_cursor.execute(sql)
    return True


def get_plan(user_id, plan_name):
    sql = f"SELECT user_plans.id, user_plans.plan_name FROM user_plans, users WHERE users.id = user_plans.user_id AND " \
          f"users.id = '{user_id}' AND plan_name = '{plan_name}'"
    query_cursor = connection.cursor()
    query_cursor.execute(sql)
    result = query_cursor.fetchone()
    plan_id = result[0]
    plan_name = result[1]

    sql= f"SELECT br_id, br_amount FROM users, user_plans, plan_br WHERE users.id = user_plans.user_id " \
         f"AND user_plans.id = plan_br.plan_id AND user_plans.id = {plan_id}"
    query_cursor.execute(sql)
    if query_cursor.rowcount > 0:
        breakfast_items = query_cursor.fetchall()
        breakfast = {'name': 'breakfast', 'ids': [], 'values': []}
        for item in breakfast_items:
            breakfast['ids'].append(item[0])
            breakfast['values'].append(item[1])
    else:
        breakfast = None

    sql= f"SELECT lnc_id, lnc_amount FROM users, user_plans, plan_lnc WHERE users.id = user_plans.user_id " \
         f"AND user_plans.id = plan_lnc.plan_id AND user_plans.id = {plan_id}"
    query_cursor.execute(sql)
    if query_cursor.rowcount > 0:
        lunch_items = query_cursor.fetchall()
        lunch = {'name': 'lunch', 'ids': [], 'values': []}
        for item in lunch_items:
            lunch['ids'].append(item[0])
            lunch['values'].append(item[1])
    else:
        lunch = None

    sql= f"SELECT din_id, din_amount FROM users, user_plans, plan_din WHERE users.id = user_plans.user_id " \
         f"AND user_plans.id = plan_din.plan_id AND user_plans.id = {plan_id}"
    query_cursor.execute(sql)
    if query_cursor.rowcount > 0:
        dinner_items = query_cursor.fetchall()
        dinner = {'name': 'dinner', 'ids': [], 'values': []}
        for item in dinner_items:
            dinner['ids'].append(item[0])
            dinner['values'].append(item[1])
    else:
        dinner = None

    sql = f"SELECT snc_id, snc_amount FROM users, user_plans, plan_snc WHERE users.id = user_plans.user_id " \
          f"AND user_plans.id = plan_snc.plan_id AND user_plans.id = {plan_id}"
    query_cursor.execute(sql)
    if query_cursor.rowcount > 0:
        snack_items = query_cursor.fetchall()
        snack = {'name': 'snack', 'ids': [], 'values': []}
        for item in snack_items:
            snack['ids'].append(item[0])
            snack['values'].append(item[1])
    else:
        snack = None

    sql = f"SELECT sup_id, sup_amount FROM users, user_plans, plan_sup WHERE users.id = user_plans.user_id " \
          f"AND user_plans.id = plan_sup.plan_id AND user_plans.id = {plan_id}"
    query_cursor.execute(sql)
    if query_cursor.rowcount > 0:
        supper_items = query_cursor.fetchall()
        supper = {'name': 'supper', 'ids': [], 'values': []}
        for item in supper_items:
            supper['ids'].append(item[0])
            supper['values'].append(item[1])
    else:
        supper = None

    plan = {'plan_name': plan_name, 'breakfast': breakfast, 'lunch': lunch, 'dinner': dinner, 'snack': snack, 'supper': supper}
    user_plan = Plan(**plan)
    return user_plan
