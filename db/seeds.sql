INSERT INTO department (name) 
VALUES
    ('Sales'), 
    ('Engineering'),
    ('Legal'),
    ('Finance');

INSERT INTO role (title, salary, department_id) 
VALUES 
    ('Sales Lead', 50000, 1),
    ('Salesperson', 60000, 1),
    ('Lead Engineer', 110000, 2),
    ('Software Engineer', 100000, 2),
    ('Account Manager', 75000, 4),
    ('Accountant', 65000, 4),
    ('Lawyer', 150000, 3),
    ('Legal Team Lead', 90000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Johnson', 'Ha', 3, null), 
    ('Jane', 'Doe', 2, 1),
    ('John', 'Smith', 1, null),
    ('Alex', 'Rogers', 1, 3),
    ('Chris', 'Scott', 2, 1),
    ('Denise', 'Daniels', 7, null),
    ('Sarah', 'Smith', 7, null);