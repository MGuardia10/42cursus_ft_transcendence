function get_users(request, reply) {
	return fastify.db.all('SELECT * FROM users');
}

export default get_users;