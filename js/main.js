'use strict';

// Global variables
const baseUrl = 'http://127.0.0.1:5000/';
let mealTarget = ''

// Function to fetch data from API
async function getData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Invalid server input!');
    const data = await response.json();
    return data;
}

// Function to check if input is number
function checkNumber(event) {
    const aCode = event.which ? event.which : event.keyCode;
    return !(aCode > 31 && (aCode < 48 || aCode > 57));
}

// Function to check if input is M/F
function checkGenderInput(event) {
    const aCode = event.which ? event.which : event.keyCode;
    return !((aCode > 70 && aCode < 77) || (aCode > 77 && aCode < 102) || (aCode > 102 && aCode < 109) || aCode > 109 || aCode < 70);
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
            let userData = await getData(`${baseUrl}newuser?email=${email}&psw=${psw}&fname=${fname}&lname=${lname}&age=${age}&sex=${sex}&weight=${weight}&height=${height}&activity_lvl=${activityLevel}`);
            if (!userData.active) {
                document.querySelector('#signup-error-message').innerHTML = 'Email already registered.';
                document.querySelector('#signup-email').value = null
            } else {
                document.querySelector('#signup-modal').classList.add('hide');
                document.querySelector('#login-modal').classList.remove('hide');
                document.querySelector('#error-message').innerHTML = 'Sign up completed. Please login in.'
            }
        } else {
            document.querySelector('#signup-error-message').innerHTML = 'Passwords do not match.';
        }
}

// Function to get all food items
async function getAllFoodItems() {
    const allFoodItems = await getData(`${baseUrl}login/plan`);
    for (let item of allFoodItems.foods) {
        const dropDownMenu = document.querySelector('#food-dropdown');
        const newInput = document.createElement('input');
        const newDiv = document.createElement('div');
        const newButton = document.createElement('button');
        let newLink = document.createElement('a');
        newLink.href = item[1];
        newLink.innerHTML = item[0];
        newInput.type='number';
        newInput.placeholder='Enter the amount';
        newDiv.classList.add('flex');
        newButton.value = item[1];
        newButton.innerHTML = 'Add';
        newDiv.appendChild(newLink);
        newDiv.appendChild(newInput);
        newDiv.appendChild(newButton);
        dropDownMenu.appendChild(newDiv)
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
        }
        else {
        item.style.display = 'none'
        }
    }
}

async function addEventsToButtons(target) {
    const foodItems = document.querySelector('#food-dropdown');
    const buttons = foodItems.getElementsByTagName('button');
    for (let button of buttons) {
        button.addEventListener('click', async function (evt) {
            evt.preventDefault();
            const foodId = button.value;
            const foodAmount = button.previousElementSibling.value;
            if (foodAmount === '' || foodAmount === '0') {
                button.previousElementSibling.value = '';
                button.previousElementSibling.placeholder='Please, enter the amount';
                return
            }
            button.style.display = 'none';
            button.previousElementSibling.style.display = 'none';
            const nutritionData = await getData(`${baseUrl}fooditem?food_id=${button.value}&amount=${button.previousElementSibling.value}`);
            console.log(nutritionData);
            const targetTable = document.querySelector(`#${mealTarget}`);
            const newTr = document.createElement('tr');
            let newTd = document.createElement('td');
            newTd.innerHTML=nutritionData['name'];
            newTr.appendChild(newTd);
            newTd = document.createElement('td');
            newTd.innerHTML=nutritionData['carbs'];
            newTr.appendChild(newTd);
            newTd = document.createElement('td');
            newTd.innerHTML=nutritionData['fat'];
            newTr.appendChild(newTd);
            newTd = document.createElement('td');
            newTd.innerHTML=nutritionData['protein'];
            newTr.appendChild(newTd);
            newTd = document.createElement('td');
            newTd.innerHTML=nutritionData['energy'];
            newTr.appendChild(newTd);
            newTd = document.createElement('td');
            newTd.innerHTML=button.value;
            newTd.classList.add('hide');
            newTr.appendChild(newTd);
            newTd = document.createElement('td');
            newTd.innerHTML=`${button.previousElementSibling.value}g`;
            newTr.appendChild(newTd);
            newTd = document.createElement('td');
            const newButton = document.createElement('button');
            newButton.innerHTML = 'Delete'
            newButton.addEventListener('click', function (evt) {
                evt.preventDefault();
                newTr.remove()
            })
            newTd.appendChild(newButton)
            newTr.appendChild(newTd)
            targetTable.appendChild(newTr)
        })
    }
}

