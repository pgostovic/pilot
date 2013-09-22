var passport = require("passport");

exports.init = function(app)
{
	app.get("/", app.auth.ensureAuthenticatedNoRedirect, function(req, res)
	{
		if(req.isAuthenticated())
			res.renderWidget("pilot.pages.index", {user:req.user});
		else
			res.renderWidget("pilot.pages.login");
	});
};
