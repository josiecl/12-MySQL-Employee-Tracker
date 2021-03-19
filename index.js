const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({

    host: 'localhost',
  
    port: 3306,

    user: 'root',

    password: process.env.PASSWORD,
    database: 'employee_db',
});


function mainMenu() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'What do you want to do?',
            choices: ['Add department', 'Add role', 'Add employee', 'View department', 'View role', 'View employee', 'Update employee role', 'Quit'],
        },
    ).then(res => {
        switch (res.choice) {
            case 'Add department':
            addDepartment();
            break;

            case 'Add role':
            addRole();
            break;

            case 'Add employee':
              addEmployee();
              break;

              case 'View department':
              viewDepartment();
              break;

              case 'View role':
              viewRole();
              break;

              case 'View employee':
              viewEmployee();
              break;

              case 'Update employee role':
              updateEmp();
              break;

            case 'Quit':
            connection.end();
            break;
        }
    })
}

function addDepartment() {
    inquirer.prompt(
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
        },
    ).then(res => {
        connection.query("INSERT INTO department SET ?", {name: res.departmentName}, (err, res) => {
            if (err) throw err;
            console.log("new department added");
            mainMenu();
        })
    })
}

function viewDepartment() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};


// keep at bottom
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    mainMenu();
  });