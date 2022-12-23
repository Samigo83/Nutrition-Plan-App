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


