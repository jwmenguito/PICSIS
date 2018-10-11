'use strict'
var getFormData = require('get-form-data');

var log_in_form = document.querySelector('#log_in');
var data = getFormData(log_in_form);

console.log(JSON.stringify(data));
console.log("Shit");