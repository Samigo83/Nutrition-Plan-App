from config import connection


class NewUser:
    def __init__(self, fname, lname, email, password, age, sex, weight, height, activity_lvl):
        sql = "SELECT email FROM users"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        db_emails = query_cursor.fetchall()
        if query_cursor.rowcount > 0:
            for db_email in db_emails:
                if db_email[0].upper() == email.upper():
                    self.active = False
                    return
                else:
                    user_sql = f"INSERT INTO users(fname, lname, email, password, age, sex, weight, height, activity_lvl) VALUES " \
                               f"('{fname}', '{lname}', '{email}', '{password}', '{age}', '{sex}', '{weight}', '{height}', '{activity_lvl}')"
                    query_cursor = connection.cursor()
                    query_cursor.execute(user_sql)
                    self.active = True
                    return
        else:
            user_sql = f"INSERT INTO users(fname, lname, email, password, age, sex, weight, height, activity_lvl) VALUES " \
                       f"('{fname}', '{lname}', '{email}', '{password}', '{age}', '{sex}', '{weight}', '{height}', '{activity_lvl}')"
            query_cursor = connection.cursor()
            query_cursor.execute(user_sql)
            self.active = True


class User:
    def __init__(self, email, password):
        sql = f"SELECT * FROM users WHERE email = '{email}' and password = '{password}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        user = query_cursor.fetchone()
        if query_cursor.rowcount > 0 and email.lower() == user[3].lower() and password.lower() == user[4].lower():
            self.id = user[0]
            self.fname = user[1]
            self.lname = user[2]
            self.name = f"{user[1]} {user[2]}".title()
            self.email = user[3]
            self.age = user[5]
            self.sex = user[6]
            self.weight = user[7]
            self.height = user[8]
            self.activity_lvl = user[9]
            self.plans = []
            self.active = True
            self.total_calories = count_calories(self.sex, self.weight, self.height, self.age, self. activity_lvl)

            sql = f"SELECT plan_name FROM user_plans WHERE {self.id}"
            query_cursor = connection.cursor()
            query_cursor.execute(sql)
            if query_cursor.rowcount > 0:
                plans = query_cursor.fetchall()
                for plan in plans:
                    self.plans.append(plan)
        else:
            self.active = False


def update_user(id, age, sex, weight, height, activity_lvl):
    sql = f"UPDATE users SET age = {age}, sex = '{sex}', weight = {weight}, height = {height}, " \
               f"activity_lvl = {activity_lvl} WHERE id = {id}"
    query_cursor = connection.cursor()
    query_cursor.execute(sql)

def delete_user(id):
    sql = f"DELETE FROM users where id = '{id}'"
    query_cursor = connection.cursor()
    query_cursor.execute(sql)

def count_calories(sex, weight, height, age, activity_lvl):
    if sex == "m":
        total_calories = int(10 * weight + 6.25 * height - 5 * age + 5)
        if activity_lvl > 0:
            if activity_lvl == 1:
                total_calories += 400
            elif activity_lvl == 2:
                total_calories += 800
            elif activity_lvl == 3:
                total_calories += 1200
            else:
                total_calories += 1600
    else:
        total_calories = int(10 * weight + 6.25 * height - 5 * age - 161)
        if activity_lvl > 0:
            if activity_lvl == 1:
                total_calories += 400
            elif activity_lvl == 2:
                total_calories += 800
            elif activity_lvl == 3:
                total_calories += 1200
            else:
                total_calories += 1600
    return total_calories


if __name__ == '__main__':
    pass
