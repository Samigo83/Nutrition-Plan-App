from food import Food


class Meal:
    def __init__(self, **kwargs):
        self.name = kwargs['name']
        self.carb_amount = 0
        self.fat_amount = 0
        self.protein_amount = 0
        self.energy_amount = 0
        self.objects = []

        if kwargs is not None:
            for id, value in zip(kwargs['ids'], kwargs['values']):
                food_item = Food(id, value)
                self.carb_amount += round(float(food_item.carbs * (value/100)), 1)
                self.fat_amount += round(float(food_item.fat * (value/100)), 1)
                self.protein_amount += round(float(food_item.protein * (value/100)), 1)
                self.energy_amount += round(float(food_item.energy * (value/100)), 1)
                self.objects.append(food_item)


if __name__=='__main__':
    print(Meal(**{'name': 'breakfast', 'ids': [5], 'values': [133]}).energy_amount)
