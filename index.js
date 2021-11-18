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
			console.log(choice.MainMenu);
			switch (choice.MainMenu) {
				case promptChoices.viewDepartments:
					viewDepartments();
					break;
				case promptChoices.viewRoles:
					console.log("2");
					break;
				case promptChoices.viewEmployees:
					console.log("3");
					break;
				case promptChoices.addDepartment:
					console.log("4");
					break;
				case promptChoices.addRole:
					console.log("5");
					break;
				case promptChoices.addEmployee:
					console.log("6");
					break;
				case promptChoices.updateEmployee:
					console.log("7");
					break;
			}
		});
}

// VIEW FUNCTIONS
function viewDepartments() {
	console.log("1");
	prompt();
}