async function addEventsTolinks() {
    const foodItems = document.querySelector('#food-dropdown');
    const links = foodItems.getElementsByTagName('a');
    const inputs = foodItems.getElementsByTagName('input');
    const buttons = foodItems.getElementsByTagName('button');
    for (let link of links) {
        link.addEventListener('click', function (evt) {
            evt.preventDefault();
            for (let input of inputs) {input.style.display='none'}
            for (let button of buttons) {button.style.display='none'}
            link.nextElementSibling.style.display = 'inline';
            link.nextElementSibling.nextElementSibling.style.display = 'inline'
        })
    }
}

// Main program
document.querySelector('#login-form').addEventListener('submit', async function (evt) {
    evt.preventDefault();
    await getAllFoodItems();
    await addEventsTolinks();
    await addEventsToButtons();
    let userName = document.querySelector('#uname').value;
    let password = document.querySelector('#psw').value;
    let userData = await getData(`${baseUrl}login?username=${userName}&password=${password}`);
    if (!userData.active) {
        document.querySelector('#error-message').innerHTML = 'Email not found or wrong password.'
    } else {
        console.log(userData);
        document.querySelector('#login-modal').classList.add('hide');
        document.querySelector('#buttons').classList.remove('hide');
        document.querySelector('#username').innerHTML = `${userData.name}`;
        document.querySelector('#calorie-intake').innerHTML = `${userData.total_calories}`;
    }
});

// Event listeners

document.querySelector('#signup-form').addEventListener('submit', signUp);

document.querySelector('#breakfast-edit-btn').addEventListener('click', function () {
    mealTarget = 'breakfast'
    document.querySelector('#dropdown').classList.toggle('hide');
});

document.querySelector('#my-plan-button').addEventListener('click', function () {
    document.querySelector('#meals').classList.toggle('hide');
    document.querySelector('#plan').classList.toggle('hide');
});

/*document.querySelector('#new-meal-btn').addEventListener('click', function () {
    const mealDiv = document.querySelector('#meals');
    const newDiv = document.createElement('div');
    const newTable = document.createElement('table');
    const newH2 = document.createElement('h2');
    const newTr = document.createElement('tr');
    let newTd = document.createElement('td');
    newTr.appendChild(newTd);
    newH2.innerHTML = document.querySelector('#new-meal').value;
    newTable.id = document.querySelector('#new-meal').value;
    newTd.innerHTML = 'Name';
    newTr.appendChild(newTd);
    newTd = document.createElement('td');
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
    newTd.innerHTML = 'id';
    newTd.classList.add('hide');
    newTd = document.createElement('td');
    newTd.innerHTML = 'amount';
    newTd.classList.add('hide');
    newTr.appendChild(newTd);
    newTable.appendChild(newTr)
    newDiv.appendChild(newH2);
    newDiv.appendChild(newTable);
    mealDiv.appendChild(newDiv);
    mealDiv.classList.remove('hide');
    document.querySelector('#new-meal-selection').classList.add('hide')
});*/

document.querySelector('#search-food-item').addEventListener('keyup', filterSearch);

document.querySelector('#signup-cancel-btn').addEventListener(`click`, function () {
    document.querySelector('#signup-modal').classList.add('hide');
    document.querySelector('#login-modal').classList.remove('hide')
});

document.querySelector('#login-signup-btn').addEventListener(`click`, function () {
    document.querySelector('#login-modal').classList.add('hide');
    document.querySelector('#signup-modal').classList.remove('hide')
});

document.querySelector('#signup-email').addEventListener('click', function () {
    document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-age').addEventListener('keypress', function (evt) {
    if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-age').value = null;
    }
});
document.querySelector('#signup-age').addEventListener('click', function () {
    document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-sex').addEventListener('keypress', function (evt) {
    if (!checkGenderInput(evt) || document.querySelector('#signup-sex').value.length > 0) {
        evt.preventDefault();
        document.querySelector('#signup-error-message').innerHTML = 'Input M for male and F for female.';
        document.querySelector('#signup-sex').value = null;
    }
});
document.querySelector('#signup-sex').addEventListener('click', function () {
    document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-weight').addEventListener('keypress', function (evt) {
    if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-weight').value = null;
    }
});
document.querySelector('#signup-weight').addEventListener('click', function () {
    document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-height').addEventListener('keypress', function (evt) {
    if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-height').value = null;
    }
});
document.querySelector('#signup-height').addEventListener('click', function () {
    document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-activity-lvl').addEventListener('keypress', function (evt) {
    if (!checkNumber(evt)) {
        evt.preventDefault();
        document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
        document.querySelector('#signup-activity-lvl').value = null;
    }
});
document.querySelector('#signup-activity-lvl').addEventListener('click', function () {
    document.querySelector('#signup-error-message').innerHTML = '';
});






