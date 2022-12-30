from meal import Meal


class Plan:
    def __init__(self, **kwargs):
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


if __name__ == '__main__':
    breakfast = {'name': 'breakfast', 'ids': [5], 'values': [133]}
    lunch = {'name': 'lunch', 'ids': [5], 'values': [133]}
    dinner = {'name': 'dinner', 'ids': [5], 'values': [133]}
    snack = {'name': 'snack', 'ids': [5], 'values': [133]}
    supper = {'name': 'supper', 'ids': [5], 'values': [133]}
    kwargs = {'breakfast': breakfast, 'lunch': lunch, 'dinner': dinner, 'snack': snack, 'supper': supper}
    print(Plan(**kwargs).total_energy)