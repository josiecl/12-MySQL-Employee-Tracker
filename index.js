const inquirer = require('inquirer');
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
  
    port: 3306,

    user: 'root',

    password: 'R00t-Pa$$word',
    database: 'employee_db',
});