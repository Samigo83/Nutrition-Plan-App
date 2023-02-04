from config import connection


class Food:
    def __init__(self, food_id, amount):
        sql = f"SELECT food.foodname, bestloc, component.eufdname, compunit FROM food, component_value, component " \
              f"WHERE food.foodid = component_value.foodid and component_value.eufdname = component.eufdname " \
              f"AND food.foodid = {food_id} and component.eufdname in ('ENERC', 'FAT', 'CHOAVL', 'PROT') " \
              f"order by eufdname asc"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        food = query_cursor.fetchall()
        self.name = food[0][0]
        self.id = food_id
        self.amount = amount
        self.energy = round(float(food[1][1].replace(',', '.')) * 0.2390,  1)
        self.fat = round(float(food[2][1].replace(',', '.')),  1)
        self.carbs = round(float(food[0][1].replace(',', '.')),  1)
        self.protein = round(float(food[3][1].replace(',', '.')),  1)

        self.total_energy = round(float(food[1][1].replace(',', '.')) * 0.2390 * amount / 100, 1)
        self.total_fat = round(float(food[2][1].replace(',', '.')) * amount / 100, 1)
        self.total_carbs = round(float(food[0][1].replace(',', '.')) * amount / 100, 1)
        self.total_protein = round(float(food[3][1].replace(',', '.')) * amount / 100, 1)

class AllFoods:
    def __init__(self):
        sql = f"SELECT foodname, foodid from food"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        foods = query_cursor.fetchall()
        self.foods = foods


class Food_values:
    def __init__(self, id):
        sql = f"SELECT bestloc FROM food, component_value, component " \
              f"WHERE food.foodid = component_value.foodid and component_value.eufdname = component.eufdname " \
              f"AND food.foodid = {id} and component.eufdname in ('ENERC', 'FAT', 'CHOAVL', 'PROT') " \
              f"order by component.eufdname asc"
        query_cursor = connection.cursor()
        query_cursor.execute(sql)
        values = query_cursor.fetchall()
        self.energy = round(float(values[1][0].replace(',', '.')) * 0.2390, 1)
        self.fat = round(float(values[2][0].replace(',', '.')), 1)
        self.carbs = round(float(values[0][0].replace(',', '.')), 1)
        self.protein = round(float(values[3][0].replace(',', '.')), 1)


if __name__ == '__main__':
    print(Food_values(153).energy)