from food import Food


class Meal:
    def __init__(self, **kwargs):
        self.carb_amount = 0
        self.fat_amount = 0
        self.protein_amount = 0
        self.energy_amount = 0

        if kwargs['carb_id'] is not None:
            self.carb_obj = Food(kwargs['carb_id'])
            self.carb_amount += round(float(self.carb_obj.carbs * kwargs['carb_amount']), 1)
            self.fat_amount += round(float(self.carb_obj.fat * kwargs['carb_amount']), 1)
            self.protein_amount += round(float(self.carb_obj.protein * kwargs['carb_amount']), 1)
            self.energy_amount += round(float(self.carb_obj.energy * kwargs['carb_amount']), 1)
        if kwargs['fat_id'] is not None:
            self.fat_obj = Food(kwargs['fat_id'])
            self.carb_amount += round(float(self.fat_obj.carbs * kwargs['fat_amount']), 1)
            self.fat_amount += round(float(self.fat_obj.fat * kwargs['fat_amount']), 1)
            self.protein_amount += round(float(self.fat_obj.protein * kwargs['fat_amount']), 1)
            self.energy_amount += round(float(self.fat_obj.energy * kwargs['fat_amount']), 1)
        if kwargs['protein_id'] is not None:
            self.protein_obj = Food(kwargs['protein_id'])
            self.carb_amount += round(float(self.protein_obj.carbs * kwargs['protein_amount']), 1)
            self.fat_amount += round(float(self.protein_obj.fat * kwargs['protein_amount']), 1)
            self.protein_amount += round(float(self.protein_obj.protein * kwargs['protein_amount']), 1)
            self.energy_amount += round(float(self.protein_obj.energy * kwargs['protein_amount']), 1)
        if kwargs['extra'] is not None:
            self.extra_obj = Food(kwargs['extra'])
            self.carb_amount += round(float(self.extra_obj.carbs * kwargs['extra_amount']), 1)
            self.fat_amount += round(float(self.extra_obj.fat * kwargs['extra_amount']), 1)
            self.protein_amount += round(float(self.extra_obj.protein * kwargs['extra_amount']), 1)
            self.energy_amount += round(float(self.extra_obj.energy * kwargs['extra_amount']), 1)


#kwargs = {'carb_id':153, 'carb_amount':1, 'fat_id':11086, 'fat_amount':0.3, 'protein_id':649, 'protein_amount':1.5, 'extra':None}
#breku = Meal(**kwargs)
#print(round(float(breku.energy_amount), 1))
