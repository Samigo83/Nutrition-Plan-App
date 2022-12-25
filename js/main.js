'use strict';

// Global variables
const baseUrl = 'http://127.0.0.1:5000/'

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

// Main program
document.querySelector('#login-form').addEventListener('submit', async function (evt) {
    evt.preventDefault();
    const userName = document.querySelector('#uname').value;
    const password = document.querySelector('#psw').value;
    let userData = await getData(`${baseUrl}login?username=${userName}&password=${password}`);
    if (!userData.active) {
        document.querySelector('#error-message').innerHTML = 'Email not found or wrong password.'
    } else {
        console.log(userData);
        document.querySelector('#login-modal').classList.add('hide')
    }
});

document.querySelector('#signup-form').addEventListener('submit', async function (evt) {
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
    if (psw===psw2) {
        let userData = await getData(`${baseUrl}newuser?email=${email}&psw=${psw}&fname=${fname}&lname=${lname}&age=${age}&sex=${sex}&weight=${weight}&height=${height}&activity_lvl=${activityLevel}`);
        if (!userData.active) {
            document.querySelector('#signup-error-message').innerHTML = 'Email already registered.';
            document.querySelector('#signup-email').value = null
        } else {
            document.querySelector('#signup-modal').classList.add('hide');
            let userData = await getData(`${baseUrl}login?username=${email}&password=${psw}`);
            console.log(userData)
        }
    } else {
        document.querySelector('#signup-error-message').innerHTML = 'Passwords do not match.';
    }
});


// Event listeners
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






