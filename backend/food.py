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
    def __init__(self, name: str, id: int, carbs: float, energy: float, fat: float, protein: float):
        self.name = name
        self.id = id
        self.carbs = carbs
        self.energy = energy
        self.fat = fat
        self.protein = protein

def get_all_food_items():

    global food_name
    all_foods = []
    sql = "SELECT food.foodname, food.foodid, bestloc, component.eufdname FROM food, component_value, component " \
          "WHERE food.foodid = component_value.foodid and component_value.eufdname = component.eufdname " \
          "AND food.foodid = food.foodid and component.eufdname in ('ENERC', 'FAT', 'CHOAVL', 'PROT') " \
          "order by food.foodid asc"
    query_cursor = connection.cursor()
    query_cursor.execute(sql)
    foods = query_cursor.fetchall()
    i = 0
    for food in foods:
        if i == 0:
            food_name = food[0]
            food_id = food[1]
            food_energy = round(float(food[2].replace(',', '.')) * 0.2390, 1)
            i += 1
        elif i == 1:
            food_fat = round(float(food[2].replace(',', '.')), 1)
            i += 1
        elif i == 2:
            food_carbs = round(float(food[2].replace(',', '.')), 1)
            i += 1
        else:
            food_protein = round(float(food[2].replace(',', '.')), 1)
            food_item = AllFoods(food_name, food_id, food_carbs, food_energy, food_fat, food_protein)
            all_foods.append(food_item)
            i = 0
    return all_foods


if __name__ == '__main__':
    foods = get_all_food_items()
    for food in foods:
        print(food.energy)