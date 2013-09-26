var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;

module.exports =
{
    authenticate: function(req, res, next)
    {
        authenticate(req, res, next, false);
    },

    authenticateNoRedirect: function(req, res, next)
    {
        authenticate(req, res, next, true);
    }
};

var authenticate = function(req, res, next, suppressRedirect)
{
    if(req.params.id == "me" && req.user)
        req.params.id = req.user._id;

    // If the user is unconfirmed then they only get to see /change_password
    if(req.user && req.user.isUnconfirmed())
    {
        if(req.url != "/change_password")
            return res.redirect("/change_password");
    }

    if (req.isAuthenticated() || suppressRedirect)
        return next();
    else
        res.redirect("/");
};

passport.use(new LocalStrategy
(
    function(username, password, fn)
    {
        User.findByEmail(username, function(err, user)
        {
            if(err)
                return fn(err);
        
            if(user)
            {
                if(user.isPasswordValid(password))
                    fn(null, user);
                else
                    fn(null, false, {message: "Wrong password."});
        
            }
            else
            {
                fn(null, false, {message: "Incorrect username."});
            }
        });
    }
));

passport.serializeUser(function(user, fn)
{
    fn(null, user.id);
});

passport.deserializeUser(function(id, fn)
{
    User.findById(id, function(err, user)
    {
        fn(err, user);
    });
});
