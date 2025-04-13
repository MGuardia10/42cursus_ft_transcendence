import jwt from 'jsonwebtoken';

function create_jwt(payload)
{
	return jwt.sign(
		payload,
		process.env.TOKEN_SECRET_KEY,
		{ expiresIn: '1d'}
	);
}

function get_jwt(token)
{
	try
	{
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
		return {
			valid: true,
			payload: decoded
		};
	}
	catch(e)
	{
		return {
			valid: false,
			msg: e.message
		};
	}
}

function modify_jwt(token, key, value)
{
	/* Decode the token */
	const decoded = get_jwt(token);

	/* If the token is invalid, error */
	if (!decoded.valid)
		return decoded;

	/* Create a new one with the provided data */
	let payload = decoded.payload;
	delete payload.iat;
	delete payload.exp;
	payload[key] = value;

	const new_token = create_jwt(payload);
	return {
		valid: true,
		token: new_token
	};
}

export { create_jwt, get_jwt, modify_jwt };
