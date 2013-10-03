var User = require("../models/user");
var main = require("../../web");
var config = require("../../config");
var textUtil = require("../util/text");
var emailUtil = require("../util/email");
var log = require("phnq_log").create(__filename);

module.exports =
{
	findById: function(id, fn)
	{
		User.findOne({"_id":id}, function(err, user)
		{
			fn(err, user);
		});
	},

	findByEmail: function(email, fn)
	{
		User.findOne({"email":email}, function(err, user)
		{
			fn(err, user);
		});
	},
    
    createUser: function(email, fn)
    {
		var generatedPassword = textUtil.randomAlphaNnumeric(12);
		
		var user = new User();
		user.email = email;
		user.setPassword(generatedPassword);
        
        user.save(function(err)
        {
            if(err)
                return fn(err);
                
            var buf = [];
            buf.push(main.getServerBaseUrl());
            buf.push("/users/");
            buf.push(user.id);
            buf.push("/confirm/");
            buf.push(generatedPassword);
            
			var options =
			{
				to: user.email,
				context:
				{
					confirmUserUrl: buf.join("")
				}
			};
            
			emailUtil.sendWidget("pilot.emails.confirm_user", options, function(err, msg)
			{
                if(err)
                    return fn(err);
                
                fn();
			});
        });
    }
};
