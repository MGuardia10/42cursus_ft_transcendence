export default async function google_callback(request, reply)
{
	try
	{
		/* Get the google validated token */
		const token = await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

		/* Make the query to Google to get the data */
		const googleResponse = await fetch(
			'https://openidconnect.googleapis.com/v1/userinfo',
			{
			  headers: {
				Authorization: `Bearer ${token.access_token}`,
				Accept: 'application/json'
			  }
			}
		  );
		const tokenInfo = await googleResponse.json()
		console.log("Token data: ", tokenInfo)

		if (!googleResponse.ok)
			return reply.send(await googleResponse.text())
		
		/* Get the fields */
		const userData = await googleResponse.json()
		const { name, email, picture } = userData;

		console.log(`Data:\n\t· Name: ${name}\n\t· Email: ${email}\n\t· Picture: ${picture}`)
	}
	catch(err)
	{
		return reply.code(500).send(err);
	}


	return reply.redirect('https://localhost');
}