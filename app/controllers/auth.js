var passport = require("passport");
var textUtil = require("../util/text");
var User = require("../models/user");
var emailUtil = require("../util/email");
var config = require("../../config");
var usersService = require("../services/users_service");
var auth = require("../auth/authenticator");

exports.init = function(app)
{
	app.post("/login", passport.authenticate('local',
	{
		successRedirect: "/",
		failureRedirect: "/"
	}));

	app.get('/logout', function(req, res)
	{
		req.logout();
		res.redirect('/');
	});
	
	app.get("/signup", function(req, res)
	{
		res.renderWidget("pilot.pages.signup");
	});

	app.post("/signup", function(req, res)
	{
		usersService.createUser(req.body.email, function(err, user, generatedPassword)
		{
			if(err)
				return res.renderWidget("pilot.pages.signup", {error:err, model:req.body});

			res.renderWidget("pilot.pages.signup_success", {});
		});
	});

	app.get("/change_password", auth.authenticate, function(req, res)
	{
		res.renderWidget("pilot.pages.change_password", {});
	});

	app.post("/change_password", auth.authenticate, function(req, res)
	{
		if(req.body.password == req.body.password_repeat)
		{
			var user = req.user;
			user.status = "active";
			user.setPassword(req.body.password);
			user.save(function(err)
			{
				if(err)
				{
					res.renderWidget("pilot.pages.change_password", {error:err});
				}
				else
				{
					res.redirect("/");
				}
			});
		}
		else
		{
			res.renderWidget("pilot.pages.change_password", {error:"passwords don't match"});
		}
	});
};
