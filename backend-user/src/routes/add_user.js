import path from 'path';
import db from '../database/database.js';
import { randomBytes } from 'crypto';
import 'dotenv/config';
import fs from 'fs';

async function generateName( base )
{
	let counter = 0;
	let currentName = base;

	while (db.prepare("SELECT id FROM users WHERE alias = ?").get(currentName))
	{
		currentName = `${base}${counter}`;
		counter++;
	}
	return currentName;
}

export default async function add_user(request, reply) {

	/* Get the json values */
	const { name, email, avatar_url } = request.body;

	let alias;
	try
	{
		alias = await generateName( name.split(" ")[0].toLowerCase() );
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}

	/* Check if the mail is being used by another count */
	try
	{
		const email_search = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
		if (email_search)
			return reply.code(409).send({ error: "The email is already used by another user" });
	}
	catch( err )
	{
		return reply.code(500).send({ error: err });
	}

	/* Get the image, generate a name and save it on a file */
	const image_name = randomBytes(16).toString('hex');
	const image_path = path.join(process.env.AVATAR_FOLDER, `${image_name}.png`);

	try
	{
		const response = await fetch(avatar_url);
		if (!response.ok)
			throw new Error(response.statusText);

		const buffer = await response.arrayBuffer();
		await fs.promises.writeFile(image_path, Buffer.from(buffer));
	}
	catch(err)
	{
		return reply.code(404).send({ error: `Failed to get the user avatar from the url: ${err.message}` });
	}

	/* Insert the data */
	let user_id;
	try
	{
		const queryStatus = db.prepare("INSERT INTO users (name, alias, email, avatar, language) VALUES (?, ?, ?, ?, ?)").run(name, alias, email, image_path, process.env.DEFAULT_LANGUAGE);
		user_id = queryStatus.lastInsertRowid;
	}
	catch(err)
	{
		return reply.code(500).send({ error: err });
	}
	return reply.code(201).send({ id: user_id, name: name, alias: alias, email: email, language: process.env.DEFAULT_LANGUAGE });
}
