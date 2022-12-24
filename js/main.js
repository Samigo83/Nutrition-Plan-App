'use strict';

// Global variables
const baseUrl='http://127.0.0.1:5000/'

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


// Main program
document.querySelector('#login-form').addEventListener('submit', async function(evt) {
  evt.preventDefault();
  const userName = document.querySelector('#uname').value;
  const password = document.querySelector('#psw').value;
  const userData = await getData(`${baseUrl}login?username=${userName}&password=${password}`);
  console.log(userData.active);
  if (!userData.active) {
    document.querySelector('#error-message').innerHTML = 'Email not found or wrong password.'
  } else {
    document.querySelector('#login-form').classList.add('hide')
  }
});


// Event listeners
document.querySelector('#login-signup-btn').addEventListener(`click`, function () {
  document.querySelector('#login-form').classList.add('hide');
  document.querySelector('#signup-modal').classList.remove('hide')
});

document.querySelector('#signup-age').addEventListener('keypress', function (evt) {
  if (!checkNumber(evt)) {
    evt.preventDefault();
    document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
    document.querySelector('#signup-age').value=null;
  }
});
document.querySelector('#signup-age').addEventListener('click', function () {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-weight').addEventListener('keypress', function (evt) {
  if (!checkNumber(evt)) {
    evt.preventDefault();
    document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
    document.querySelector('#signup-weight').value=null;
  }
});
document.querySelector('#signup-weight').addEventListener('click', function () {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-height').addEventListener('keypress', function (evt) {
  if (!checkNumber(evt)) {
    evt.preventDefault();
    document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
    document.querySelector('#signup-height').value=null;
  }
});
document.querySelector('#signup-height').addEventListener('click', function () {
  document.querySelector('#signup-error-message').innerHTML = '';
});

document.querySelector('#signup-activity-lvl').addEventListener('keypress', function (evt) {
  if (!checkNumber(evt)) {
    evt.preventDefault();
    document.querySelector('#signup-error-message').innerHTML = 'Only numbers are valid.';
    document.querySelector('#signup-activity-lvl').value=null;
  }
});
document.querySelector('#signup-activity-lvl').addEventListener('click', function () {
  document.querySelector('#signup-error-message').innerHTML = '';
});






