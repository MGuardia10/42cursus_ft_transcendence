import db from '../database/database.js'

function create_configuration( configuration )
{
	const { default_conf, ptw, sd, fc, bc, sc } = configuration;

	try
	{
		const result = db
			.prepare("INSERT INTO configuration(default_value, points_to_win, serve_delay, field_color, ball_color, stick_color) VALUES(?, ?, ?, ?, ?, ?)")
			.run(default_conf == true ? 1 : 0, ptw, sd, fc, bc, sc);
	
		return result.lastInsertRowid;
	}
	catch (err)
	{
		return undefined;
	}
}

function get_configuration( id )
{
	try
	{
		const result = db
			.prepare("SELECT * FROM configuration WHERE id = ?")
			.get(id);
		return result;
	}
	catch(err)
	{
		return undefined;
	}
}

function modify_configuration( id, configuration )
{
	function set_config( field, value )
	{
		db
			.prepare(`UPDATE configuration SET ${field} = ? WHERE id = ?`)
			.run(value, id);
	}

	const { default_conf, ptw, sd, fc, bc, sc } = configuration;

	try
	{
		if (default_conf !== undefined)
			set_config("default_value", default_conf == true ? 1 : 0);

		if (ptw !== undefined)
			set_config("points_to_win", ptw);

		if (sd !== undefined)
			set_config("serve_delay", sd);

		if (fc)
			set_config("field_color", fc);

		if (bc)
			set_config("ball_color", bc);

		if (sc)
			set_config("stick_color", sc);
		
		return true;
	}
	catch (err)
	{
		return false;
	}
}

function delete_configuration( id )
{
	try
	{
		db
			.prepare("DELETE FROM configuration WHERE id = ?")
			.run(id);
		return true;
	}
	catch (err)
	{
		return false;
	}
}

export { create_configuration, get_configuration, modify_configuration, delete_configuration };
