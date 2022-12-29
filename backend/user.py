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
        if query_cursor.rowcount > 0 and email.upper() == user[3].upper() and password.upper() == user[4].upper():
            self.id = user[0]
            self.fname = user[1]
            self.lname = user[2]
            self.name = f"{user[1]} {user[2]}".title()
            self.email = user[3]
            self.password = user[4]
            self.age = user[5]
            self.sex = user[6]
            self.weight = user[7]
            self.height = user[8]
            self.activity_lvl = user[9]
            self.active = True
            if self.sex == "M":
                self.total_calories = int(10 * self.weight + 6.25 * self.height - 5 * self.age + 5)
                if self.activity_lvl > 0:
                    if self.activity_lvl == 1:
                        self.total_calories += 400
                    elif self.activity_lvl == 2:
                        self.total_calories += 800
                    elif self.activity_lvl == 3:
                        self.total_calories += 1200
                    else:
                        self.total_calories += 1600
            else:
                self.total_calories = int(10 * self.weight + 6.25 * self.height - 5 * self.age - 161)
                if self.activity_lvl > 0:
                    if self.activity_lvl == 1:
                        self.total_calories += 400
                    elif self.activity_lvl == 2:
                        self.total_calories += 800
                    elif self.activity_lvl == 3:
                        self.total_calories += 1200
                    else:
                        self.total_calories += 1600
        else:
            self.active = False

    def update_user(self, fname, lname, email, password, age, sex, weight, height, activity_lvl):
        sql = f"UPDATE users SET fname = '{fname}', lname = '{lname}', email = '{email}', " \
                   f"password = '{password}', age = {age}, sex = '{sex}', weight = '{weight}', height = '{height}', " \
                   f"activity_lvl = {activity_lvl} WHERE id = {self.id}"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)

    def delete_user(self):
        sql = f"DELETE FROM users where id = '{self.id}'"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)




# self, fname, lname, email, password, age, sex, weight, height, activity_lvl
#NewUser("Sami", "Paananen", "sami.paananen@gmail.com", "salasana", 39, "M", 89, 173, 3)
#User("sami.paananen@gmail.com", "salasana")
#User("sami.paananen@gmail.com", "salasana").update_user("Sami", "Paananen", "sami.paananen@gmail.com", "salasana", 39, "M", 89, 173, 4)
#print(User("sami.paananen@gmail.com", "salasana").total_calories)
