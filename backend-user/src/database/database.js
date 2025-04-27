import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import fs from 'fs/promises';

/* Load the database file */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../database.sqlite');
const db = new Database( dbPath, {
	fileMustExist: false,
	readonly: false,
	timeout: 5000
} );

/* Execute the init database scripts */
const initializeDB = async () => {
	try {
		/* Activate the ON CASCADE atributes */
		db.pragma('foreign_keys = ON');

		/* Read and execute the schema file */
		const schemaPath = join(__dirname, 'schema.sql');
		const schemaFile = await fs.readFile(schemaPath, 'utf8');
		db.exec(schemaFile);
	}
	catch (error) {
		console.error("Error on the database init: ", error);
	}
};

/* Export the database object */
export default db;
export { initializeDB };