'use strict';

// Global variables
let userId;
let userMaxCalories;
const baseUrl = 'http://127.0.0.1:5000/';
let mealTarget;
let totalPlanValues = {'carb': 0.0, 'fat': 0.0, 'protein': 0.0, 'energy': 0.0};
let breakfastValues = {'carb': 0.0, 'fat': 0.0, 'protein': 0.0, 'energy': 0.0};
let lunchValues = {'carb': 0.0, 'fat': 0.0, 'protein': 0.0, 'energy': 0.0};
let dinnerValues = {'carb': 0.0, 'fat': 0.0, 'protein': 0.0, 'energy': 0.0};
let snackValues = {'carb': 0.0, 'fat': 0.0, 'protein': 0.0, 'energy': 0.0};
let supperValues = {'carb': 0.0, 'fat': 0.0, 'protein': 0.0, 'energy': 0.0};
let mealTotalTarget;

// Function to fetch data from API
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Invalid server input!');
  const data = await response.json();
  return data;
}

async function postData(url, payload) {
  return fetch((url), {
    method: 'POST',
    body: JSON.stringify(
        payload,
    ),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then(response => response.json());
}

// Function to check if input is number
function checkNumber(event) {
  const aCode = event.which ? event.which : event.keyCode;
  return !(aCode > 31 && (aCode < 48 || aCode > 57));
}

// Function to check if input is M/F
function checkGenderInput(event) {
  const aCode = event.which ? event.which : event.keyCode;
  return !((aCode > 70 && aCode < 77) || (aCode > 77 && aCode < 102) ||
      (aCode > 102 && aCode < 109) || aCode > 109 || aCode < 70);
}

function sumWithPrecision(number, number2, factor) {
  return ((number * factor + number2 * factor) / factor);
}

function subWithPrecision(number, number2, factor) {
  return ((number * factor - number2 * factor) / factor);
}

// Function to signup
async function signUp(evt) {
  evt.preventDefault();
  let email = document.querySelector('#signup-email').value;
  let psw = document.querySelector('#signup-psw').value;
  let psw2 = document.querySelector('#signup-psw2').value;
  let fname = document.querySelector('#signup-fname').value;
  let lname = document.querySelector('#signup-lname').value;
  let age = document.querySelector('#signup-age').value;
  let sex = document.querySelector('#signup-sex').value;
  let weight = document.querySelector('#signup-weight').value;
  let height = document.querySelector('#signup-height').value;
  let activityLevel = document.querySelector('#signup-activity-lvl').value;
  if (psw === psw2) {
    const payload = {
      'fname': fname,
      'lname': lname,
      'email': email,
      'psw': psw,
      'age': age,
      'sex': sex,
      'weight': weight,
      'height': height,
      'activity_lvl': activityLevel,
    };
    let signUpData = await postData(`${baseUrl}newuser`, payload);
    console.log(signUpData);
    if (!signUpData.active) {
      document.querySelector(
          '#signup-error-message').innerHTML = 'Email already registered.';
      document.querySelector('#signup-email').value = null;
    } else {
      document.querySelector('#signup-modal').classList.add('hide');
      document.querySelector('#login-modal').classList.remove('hide');
      document.querySelector('#page-content').classList.remove('blur');
      document.querySelector(
          '#error-message').innerHTML = 'Sign up completed. Please login in.';
    }
  } else {
    document.querySelector(
        '#signup-error-message').innerHTML = 'Passwords do not match.';
  }
}

// Function to update user

async function updateUser(evt) {
  evt.preventDefault();
  let age = document.querySelector('#signup-age').value;
  let sex = document.querySelector('#signup-sex').value;
  let weight = document.querySelector('#signup-weight').value;
  let height = document.querySelector('#signup-height').value;
  let activityLevel = document.querySelector('#signup-activity-lvl').value;
  const payload = {
    'id': userId,
    'age': age,
    'sex': sex,
    'weight': weight,
    'height': height,
    'activity_lvl': activityLevel,
  };
  const updatedCalories = await postData(`${baseUrl}update`, payload);
  userMaxCalories = updatedCalories;
  document.querySelector('#calorie-intake').innerHTML = updatedCalories;
}

// Function to check for nutricial recommendations
function checkForRecs(userMaxEnergy, totalConsumedEnergy) {
  if (totalConsumedEnergy > userMaxEnergy) {
    document.querySelector('#plan-energy').classList.add('color-red');
  } else {
    document.querySelector('#plan-energy').classList.remove('color-red');
  }
}

// Function to return correct target object
function returnTargetObject(name) {
  if (name === 'breakfast') {
    mealTotalTarget = breakfastValues;
  } else if (name === 'lunch') {
    mealTotalTarget = lunchValues;
  } else if (name === 'dinner') {
    mealTotalTarget = dinnerValues;
  } else if (name === 'snack') {
    mealTotalTarget = snackValues;
  } else if (name === 'supper') {
    mealTotalTarget = supperValues;
  } else {
    mealTotalTarget = totalPlanValues;
  }
  return mealTotalTarget;
}

// Function to iterate object and to target
function iterateAndAdd(meal) {
  if (!meal) {
    return;
  }
  const targetName = meal['name'];
  const MealTotalValues = returnTargetObject(meal['name']);
  const targetTable = document.querySelector(`#${meal['name']}-total`);
  const mealTotalCarb = document.querySelector(`#${meal['name']}-carbs`);
  const mealTotalFat = document.querySelector(`#${meal['name']}-fat`);
  const mealTotalProtein = document.querySelector(`#${meal['name']}-protein`);
  const mealTotalEnergy = document.querySelector(`#${meal['name']}-energy`);
  mealTotalCarb.innerHTML = `<b>${meal['carb_amount']}</b>`;
  mealTotalFat.innerHTML = `<b>${meal['fat_amount']}</b>`;
  mealTotalProtein.innerHTML = `<b>${meal['protein_amount']}</b>`;
  mealTotalEnergy.innerHTML = `<b>${meal['energy_amount']}</b>`;
  for (let object of meal.objects) {
    const targetTr = document.createElement('tr');
    targetTr.classList.add('food-item');
    let newTd = document.createElement('td');
    newTd.innerHTML = object['name'];
    targetTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = object['total_carbs'];
    targetTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = object['total_fat'];
    targetTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = object['total_protein'];
    targetTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = object['total_energy'];
    targetTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = object['id'];
    newTd.classList.add('hide');
    newTd.classList.add(`${targetName}-id`);
    targetTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = object['amount'];
    newTd.classList.add(`${targetName}-amount`);
    targetTr.appendChild(newTd);
    newTd = document.createElement('td');
    const newButton = document.createElement('button');
    newButton.innerHTML = 'Delete';
    newButton.id = targetName;
    newTd.appendChild(newButton);
    targetTr.appendChild(newTd);
    DeleteButtons(newButton, targetTr, object['total_carbs'],
        object['total_fat'], object['total_protein'], object['total_energy']);
    targetTable.before(targetTr);
    MealTotalValues['carb'] = sumWithPrecision(MealTotalValues['carb'],
        object['total_carbs'], 10);
    MealTotalValues['fat'] = sumWithPrecision(MealTotalValues['fat'],
        object['total_fat'], 10);
    MealTotalValues['protein'] = sumWithPrecision(MealTotalValues['protein'],
        object['total_protein'], 10);
    MealTotalValues['energy'] = sumWithPrecision(MealTotalValues['energy'],
        object['total_energy'], 10);
    totalPlanValues['carb'] = sumWithPrecision(totalPlanValues['carb'],
        object['total_carbs'], 10);
    totalPlanValues['fat'] = sumWithPrecision(totalPlanValues['fat'],
        object['total_fat'], 10);
    totalPlanValues['protein'] = sumWithPrecision(totalPlanValues['protein'],
        object['total_protein'], 10);
    totalPlanValues['energy'] = sumWithPrecision(totalPlanValues['energy'],
        object['total_energy'], 10);
  }
}

// Function to add data to table
function buildPlanTable(data, userMaxCalories) {
  reset();
  document.querySelector(
      '#plan-name-label').innerHTML = `<b>Plan name: ${data.name}</b>`;
  document.querySelector(
      '#plan-carbs').innerHTML = `<b>${data['total_carb']}</b>`;
  document.querySelector('#plan-fat').innerHTML = `<b>${data['total_fat']}</b>`;
  document.querySelector(
      '#plan-protein').innerHTML = `<b>${data['total_protein']}</b>`;
  document.querySelector(
      '#plan-energy').innerHTML = `<b>${data['total_energy']}</b>`;
  checkForRecs(userMaxCalories, data['total_energy']);

  iterateAndAdd(data.breakfast);
  iterateAndAdd(data.lunch);
  iterateAndAdd(data.dinner);
  iterateAndAdd(data.snack);
  iterateAndAdd(data.supper);
}

// Function for delete buttons
function DeleteButtons(button, trToDelete, carb, fat, protein, energy) {
  button.addEventListener('click', function(evt) {
    evt.preventDefault();
    const MealTotalValues = returnTargetObject(button.id);
    totalPlanValues['carb'] = subWithPrecision(totalPlanValues['carb'], carb,
        10);
    totalPlanValues['fat'] = subWithPrecision(totalPlanValues['fat'], fat, 10);
    totalPlanValues['protein'] = subWithPrecision(totalPlanValues['protein'],
        protein, 10);
    totalPlanValues['energy'] = subWithPrecision(totalPlanValues['energy'],
        energy, 10);
    checkForRecs(userMaxCalories, totalPlanValues['energy']);
    MealTotalValues['carb'] = subWithPrecision(MealTotalValues['carb'], carb,
        10);
    MealTotalValues['fat'] = subWithPrecision(MealTotalValues['fat'], fat, 10);
    MealTotalValues['protein'] = subWithPrecision(MealTotalValues['protein'],
        protein, 10);
    MealTotalValues['energy'] = subWithPrecision(MealTotalValues['energy'],
        energy, 10);
    document.querySelector(
        `#${button.id}-carbs`).innerHTML = `<b>${mealTotalTarget['carb']}</b>`;
    document.querySelector(
        `#${button.id}-fat`).innerHTML = `<b>${mealTotalTarget['fat']}</b>`;
    document.querySelector(
        `#${button.id}-protein`).innerHTML = `<b>${mealTotalTarget['protein']}</b>`;
    document.querySelector(
        `#${button.id}-energy`).innerHTML = `<b>${mealTotalTarget['energy']}</b>`;
    document.querySelector(
        `#plan-carbs`).innerHTML = `<b>${totalPlanValues['carb']}</b>`;
    document.querySelector(
        `#plan-fat`).innerHTML = `<b>${totalPlanValues['fat']}</b>`;
    document.querySelector(
        `#plan-protein`).innerHTML = `<b>${totalPlanValues['protein']}</b>`;
    document.querySelector(
        `#plan-energy`).innerHTML = `<b>${totalPlanValues['energy']}</b>`;
    trToDelete.remove();
  });
}

// Function to list all user plans
function userPlans(plans) {
  const contentTarget = document.querySelector('#user-plans-content');
  for (let plan of plans) {
    const newButton = document.createElement('button');
    newButton.innerHTML = plan;
    newButton.addEventListener('click', async function(evt) {
      evt.preventDefault();
      await reset();
      const planData = await getData(
          `${baseUrl}plan/get?user_id=${userId}&plan_name=${plan}`);
      buildPlanTable(planData, userMaxCalories);
      document.querySelector('#plan-name-edit-btn').classList.remove('hide');
      document.querySelector('#plan-name').classList.add('hide');
      document.querySelector('#plan-name').value = '';
      document.querySelector('#plan-name-ok-btn').classList.add('hide');
      document.querySelector('#user-plans-content').classList.add('hide');
      document.querySelector('#plan').classList.remove('hide');
    });
    contentTarget.appendChild(newButton);
  }
}

// Function to get all food items
async function getAllFoodItems() {
  const allFoodItems = await getData(`${baseUrl}login/plan`);
  console.log(allFoodItems);
  for (let item of allFoodItems) {
    const dropDownMenu = document.querySelector('#food-dropdown');
    const newDiv = document.createElement('div');
    const mainDiv = document.createElement('div');
    mainDiv.style.position = 'relative';

    const newTable = document.createElement('table');
    let newTr = document.createElement('tr');
    let newTd = document.createElement('td');
    let newDiv2 = document.createElement('div');
    newTd.innerHTML = 'Carbs';
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = 'Fat';
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = 'Protein';
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = 'Energy';
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTable.appendChild(newTr);
    newTr = document.createElement('tr');
    newTd.innerHTML = item['carbs'];
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = item['fat'];
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = item['protein'];
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
    newTd.innerHTML = item['energy'];
    newTr.appendChild(newTd);
    newDiv2.classList.add('food-values');
    newTable.appendChild(newTr);
    newDiv2.appendChild(newTable);
    newDiv2.classList.add('hide');
    mainDiv.appendChild(newDiv2);


    const newInput = document.createElement('input');
    const newButton = document.createElement('button');
    let newLink = document.createElement('a');
    newLink.href = item['id'];
    newLink.innerHTML = item['name'];
    newInput.type = 'number';
    newInput.placeholder = 'Enter the amount';
    newDiv.classList.add('flex');
    newButton.value = item['id'];
    newButton.innerHTML = 'Add';
    newDiv.appendChild(newLink);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newButton);
    mainDiv.appendChild(newDiv)

    dropDownMenu.appendChild(mainDiv);

    newDiv.addEventListener('mouseover', (evt) => {
      const allTables = document.querySelectorAll('.food-values');
      evt.preventDefault();
      newDiv2.classList.remove('hide');
    });
    newDiv.addEventListener('mouseleave', (evt) => {
      evt.preventDefault();
      newDiv2.classList.add('hide');
    });
  }
}

// Function to filter dropdownmenu search
function filterSearch() {
  const input = document.querySelector('#search-food-item').value.toUpperCase();
  const DropdownMenu = document.querySelector('#food-dropdown');
  const FoodItems = DropdownMenu.getElementsByTagName('a');
  for (let item of FoodItems) {
    let txtValue = item.textContent || item.innerHTML;
    if (txtValue.toUpperCase().indexOf(input) > -1) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  }
}

async function addEventsToButtons() {
  const foodItems = document.querySelector('#food-dropdown');
  const buttons = foodItems.getElementsByTagName('button');
  for (let button of buttons) {
    button.addEventListener('click', async function(evt) {
      evt.preventDefault();
      if (mealTarget === 'breakfast') {
        mealTotalTarget = breakfastValues;
      } else if (mealTarget === 'lunch') {
        mealTotalTarget = lunchValues;
      } else if (mealTarget === 'dinner') {
        mealTotalTarget = dinnerValues;
      } else if (mealTarget === 'snack') {
        mealTotalTarget = snackValues;
      } else {
        mealTotalTarget = supperValues;
      }
      const foodId = button.value;
      const foodAmount = button.previousElementSibling.value;
      if (foodAmount === '' || foodAmount === '0') {
        button.previousElementSibling.value = '';
        button.previousElementSibling.placeholder = 'Please, enter the amount';
        return;
      }
      button.style.display = 'none';
      button.previousElementSibling.style.display = 'none';
      const nutritionData = await getData(
          `${baseUrl}fooditem?food_id=${button.value}&amount=${button.previousElementSibling.value}`);
      const targetTable = document.querySelector(`#${mealTarget}-total`);
      const targetTr = document.createElement('tr');
      targetTr.classList.add('food-item');
      let newTd = document.createElement('td');
      newTd.innerHTML = nutritionData['name'];
      targetTr.appendChild(newTd);
      newTd = document.createElement('td');
      newTd.innerHTML = nutritionData['total_carbs'];
      targetTr.appendChild(newTd);
      newTd = document.createElement('td');
      newTd.innerHTML = nutritionData['total_fat'];
      targetTr.appendChild(newTd);
      newTd = document.createElement('td');
      newTd.innerHTML = nutritionData['total_protein'];
      targetTr.appendChild(newTd);
      newTd = document.createElement('td');
      newTd.innerHTML = nutritionData['total_energy'];
      targetTr.appendChild(newTd);
      newTd = document.createElement('td');
      newTd.innerHTML = foodId;
      newTd.classList.add('hide');
      newTd.classList.add(`${mealTarget}-id`);
      targetTr.appendChild(newTd);
      newTd = document.createElement('td');
      newTd.innerHTML = `${button.previousElementSibling.value}`;
      newTd.classList.add(`${mealTarget}-amount`);
      targetTr.appendChild(newTd);
      newTd = document.createElement('td');
      const newButton = document.createElement('button');
      newButton.innerHTML = 'Delete';
      newButton.id = mealTarget;
      newTd.appendChild(newButton);
      targetTr.appendChild(newTd);
      DeleteButtons(newButton, targetTr, nutritionData['total_carbs'],
          nutritionData['total_fat'], nutritionData['total_protein'],
          nutritionData['total_energy']);
      targetTable.before(targetTr);
      totalPlanValues['carb'] = sumWithPrecision(totalPlanValues['carb'],
          nutritionData['total_carbs'], 10);
      totalPlanValues['fat'] = sumWithPrecision(totalPlanValues['fat'],
          nutritionData['total_fat'], 10);
      totalPlanValues['protein'] = sumWithPrecision(totalPlanValues['protein'],
          nutritionData['total_protein'], 10);
      totalPlanValues['energy'] = sumWithPrecision(totalPlanValues['energy'],
          nutritionData['total_energy'], 10);
      checkForRecs(userMaxCalories, totalPlanValues['energy']);
      mealTotalTarget['carb'] = sumWithPrecision(mealTotalTarget['carb'],
          nutritionData['total_carbs'], 10);
      mealTotalTarget['fat'] = sumWithPrecision(mealTotalTarget['fat'],
          nutritionData['total_fat'], 10);
      mealTotalTarget['protein'] = sumWithPrecision(mealTotalTarget['protein'],
          nutritionData['total_protein'], 10);
      mealTotalTarget['energy'] = sumWithPrecision(mealTotalTarget['energy'],
          nutritionData['total_energy'], 10);
      document.querySelector(
          `#${mealTarget}-carbs`).innerHTML = `<b>${mealTotalTarget['carb']}</b>`;
      document.querySelector(
          `#${mealTarget}-fat`).innerHTML = `<b>${mealTotalTarget['fat']}</b>`;
      document.querySelector(
          `#${mealTarget}-protein`).innerHTML = `<b>${mealTotalTarget['protein']}</b>`;
      document.querySelector(
          `#${mealTarget}-energy`).innerHTML = `<b>${mealTotalTarget['energy']}</b>`;
      document.querySelector(
          `#plan-carbs`).innerHTML = `<b>${totalPlanValues['carb']}</b>`;
      document.querySelector(
          `#plan-fat`).innerHTML = `<b>${totalPlanValues['fat']}</b>`;
      document.querySelector(
          `#plan-protein`).innerHTML = `<b>${totalPlanValues['protein']}</b>`;
      document.querySelector(
          `#plan-energy`).innerHTML = `<b>${totalPlanValues['energy']}</b>`;
    });
  }
}

async function addEventsTolinks() {
  const foodItems = document.querySelector('#food-dropdown');
  const links = foodItems.getElementsByTagName('a');
  const inputs = foodItems.getElementsByTagName('input');
  const buttons = foodItems.getElementsByTagName('button');
  for (let link of links) {
    link.addEventListener('click', function(evt) {
      evt.preventDefault();
      for (let input of inputs) {
        input.style.display = 'none';
      }
      for (let button of buttons) {
        button.style.display = 'none';
      }
      link.nextElementSibling.style.display = 'inline';
      link.nextElementSibling.nextElementSibling.style.display = 'inline';
    });
  }
}

// Function to reset tables
function reset() {
  document.querySelector('#plan-name').value = '';
  const foodItemTrs = document.querySelectorAll('.food-item');
  for (let item of foodItemTrs) {
    item.remove();
  }
  const targets = ['breakfast', 'lunch', 'dinner', 'snack', 'supper', 'plan'];
  for (let target of targets) {
    document.querySelector(`#${target}-carbs`).innerHTML = 0;
    document.querySelector(`#${target}-fat`).innerHTML = 0;
    document.querySelector(`#${target}-protein`).innerHTML = 0;
    document.querySelector(`#${target}-energy`).innerHTML = 0;
    let targetValues = returnTargetObject(target);
    targetValues['carb'] = 0.0;
    targetValues['fat'] = 0.0;
    targetValues['protein'] = 0.0;
    targetValues['energy'] = 0.0;
  }
}

// Function to reset active buttons
function resetActiveButtons() {
  document.querySelector('#breakfast-edit-btn').
      classList.
      remove('button-active');
  document.querySelector('#lunch-edit-btn').classList.remove('button-active');
  document.querySelector('#dinner-edit-btn').classList.remove('button-active');
  document.querySelector('#snack-edit-btn').classList.remove('button-active');
  document.querySelector('#supper-edit-btn').classList.remove('button-active');
}

// Event listeners

document.querySelector('#login-form').
    addEventListener('submit', async function(evt) {
      evt.preventDefault();
      await getAllFoodItems();
      await addEventsTolinks();
      await addEventsToButtons();
      const userName = document.querySelector('#uname').value;
      const password = document.querySelector('#psw').value;
      const payload = {'username': userName, 'psw': password};
      const userData = await postData(`${baseUrl}login`, payload);
      if (!userData.active) {
        document.querySelector(
            '#error-message').innerHTML = `<b>Email not found or wrong password</b>`;
        document.querySelector('#error-message').classList.remove('hide');
      } else {
        console.log(userData);
        userId = userData['id'];
        userMaxCalories = userData['total_calories'];
        await userPlans(userData.plans);
        document.querySelector('#login-modal').classList.add('hide');
        document.querySelector('#page-content').classList.remove('hide');
        document.querySelector('#buttons').classList.remove('hide');
        document.querySelector('#username').innerHTML = `${userData.name}`;
        document.querySelector(
            '#calorie-intake').innerHTML = `${userData.total_calories}`;
      }
    });

document.querySelector('#signup-form').addEventListener('submit', signUp);

document.querySelector('#plan-name').addEventListener('click', (evt) => {
  evt.preventDefault();
  document.querySelector('#save-error-message').classList.add('hide');
});

document.querySelector('#plan-name-ok-btn').
    addEventListener('click', function(evt) {
      evt.preventDefault();
      let planName = document.querySelector('#plan-name').value;
      document.querySelector(
          '#plan-name-label').innerHTML = `<b>Plan name: ${planName}</b>`;
      document.querySelector('#plan-name').classList.add('hide');
      document.querySelector('#plan-name-edit-btn').classList.remove('hide');
      document.querySelector('#plan-name-ok-btn').classList.add('hide');
    });

document.querySelector('#plan-name-edit-btn').
    addEventListener('click', function(evt) {
      evt.preventDefault();
      document.querySelector('#plan-name').classList.remove('hide');
      document.querySelector('#plan-name-edit-btn').classList.add('hide');
      document.querySelector('#plan-name-ok-btn').classList.remove('hide');
      document.querySelector('#save-error-message').classList.add('hide');
    });

document.querySelector('#breakfast-edit-btn').
    addEventListener('click', function(evt) {
      resetActiveButtons();
      evt.target.classList.add('button-active');
      mealTarget = 'breakfast';
      document.querySelector('#dropdown').classList.remove('hide');
    });
document.querySelector('#lunch-edit-btn').
    addEventListener('click', function(evt) {
      resetActiveButtons();
      evt.target.classList.add('button-active');
      mealTarget = 'lunch';
      document.querySelector('#dropdown').classList.remove('hide');
    });
document.querySelector('#dinner-edit-btn').
    addEventListener('click', function(evt) {
      resetActiveButtons();
      evt.target.classList.add('button-active');
      mealTarget = 'dinner';
      document.querySelector('#dropdown').classList.remove('hide');
    });
document.querySelector('#snack-edit-btn').
    addEventListener('click', function(evt) {
      resetActiveButtons();
      evt.target.classList.add('button-active');
      mealTarget = 'snack';
      document.querySelector('#dropdown').classList.remove('hide');
    });
document.querySelector('#supper-edit-btn').
    addEventListener('click', function(evt) {
      resetActiveButtons();
      evt.target.classList.add('button-active');
      mealTarget = 'supper';
      document.querySelector('#dropdown').classList.remove('hide');
    });

document.querySelector('#my-plan-button').addEventListener('click', function() {
  document.querySelector('#signup-modal').classList.add('hide');
  document.querySelector('#user-plans-content').classList.toggle('hide');
});

document.querySelector('#search-food-item').
    addEventListener('keyup', filterSearch);

document.querySelector('#signup-cancel-btn').
    addEventListener(`click`, function() {
      document.querySelector('#signup-modal').classList.add('hide');
      document.querySelector('#login-modal').classList.remove('hide');
    });

document.querySelector('#login-signup-btn').
    addEventListener(`click`, function() {
      document.querySelector('#login-modal').classList.add('hide');
      document.querySelector('#signup-modal').classList.remove('hide');
    });

document.querySelector('#signup-email').addEventListener('click', function() {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-age').
    addEventListener('keypress', function(evt) {
      if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector(
            '#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-age').value = null;
      }
    });
document.querySelector('#signup-age').addEventListener('click', function() {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-sex').
    addEventListener('keypress', function(evt) {
      if (!checkGenderInput(evt) ||
          document.querySelector('#signup-sex').value.length > 0) {
        evt.preventDefault();
        document.querySelector(
            '#signup-error-message').innerHTML = 'Input M for male and F for female.';
        document.querySelector('#signup-sex').value = null;
      }
    });
document.querySelector('#signup-sex').addEventListener('click', function() {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-weight').
    addEventListener('keypress', function(evt) {
      if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector(
            '#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-weight').value = null;
      }
    });
document.querySelector('#signup-weight').addEventListener('click', function() {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-height').
    addEventListener('keypress', function(evt) {
      if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector(
            '#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-height').value = null;
      }
    });
document.querySelector('#signup-height').addEventListener('click', function() {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-activity-lvl').
    addEventListener('keypress', function(evt) {
      if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector(
            '#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-activity-lvl').value = null;
      }
    });
document.querySelector('#signup-activity-lvl').
    addEventListener('click', function() {
      document.querySelector('#signup-error-message').innerHTML = '';
    });

document.querySelector('#user-settings-button').
    addEventListener(`click`, function() {
      document.querySelector('#plan').classList.add('hide');
      document.querySelector('#signup-modal').classList.remove('hide');
      document.querySelector('#user-main-info').classList.add('hide');
      document.querySelector('#signup-signup-btn').classList.add('hide');
      document.querySelector('#update-btn').classList.remove('hide');
      document.querySelector('#signup-cancel-btn').classList.add('hide');
      document.querySelector('#update-cancel-btn').classList.remove('hide');
      document.querySelector('#update-cancel-btn').
          addEventListener('click', evt => {
            evt.preventDefault();
            document.querySelector('#signup-modal').classList.add('hide');
          });
      document.querySelector('#update-btn').
          addEventListener('click', updateUser);
    });

document.querySelector('#new-plan-button').
    addEventListener('click', function(evt) {
      evt.preventDefault();
      reset();
      document.querySelector('#plan-name-label').innerHTML = '<b>Plan name</b>';
      document.querySelector('#user-plans-content').classList.add('hide');
      document.querySelector('#plan').classList.remove('hide');
    });

document.querySelector('#plan-save-btn').
    addEventListener('click', async function(evt) {
      evt.preventDefault();
      let breakfastIdArray = [];
      let breakfastAmountarray = [];
      let lunchIdArray = [];
      let lunchAmountarray = [];
      let dinnerIdArray = [];
      let dinnerAmountarray = [];
      let snackIdArray = [];
      let snackAmountarray = [];
      let supperIdArray = [];
      let supperAmountarray = [];
      const breakfastIds = document.getElementsByClassName('breakfast-id');
      const breakfastAmounts = document.getElementsByClassName(
          'breakfast-amount');
      const lunchIds = document.getElementsByClassName('lunch-id');
      const lunchAmounts = document.getElementsByClassName('lunch-amount');
      const dinnerIds = document.getElementsByClassName('dinner-id');
      const dinnerAmounts = document.getElementsByClassName('dinner-amount');
      const snackIds = document.getElementsByClassName('snack-id');
      const snackAmounts = document.getElementsByClassName('snack-amount');
      const supperIds = document.getElementsByClassName('supper-id');
      const supperAmounts = document.getElementsByClassName('supper-amount');
      if (breakfastIds.length > 0) {
        for (let id of breakfastIds) {
          breakfastIdArray.push(id.innerHTML);
        }
      } else {
        breakfastIdArray = 'None';
      }
      if (breakfastAmounts.length > 0) {
        for (let amount of breakfastAmounts) {
          breakfastAmountarray.push(amount.innerHTML);
        }
      } else {
        breakfastAmountarray = 'None';
      }
      if (lunchIds.length > 0) {
        for (let id of lunchIds) {
          lunchIdArray.push(id.innerHTML);
        }
      } else {
        lunchIdArray = 'None';
      }
      if (lunchAmounts.length > 0) {
        for (let amount of lunchAmounts) {
          lunchAmountarray.push(amount.innerHTML);
        }
      } else {
        lunchAmountarray = 'None';
      }
      if (dinnerIds.length > 0) {
        for (let id of dinnerIds) {
          dinnerIdArray.push(id.innerHTML);
        }
      } else {
        dinnerIdArray = 'None';
      }
      if (dinnerAmounts.length > 0) {
        for (let amount of dinnerAmounts) {
          dinnerAmountarray.push(amount.innerHTML);
        }
      } else {
        dinnerAmountarray = 'None';
      }
      if (snackIds.length > 0) {
        for (let id of snackIds) {
          snackIdArray.push(id.innerHTML);
        }
      } else {
        snackIdArray = 'None';
      }
      if (snackAmounts.length > 0) {
        for (let amount of snackAmounts) {
          snackAmountarray.push(amount.innerHTML);
        }
      } else {
        snackAmountarray = 'None';
      }
      if (supperIds.length > 0) {
        for (let id of supperIds) {
          supperIdArray.push(id.innerHTML);
        }
      } else {
        supperIdArray = 'None';
      }
      if (supperAmounts.length > 0) {
        for (let amount of supperAmounts) {
          supperAmountarray.push(amount.innerHTML);
        }
      } else {
        supperAmountarray = 'None';
      }
      const planLabel = document.querySelector('#plan-name-label');
      const planName = document.querySelector('#plan-name').value;
      if (planLabel.innerHTML === '<b>Plan name</b>') {
        document.querySelector(
            '#save-error-message').innerHTML = 'Plan name is required';
        document.querySelector('#save-error-message').classList.remove('hide');
        document.querySelector('#page-header').
            scrollIntoView({behavior: 'smooth'});
        return;
      }
      const saveStatus = await getData(
          `${baseUrl}save?user_id=${userId}&plan_name=${planName}&breakfast_ids=${breakfastIdArray}&breakfast_amount=${breakfastAmountarray}&lunch_ids=${lunchIdArray}&lunch_amount=${lunchAmountarray}&dinner_ids=${dinnerIdArray}&dinner_amount=${dinnerAmountarray}&snack_ids=${snackIdArray}&snack_amount=${snackAmountarray}&supper_ids=${supperIdArray}&supper_amount=${supperAmountarray}`);
      console.log(saveStatus);
      if (!saveStatus) {
        document.querySelector(
            '#save-error-message').innerHTML = 'Plan name is already taken';
        document.querySelector('#save-error-message').classList.remove('hide');
        document.querySelector('#page-header').
            scrollIntoView({behavior: 'smooth'});
      }
    });






