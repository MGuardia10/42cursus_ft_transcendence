import db from '../database/database.js'

export function get_users(request, reply) {
	try {
		const users = db.prepare('SELECT * FROM users').all();
		reply.send(users);
	}
	catch( error )
	{
		reply.status(500).send("Error while checking the database: ", error);
	}
}

export function add_user(request, reply) {
	try {
		const { name, email } = request.body;
		const data = db.prepare("SELECT * FROM users WHERE name = ? OR email = ?").get(name, email);
		if (data === undefined) {
			db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(name, email)
			reply.send("User added correctly!")
		} else  {
			reply.send("Error: an user with this data has been registered before")
		}

	}
	catch( error )
	{
		reply.status(500).send(error)
	}
}
