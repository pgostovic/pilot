var passport = require("passport");

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
		// User.createUnconfirmed(req.body.email, function(err, user)
		// {
		// 	res.renderWidget("pilot.pages.signup_confirm");
		// 	
		// 	var confirmEmailUrl = user.getConfirmEmailUrl();
		// 	
		// 	email.sendWidget("pg@phranq.com", user.email, "cyclog.pages.confirm_email", {confirmEmailUrl:confirmEmailUrl}, "en", function(err, respMsg)
		// 	{
		// 		if(err)
		// 			return log.error("Error sending email: ", err);
		// 	});
		// });
	});
};
