from meal import Meal


class Plan:
    def __init__(self, nro_of_meals, br_kwargs, lunch_kwargs, dinner_kwargs, supper_kwargs):
        self.nro_of_meals = nro_of_meals
        if nro_of_meals == 4:
            self.breakfast = Meal(**br_kwargs)
            self.lunch = Meal(**lunch_kwargs)
            self.dinner = Meal(**dinner_kwargs)
            self.supper = Meal(**supper_kwargs)

            self.total_energy = self.breakfast.energy_amount + self.lunch.energy_amount + self.dinner.energy_amount + self.supper.energy_amount

br = {'carb_id':153, 'carb_amount':1, 'fat_id':11086, 'fat_amount':0.3, 'protein_id':649, 'protein_amount':1.5, 'extra':None}
lunch = {'carb_id':158, 'carb_amount':0.8, 'fat_id':536, 'fat_amount':0.1, 'protein_id':7530, 'protein_amount':1.5, 'extra':32155, 'extra_amount':0.2}
dinner = {'carb_id':158, 'carb_amount':0.8, 'fat_id':None, 'fat_amount':0.1, 'protein_id':7530, 'protein_amount':1.5, 'extra':32155, 'extra_amount':0.2}
supper = {'carb_id':153, 'carb_amount':0.5, 'fat_id':11086, 'fat_amount':0.3, 'protein_id':649, 'protein_amount':1.5, 'extra':None}

my_plan = Plan(4, br, lunch, dinner, supper)
print(my_plan.total_energy)