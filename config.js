module.exports =
{
	appRoot: "app",

	dev:
	{
		host: "localhost",
		port: 8888,
		secure: false,
		dbConnStr: "mongodb://localhost/pilot_dev",
		password_salt: "10ED70C3-423E-40EB-AE9D-BD4DE1156BD8"
	},

	test:
	{
		host: "localhost",
		port: 7777,
		secure: false,
		dbConnStr: "mongodb://localhost/pilot_test",
		password_salt: "DD5574D7-5A62-4E21-9CE8-AA289C701AD6"
	},

	prod:
	{
		host: "cyclog.jit.su",
		port: 80,
		secure: false,
		dbConnStr: "mongodb://nodejitsu:4cf428a492f7f7f1b0f532ddc5628672@linus.mongohq.com:10082/nodejitsudb4989968531",
		password_salt: "DFDD0535-8583-4A14-B25E-187400AE638F"
	},
	
	getServerBaseUrl: function()
	{
		var buf = [];
		buf.push(this.secure ? "https://" : "http://");
		buf.push(this.host);
		if((this.secure && this.port != 443) || (!this.secure && this.port != 80))
		{
			buf.push(":"+this.port);
		}
		return buf.join("");
	}
};
