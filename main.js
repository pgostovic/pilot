// Dependencies
var express = require("express");
var phnq_widgets = require("phnq_widgets");
var phnq_log = require("phnq_log");
var phnq_core = require("phnq_core");
var log = phnq_log.create(__filename);
var mongoose = require("mongoose");
var passport = require("passport");
var auth = require("./app/auth/authenticator")
var path = require("path");
var fs = require("fs");
var config = require('./config');
var repl = require("repl");

var app = express();

module.exports =
{
	getServerBaseUrl: function()
	{
		var buf = [];
		buf.push(config.secure ? "https://" : "http://");
		buf.push(config.host);
		if((config.secure && config.port != 443) || (!config.secure && config.port != 80))
		{
			buf.push(":"+config.port);
		}
		return buf.join("");
	}
};

// hang the authenticator on the app for convenience
app.auth = auth;

// Configuration: general
app.configure(function()
{
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(phnq_widgets.widgetRenderer());
});

// Configuration: development-specific
app.configure('development', function()
{
	phnq_log.setLevel("debug");
	phnq_widgets.config.jQueryCDN = false;
	phnq_widgets.config.minifyJS = false;
	phnq_widgets.config.minifyCSS = false;
	phnq_widgets.config.compressJS = false;
	phnq_widgets.config.compressCSS = false;
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

	var firstArg = process.argv.length > 0 && process.argv[1] ? process.argv[1] : null;

	if(firstArg && firstArg.match("/mocha/"))
		phnq_core.extend(config, config.test);
	else
		phnq_core.extend(config, config.dev);
});

// Configuration: production-specific
app.configure('production', function()
{
	phnq_log.setLevel("info");
	phnq_widgets.config.jQueryCDN = true;
	phnq_widgets.config.minifyJS = true;
	phnq_widgets.config.minifyCSS = true;
	phnq_widgets.config.compressJS = true;
	phnq_widgets.config.compressCSS = true;
	app.use(express.errorHandler());
	phnq_core.extend(config, config.prod);
});

try
{
	mongoose.connect(config.dbConnStr);
}
catch(ex)
{
	log.error("Error connecting to "+config.dbConnStr, ex);
}

// start
app.listen(config.port, function()
{
	log.info("Express server listening on port %d in %s mode", config.port, app.settings.env);
});

// Widgets
phnq_widgets.start({express: app, appRoot:path.join(__dirname, config.appRoot)});

repl.start({});
