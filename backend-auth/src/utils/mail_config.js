import nodemailer from 'nodemailer';

/* Set the Gmail configuration */
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GOOGLE_GMAIL_USER,
		pass: process.env.GOOGLE_GMAIL_PASSWORD
	}
});

function build_mail(name, code) {
	return `<!DOCTYPE html>
  <html>
  <head>
	<meta charset="utf-8" />
	<style>
	  body {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		background-color: #f4f4f4;
	  }
	  .container {
		max-width: 600px;
		margin: 0 auto;
		background: #ffffff;
		padding: 20px;
	  }
	  .code-box {
		display: inline-block;
		padding: 10px 20px;
		font-size: 24px;
		letter-spacing: 4px;
		color: #ffffff;
		background-color: #007bff;
		border-radius: 4px;
		text-decoration: none;
		margin: 20px 0;
	  }
	  p {
		font-size: 16px;
		line-height: 1.5;
		color: #333333;
	  }
	</style>
  </head>
  <body>
	<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f4f4">
	  <tr>
		<td align="center">
		  <table class="container" width="600" cellpadding="0" cellspacing="0">
			<tr>
			  <td align="center" style="padding: 20px 0;">
				<h1 style="margin: 0; color: #333333; font-size: 24px;">
				  Tu código de verificación
				</h1>
			  </td>
			</tr>
			<tr>
			  <td>
				<p>Hola ${name},</p>
				<p>Tu código de autenticación en dos pasos es:</p>
				<p align="center">
				  <span class="code-box">${code}</span>
				</p>
				<p>
				  Ingresa este código para completar tu inicio de sesión. 
				  Si tú no solicitaste este código, puedes ignorar este mensaje.
				</p>
				<p>Gracias,<br>El equipo de Soporte</p>
			  </td>
			</tr>
		  </table>
		</td>
	  </tr>
	</table>
  </body>
  </html>`;
}

export default async function send_mail(mail, name, code)
{
	/* Set the mail config */
	const options = {
		from: '"Transcendence TFA" <no-reply@transcendence.com>',
		to: mail,
		subject: "Login on Transcendence - TFA Code",
		html: build_mail(name, code)
	};

	/* Send the mail */
	await transporter.sendMail(options);
}
