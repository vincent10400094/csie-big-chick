const {google} = require('googleapis');
const readline = require('readline');
const fs = require('fs').promises;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = process.env.PWD + '/token.json';
const CREDS_PATH = process.env.PWD + '/credentials.json'

const getAuth = async () => {

	try {
		var content = await fs.readFile(CREDS_PATH);
		credentials = JSON.parse(content);
	} catch (err) {
		console.log('Reading credentials error:', err);
		return undefined
	}

	const {client_secret, client_id, redirect_uris} = credentials.web;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	try {
		var content = await fs.readFile(TOKEN_PATH);
		token = JSON.parse(content);
		oAuth2Client.setCredentials(token);
	} catch (err) {
		getNewToken(oAuth2Client);
	}

	return oAuth2Client;

}

const getNewToken = async (oAuth2Client) => {

	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('Enter the code from that page here: ', async (code) => {
		rl.close();
		oAuth2Client.getToken(code, async (err, token) => {

			if (err) 
				return console.error('Error while trying to retrieve access token', err);

			oAuth2Client.setCredentials(token);

			try {
				await fs.writeFile(TOKEN_PATH, JSON.stringify(token));
			} catch (err) {
				console.log('Writing token error: ', err);
				return undefined;
			}
		});
	});
}

module.exports = getAuth;
