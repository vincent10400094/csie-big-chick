const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const PORT = process.env.PORT || 3000;

const apiRouter = require('./routes/apiRouter');
const indexRouter = require('./routes/indexRouter');

const app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'jizzinmypants',
	saveUninitialized: true,
	resave: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 3 // 1 Hour
	},
}));

app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

app.get('/login', (req, res, next) => {
	res.render('login');
});

app.post('/login', passport.authenticate('local', { 'failureRedirect': '/login' }), (req, res) => {
	res.redirect('/');
});

app.use('/api', ensureAuthenticated, apiRouter);
app.use('/', ensureAuthenticated, indexRouter);

app.use((req, res, next) => {
	next(createError(404, 'Not found'));
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(`${req.app.get('env') === 'development' ? err : {}}`);
});

app.listen(PORT, () => {
	console.log(`server listening on PORT ${PORT}`);
});
