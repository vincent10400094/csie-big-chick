const getAuth = require('./auth');
const {google} = require('googleapis');

const spreadId = '';

async function getSheet() {
	const auth = await getAuth();
	return google.sheets({version: 'v4', auth});
} 

function padding(i) {
	return (i < 10) ? '0' + i : i;
}

module.exports.addRow = async (category, item, amount, cb) => {
	try {
		var sheets = await getSheet();
	}
	catch (err) {
		cb(err);
	}
	let time = new Date();
	let timeStamp = `${time.getMonth()+1}/${time.getDate()} ${padding(time.getHours())}:${padding(time.getMinutes())}:${padding(time.getSeconds())}`
	let values = [[timeStamp, item, amount]];
	sheets.spreadsheets.values.append({
		spreadsheetId: spreadId,
		range: `${category}!A1:C1`,
		valueInputOption: 'RAW',
		resource: { values }
	}, cb);
}

module.exports.getRows = async (category, from, limit, cb) => {
	try {
		var sheets = await getSheet();
	}
	catch (err) {
		cb(err);
	}
	sheets.spreadsheets.values.get({
		spreadsheetId: spreadId,
		range: `${category}!A${2+from}:C${1+from+limit}`
	}, (err, res) => {
		let data = res ? res.data.values : undefined;
		cb(err, data);
	});
}

module.exports.getItems = async (category, cb) => {
	try {
		var sheets = await getSheet();
	}
	catch (err) {
		cb(err);
	}
	try {
		let res = await sheets.spreadsheets.values.get({
			spreadsheetId: spreadId,
			range: `${category}!E2:H`
		});
		return res.data.values;
	} catch (err) {
		console.log(err);
	}
}
