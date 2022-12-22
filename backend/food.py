from config import connection


class Food:
    def __init__(self, id):
        sql = f"SELECT food.foodname, bestloc, component.eufdname, compunit FROM food, component_value, component " \
              f"WHERE food.foodid = component_value.foodid and component_value.eufdname = component.eufdname " \
              f"AND food.foodid = {id} and component.eufdname in ('ENERC', 'FAT', 'CHOAVL', 'PROT')"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        food = query_cursor.fetchall()
        self.name = food[0][0]
        self.energy = round(float(food[0][1].replace(',', '.')) * 0.2390, 1)
        self.fat = round(float(food[1][1].replace(',', '.')), 1)
        self.carbs = round(float(food[2][1].replace(',', '.')), 1)
        self.protein = round(float(food[3][1].replace(',', '.')), 1)


