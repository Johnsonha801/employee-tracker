const inquirer = require('inquirer');
const connection = require('./db/connection');
const cTable = require('console.table');
const DB = require('./db/employeedb');

// Utilizes Inquirer for multiple prompts
const addPrompts = (obj) => {
    return inquirer.prompt(obj)
        .then(responses => {
            return responses;
        })
        .catch(err => {
            console.log(err);
            return false;
        });
}


// Main Menu
const mainMenu = (db) => {
    console.log(`
    ------------Main Menu------------
    `);

    // Present main menu using inquirer
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'update an employee manager',
                'exit application'
            ]
        }
    ])
    .then(async result => {
        // Determine which menu item was selected
        console.log(`
        ------------${result.menu}------------
        `);
        if(result.menu === 'view all departments') {
            // return list of all departments from db
            const returned = await db.viewAllDepartments();
            console.table(returned[0]);
        } else if (result.menu === 'view all roles') {
            // return list of all roles from db
            const returned = await db.viewAllRoles();
            console.table(returned[0]);
        } else if (result.menu === 'view all employees') {
            // retunr list of all employees from db
            const returned = await db.viewAllEmployees();
            console.table(returned[0]);
        } else if (result.menu === 'add a department') {
            // Questions needed to add department
            const questions = {
                type: 'input',
                name: 'department',
                message: 'What is the new department name?'
            };

            // Prompt user with questions
            const result = await addPrompts(questions);

            if(result) {
                //Add new department to db
                await db.addDepartment(result.department);
                console.log(`${result.department} has been added as a new department!`);
            }
        } else if (result.menu === 'add a role') {
            // return list of departments from db
            const departments = await db.viewAllDepartments();
            let names = departments[0].map(row => {
                return {name: row.name, value: row.id};
            });

            // Questions needed to add a new role
            const questions = [
                    {
                        type: 'input',
                        name: 'title',
                        message: 'What is the role name?'
                    }, 
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'What is the salary?'
                    },
                    {
                        type: 'list',
                        name: 'department_id',
                        message: 'What department does this role belong to?',
                        choices: names
                    }
                ];
            
            // Prompt user with questions
            const result = await addPrompts(questions);

            if(result) {
                // Add new role to db
                await db.addRole(result);
                console.log('New role added!');
            }

        } else if (result.menu === 'add an employee') {
            // return a list of employees from db
            const employees = await db.viewAllEmployees();
            const managers = employees[0].map(row => {
                return {name: row.first_name + " " + row.last_name, value: row.id};
            });
            // return a list of roles from db
            const roles = await db.viewAllRoles();
            const roleNames = roles[0].map(row => {
                return {name: row.title, value: row.id};
            });

            // Questions needed for adding an employee
            const questions = [
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'First name:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Last name:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select a role:',
                    choices: roleNames
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select a manager:',
                    choices: managers
                }
            ];

            // Prompt user with questions
            const result = await addPrompts(questions);
            
            if(result) {
                // Add new employee in db
                await db.addEmployee(result);
                console.log('New employee added!');
            }


        } else if (result.menu === 'update an employee role') {
            // Return list of employees from db
            const employees = await db.viewAllEmployees();
            const employeeList = employees[0].map(row => {return {name: row.first_name + " " + row.last_name, value: row.id};});
            // Return list of roles from db
            const roles = await db.viewAllRoles();
            const roleList = roles[0].map(row => {return {name: row.title, value: row.id}});

            // Questions for updating employee role
            const questions = [
                {
                    type: 'list',
                    name: 'id',
                    message: 'Select an employee:',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select a new role:',
                    choices: roleList
                }
            ];

            // Prompt user with questions
            const result = await addPrompts(questions);

            if (result) {
                // Updated employee role in database
                await db.updateEmployeeRole(result);
                console.log('Employee role updated!');
            }

        } else if (result.menu === 'update an employee manager') {
            // get list of employees
            const employees = await db.viewAllEmployees();
            const employeeList = employees[0].map(row => {return {name: row.first_name + " " + row.last_name, value: row.id};});
            
            // Create Employee Questions
            const employee = [
                {
                    type: 'list',
                    name: 'id',
                    message: 'Select an employee:',
                    choices: employeeList
                },
            ];

            // Prompt user with employee questions
            const result1 = await addPrompts(employee);

            // return list of managers
            let managerList = employees[0].filter(row => result1.id !== parseInt(row.id));

            // Create new array of managers without current employee
            let managers = managerList.map(row => {
                return {name: row.first_name + " " + row.last_name, value: row.id};
            });

            // Create Manager Questions
            const manager = [
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select new manager:',
                    choices: managers,
                }
            ];

            // Prompt user with manager questions
            const result2 = await addPrompts(manager);

            // Check if results are empty
            if(result1 && result2) {
                // update Employee manager in database
                await db.updateEmployeeManager(result1.id, result2.manager_id);
                console.log('Employee manager updated!')
            }

        } else if (result.menu === 'exit application') {
            closeDb(db);
            return false;
        } else {
            console.log('Error! The system could not process your request.')
        }
        return true;
    })
    .then(result => {
        if(result) {
            // go back to main menu
            mainMenu(db);
        } else {
            // exit applicaiton
            return;
        }
        
    })
};


// Open db connection and go to main menu
const initiateApp = () => {
    const db = new DB(connection);
    mainMenu(db);
}

// Close connection to db
const closeDb = (db) => {
    db.endConnection();
};

// Initiate the program
initiateApp();