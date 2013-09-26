var auth = require("../auth/authenticator");

exports.init = function(app)
{
	app.get("/", auth.authenticateNoRedirect, function(req, res)
	{
		if(req.isAuthenticated())
			res.renderWidget("pilot.pages.index", {user:req.user});
		else
			res.renderWidget("pilot.pages.login");
	});
};
