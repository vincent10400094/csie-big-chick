const express = require('express');
const createError = require('http-errors');
const {google} = require('googleapis');

const sheetHelper = require('../helper/sheetHelper');

const router = express.Router();

router.get('/:category', (req, res, next) => {
	sheetHelper.getRows(req.params.category, parseInt(req.query.from) || 0, parseInt(req.query.limit) || 10, (err, rows) => {
		if (err)
			next(err);
		else
			res.status(200).send(rows);
	});
});

router.post('/:category', (req, res, next) => {
	if (req.body.item === undefined || req.body.amount === undefined)
		next(createError(400, "Please provide arguments"));
	else {
		sheetHelper.addRow(req.params.category, req.body.item, req.body.amount, (err) => {
			if (err)
				next(err);
			else
				res.status(200).send('OK');
		});
	}
});

module.exports = router;