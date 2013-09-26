var nodemailer = require("nodemailer");
var phnq_widgets = require("phnq_widgets");
var assert = require("assert");
var config = require("../../config");

var smtpTransport = nodemailer.createTransport("SMTP", config.smtp);

module.exports =
{
    defaultFromAddress: null,
    
    isValidAddress: function(emailAddress)
    {
        return /^.+@.+$/.test(emailAddress);
    },
    
	sendWidget: function(widgetType, options, fn)
	{
        options = options || {};
        options.from = options.from || this.defaultFromAddress;
        options.context = options.context || {};
        options.locale = options.locale || "en";
        
        assert.ok(this.isValidAddress(options.from), "from address is not valid: "+options.from);
        assert.ok(this.isValidAddress(options.to), "from address is not valid: "+options.to);
        
		phnq_widgets.renderWidgetAsEmail(widgetType, options.context, options.locale||"en", function(subject, body)
		{
			var mail =
			{
				from: options.from,
				to: options.to,
				subject: subject,
				html: body
			};

			smtpTransport.sendMail(mail, function(err, resp)
			{
				if(err)
					return fn(err);
					
				fn(null, resp.message);
			});
		});
	}
};