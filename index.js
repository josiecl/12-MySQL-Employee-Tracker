const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();

// create connection through mysql
const connection = mysql.createConnection({

    host: 'localhost',
  
    port: 3306,

    user: process.env.USER,

    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

// function for mainmenu with options
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
            // cases and breaks
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

// add department function
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

// add role function
function addRole() {
    inquirer.prompt(
        [{
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'What is the department id of the role?',
        },
        ]).then(res => {
        connection.query("INSERT INTO role SET ?", {title: res.roleName, salary: res.roleSalary, department_id: res.departmentId}, (err, res) => {
            if (err) throw err;
            console.log("new role added");
            mainMenu();
        })
    })
}

// add employee function
function addEmployee() {
    inquirer.prompt(
        [{
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'What is the role id of the employee?',
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'What is the manager id of the employee?',
        },
        ]).then(res => {
            if (res.managerId === "") {
                res.managerId = null
                // res.managerId = 0
            }

        connection.query("INSERT INTO employee SET ?", {first_name: res.firstName, last_name: res.lastName, role_id: res.roleId, manager_id: res.managerId}, (err, res) => {
            if (err) throw err;
            console.log("new employee added");
            mainMenu();
        })
    })
}

// view department
function viewDepartment() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

// view role
function viewRole() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

// view employee
function viewEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    })
};

// update employee
function updateEmp() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const empChoices = res.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`, 
            value: id
        }))
        inquirer.prompt(
                {
                type: "list",
                name: "updateEmp",
                choices: empChoices
                }
        // response takes info and updates the employee role
        ).then(res => {
            console.log(res.updateEmp)
            const employeeChosen = res.updateEmp;
            connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;
                const roleChoices = res.map(({id, title}) => ({
                    name: title, 
                    value: id
                }))
                inquirer.prompt(
                    [
                        {
                        type: "list",
                        name: "updateRole",
                        choices: roleChoices
                        }
                ]
                ).then(res => {
                    console.log(res.updateRole)
                    const roleChosen = res.updateRole;
                    updateEmpRole(roleChosen, employeeChosen);
                    mainMenu();
                })
            })
        })
    })
}

// update employee role function
function updateEmpRole(idRole, employeeId) {
    connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [idRole, employeeId]);
};




// keep at bottom
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    mainMenu();
  });