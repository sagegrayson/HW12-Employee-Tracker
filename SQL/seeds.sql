USE company_db;

INSERT INTO departments (department_name)
VALUES  ("Management"),
        ("Sales"),
        ("Logistics"),
        ("Support");

INSERT INTO roles (title, salary, department_id)  
VALUES  ("CEO", 200000, 1),
        ("COO", 150000, 1),
        ('Head of Sales', 125000, 2),
        ("Sales Associate", 100000, 2),
        ("Warehouse Manager", 75000, 3),
        ("Shipping Manager", 75000, 3),
        ("Customer Support", 75000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Sage", "Grayson", 1, null),
        ("Sarah", "Sawyer", 2, 1),
        ("Oliva", "Roudebush", 3, 1),
        ("Erin", "Budd", 4, 3),
        ("Madison", "Brinkman", 5, 2),
        ("Grace", "Coleman", 6, 2),
        ("Yeva", "Paine", 7, 2),
        ("Sharon", "Reitsma", 7, 2),
        ("Madison", "Fraser", 7, 2)

SELECT * FROM company_db.departments;
SELECT * FROM company_db.roles;
SELECT * FROM company_db.employees;