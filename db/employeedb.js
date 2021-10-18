const mysql = require('mysql2');
//const mysql = require('mysql2/promise');
const dbConfig = require('../db/connection');

class DB {
    // DB Constructor
    constructor(connection) {
        this.connection = connection;
    }

    // view all departments (name and id)
    viewAllDepartments() {
        const sql = `SELECT * FROM department`;
        return this.connection.promise().query(sql);
    }

    // view all roles (job title, role id, department name, and salary)
    viewAllRoles() {
        return this.connection.promise()
                .query(`SELECT title, role.id, department.name AS Department, salary FROM role
                        LEFT JOIN department ON role.department_id = department.id`);
    }

    // view all employees (id, first name, last name, job title, department, salary, and manager)
    viewAllEmployees() {
        return this.connection.promise()
                .query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ",  manager.last_name) AS manager 
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
    }

    // Add department
    addDepartment(departmentName) {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = [departmentName];
        const result = this.connection.promise().query(
            sql,
            params,
            function(err, res) {
              if (err) throw err;
            }
          );
          
        return result;
    }

    // Add role
    addRole(role) {
        const sql = `INSERT INTO role SET ?`;
        const params = role;
        return this.connection.promise().query(sql, params);
    }

    // Add Employee
    addEmployee(employee) {
        const sql = `INSERT INTO employee SET ?`;
        const params = employee;

        return this.connection.promise().query(sql, params);
        
    }

    // Update employee role
    updateEmployeeRole(employee) {
        const {id, role_id} = employee;
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const params = [
            role_id,
            id
        ];

        return this.connection.promise().query(sql, params);
    }

    // Update Employee Manager
    updateEmployeeManager(employee, manager) {
        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        const params = [manager, employee];

        return this.connection.promise().query(sql, params);
    }

    // End connection
    endConnection() {
        this.connection.end();
    }
}

module.exports = DB;