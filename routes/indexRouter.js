const express = require('express');
const createError = require('http-errors');
const { google } = require('googleapis');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const sheetHelper = require('../helper/sheetHelper');

const categories = ['cake', 'chicken', 'cocktail'];
var groceries = {};

const user = {
	id: 0,
	name: 'admin'
}

const router = express.Router();

async function fetchData() {
	for (let i of categories) {
		groceries[i] = await sheetHelper.getItems(i);
	}
}

router.get('/', async (req, res, next) => {
	try {
		await fetchData();
		res.render('index', { groceries: groceries });
	} catch (err) {
		next(createError(500, err));
		console.log(err);
	}
});

router.get('/dashboard', async (req, res, next) => {
	try {
		await fetchData();
		res.render('dashboard', { groceries: groceries });
	} catch (err) {
		next(createError(500, err));
		console.log(err);
	}
});

passport.use(new LocalStrategy((username, password, done) => {
	if (username === '<your username>' && password === '<your password>');
	return done(null, user);
	done(null, false, {});
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	done(null, user);
})

module.exports = router;
