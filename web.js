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
    {
        phnq_core.extend(config, config.test);
    }
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
    // phnq_core.extend(config, config.prod);
});

log.info("PILOT CONFIG:\n", config);

// Heroku sets the port with the PORT environment variable, but we still need
// a separate port config for generating urls.
var port = process.env.PORT || config.port;

mongoose.connect(config.dbConnStr, function(err)
{
    if(err)
    {
        log.error("Error connecting to "+config.dbConnStr, err);
        
        /*
            This is not ideal. The way it is now, the app just will never start
            up if the db is down. Need to be able to start up so at least an
            error page can be presented. Also, what happens if the db goes down
            while the app is running? Will it repair itself? Need to investigate...
        */
        
        process.exit(1);
        return;
    }
    
    // start
    app.listen(port, function()
    {
        log.info("Express server listening on port %d in %s mode", port, app.settings.env);
    
        // Widgets
        phnq_widgets.start({express: app, appRoot:path.join(__dirname, config.appRoot)});
    });
});

// repl.start({});
