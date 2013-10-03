var passport = require("passport");
var config = require("../../config");
var usersService = require("../services/users_service");

exports.init = function(app)
{
	app.get("/users/:id/confirm/:password", function(req, res, next)
	{
        usersService.findById(req.params.id, function(err, user)
        {
            if(err)
                return res.send(400);

            if(!user)
                return res.send(404);
                
			req.body.username = user.email;
			req.body.password = req.params.password;
            next();
        });
	}, passport.authenticate('local',
    {
	    successRedirect: "/",
        failureRedirect: "/" // TODO: should be some error page
    }));
};
