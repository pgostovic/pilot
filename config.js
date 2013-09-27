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
    host: config("HOST", os.hostname()),
    port: configNum("PORT", process.env.PORT),
    secure: configBool("SECURE", false),
    dbConnStr: config("DB_CONN_STR", "mongodb://localhost/pilot_dev"),
    passwordSalt: config("PASSWORD_SALT", "abc123")
};
