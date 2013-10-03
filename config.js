var os = require("os");

var config = function(name, defaultValue)
{
    return process.env["PILOT_"+name.toUpperCase()] || new String(defaultValue).toString();
};

var configNum = function(name, defaultValue)
{
    return parseFloat(config(name, defaultValue));
};

var configBool = function(name, defaultValue)
{
    return config(name, defaultValue) == "true";
};

module.exports =
{
    appRoot: "app",
    host: config("HOST", os.hostname()),
    port: configNum("PORT", 8888),
    secure: configBool("SECURE", false),
    dbConnStr: config("DB_CONN_STR", "mongodb://localhost/pilot_dev"),
    passwordSalt: config("PASSWORD_SALT", "abc123"),
    systemEmailAddress: config("SYSTEM_EMAIL_ADDRESS", "Pilot Admin <no-reply@phnq-pilot.com>"),
    smtp:
    {
        service: "Mailgun",
        auth:
        {
            user: process.env.MAILGUN_SMTP_LOGIN,
            pass: process.env.MAILGUN_SMTP_PASSWORD
        }
    },
    
    test:
    {
        dbConnStr: "mongodb://localhost/pilot_test"
    }
};
