// NOTES
// having prompt() called breaks inquirer
// comment cTable out for better tables lol
// TODO: new role get id or something
// TODO: fix update role
// TODO: polish line spacing and console logs for certain options

require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// SQL Connection
const database = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

database.connect((err) => {
	if (err) {
		throw err;
	} else {
		console.log("Connected to database");
		prompt();
	}
});

// Inquirer Prompts
const promptChoices = {
	viewDepartments: "VIEW all departments",
	viewRoles: "VIEW all roles",
	viewEmployees: "VIEW all Employees",
	addDepartment: "ADD a department",
	addRole: "ADD a role",
	addEmployee: "ADD an employee",
	updateEmployee: "UPDATE an employee",
};

function prompt() {
	console.log("\x1b[34m%s\x1b[0m", "Company Database Manager");
	inquirer
		.prompt({
			type: "list",
			name: "MainMenu",
			message: "Choose an Option",
			choices: [
				promptChoices.viewDepartments,
				promptChoices.viewRoles,
				promptChoices.viewEmployees,
				promptChoices.addDepartment,
				promptChoices.addRole,
				promptChoices.addEmployee,
				promptChoices.updateEmployee,
			],
		})
		.then((choice) => {
			console.log(`You chose ${choice.MainMenu}`);
			switch (choice.MainMenu) {
				case promptChoices.viewDepartments:
					viewDepartments();
					break;
				case promptChoices.viewRoles:
					viewRoles();
					break;
				case promptChoices.viewEmployees:
					viewEmployees();
					break;
				case promptChoices.addDepartment:
					addDepartment();
					break;
				case promptChoices.addRole:
					addRole();
					break;
				case promptChoices.addEmployee:
					addEmployee();
					break;
				case promptChoices.updateEmployee:
					updateEmployee();
					break;
			}
		});
}

// VIEW FUNCTIONS ==============================================
function viewDepartments() {
	const query = `SELECT * FROM company_db.departments`;
	database.query(query, (err, res) => {
		if (err) {
			throw err;
		} else {
			console.log("\n");
			console.table(res);
			console.log("\n");
		}
	});
	setTimeout(prompt, 1000);
}

function viewRoles() {
	const query = `SELECT roles.id AS ID, roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department FROM company_db.roles
	JOIN departments ON roles.department_id=departments.id`;
	database.query(query, (err, res) => {
		if (err) {
			throw err;
		} else {
			console.log("\n");
			console.table(res);
			console.log("\n");
		}
	});
	setTimeout(prompt, 1000);
}

function viewEmployees() {
	const query = `
	SELECT employees.id AS "ID", 
	employees.first_name AS "First Name", 
	employees.last_name AS "Last Name", 
	roles.title AS "Title", 
	roles.salary AS "Salary", 
	departments.department_name "Department", 
	CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager"
	FROM company_db.employees 
	JOIN roles ON employees.role_id=roles.id
	JOIN departments ON roles.department_id=departments.id
	LEFT JOIN employees manager ON manager.id = employees.manager_id
	`;
	database.query(query, (err, res) => {
		if (err) {
			throw err;
		} else {
			console.log("\n");
			console.table(res);
			console.log("\n");
		}
	});
	setTimeout(prompt, 1000);
}

// ADD FUNCTIONS ===============================================

// add department
async function addDepartment() {
	const newDepartment = await inquirer
		.prompt({
			type: "input",
			name: "departmentToAdd",
			message: "What is the new department called?",
		})
		.then((response) => {
			return response;
		});
	console.log(newDepartment.departmentToAdd);
	database.query(
		`INSERT INTO company_db.departments (department_name) VALUES ("${newDepartment.departmentToAdd}")`,
		(err, res) => {
			if (err) {
				throw err;
			} else {
				console.log("Department Has Been Added");
			}
		}
	);
	setTimeout(prompt, 1000);
}

// add role
async function addRole() {
	const newRole = await inquirer
		.prompt([
			{
				type: "input",
				name: "title",
				message: "What is the new role's title?",
			},
			{
				type: "input",
				name: "salary",
				message: "What is the new role's salary?",
			},
			{
				type: "input",
				name: "department",
				message: "What is the new role's department(id)?",
			},
		])
		.then((response) => {
			return response;
		});
	console.log(newRole);
	database.query(
		`INSERT INTO company_db.roles (title, salary, department_id) VALUES ("${newRole.title}","${newRole.salary}","${newRole.department}")`,
		(err, res) => {
			if (err) {
				throw err;
			} else {
				console.log("Role Has Been Added");
			}
		}
	);
	setTimeout(prompt, 1000);
}

// add employee
async function addEmployee() {
	function promptName() {
		return [
			{
				name: "first",
				type: "input",
				message: "Please enter the employee's first name: ",
			},
			{
				name: "last",
				type: "input",
				message: "Please enter the employee's last name: ",
			},
		];
	}
	const addEmpName = await inquirer.prompt(promptName());
	database.query(
		`SELECT company_db.roles.id, company_db.roles.title FROM company_db.roles ORDER BY company_db.roles.id;`,
		async (err, res) => {
			if (err) throw err;
			const { role } = await inquirer.prompt([
				{
					name: "role",
					type: "list",
					choices: () => res.map((res) => res.title),
					message: "What is the employee role?",
				},
			]);
			let role_id;
			for (const row of res) {
				if (row.title === role) {
					role_id = row.id;
					continue;
				}
			}
			database.query(
				`SELECT * FROM company_db.employees`,
				async (err, res) => {
					if (err) throw err;
					let choices = res.map(
						(res) => `${res.first_name} ${res.last_name}`
					);
					choices.push("none");
					let { manager } = await inquirer.prompt([
						{
							name: "manager",
							type: "list",
							choices: choices,
							message: "Please select their manager:",
						},
					]);
					let manager_id;
					let manager_name;
					if (manager === "none") {
						manager_id = null;
					} else {
						for (const data of res) {
							data.fullName = `${data.first_name} ${data.last_name}`;
							if (data.fullName === manager) {
								manager_id = data.id;
								manager_name = data.fullName;
								// console.log(manager_id);
								// console.log(manager_name);
								continue;
							}
						}
					}
					console.log("\n");
					console.log("New employee added.");
					console.log("\n");
					database.query(
						`INSERT INTO company_db.employees SET ?`,
						{
							first_name: addEmpName.first,
							last_name: addEmpName.last,
							role_id: role_id,
							manager_id: manager_id,
						},
						(err, res) => {
							if (err) throw err;
							setTimeout(prompt, 1000);
						}
					);
				}
			);
		}
	);
}

// UPDATE FUNCTIONS
function updateEmployee() {
	console.log("This function is under construction");
	setTimeout(prompt, 1000);

	// const employeeID = database.query(
	// 	`SELECT employees.id, employees.first_name, employees.last_name FROM employees`,
	// 	async (err, res) => {
	// 		if (err) {
	// 			throw err;
	// 		} else {
	// 			await inquirer
	// 				.prompt({
	// 					name: "employee",
	// 					type: "list",
	// 					choices: () =>
	// 						res.map(
	// 							(res) =>
	// 								`${res.id}: ${res.first_name} ${res.last_name}`
	// 						),
	// 					message: "Which employee to update?",
	// 				})
	// 				.then((response) => {
	// 					console.log(response.employee.charAt(0));
	// 				});
	// 		}
	// 	}
	// );
}
