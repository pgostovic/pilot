var mongoose = require("mongoose");
var phnq_core = require("phnq_core");
var log = require("phnq_log").create(__filename);
var crypto = require("crypto");
var config = require("../../config");

var statuses = [ "unconfirmed", "active" ];

var schema = new mongoose.Schema(
{
    status: { type:String, default:"unconfirmed", enum:statuses },
	email: { type:String, required:true, unique:true, match:/^.+@.+$/ },
	password: { type:String, required:true }
});

phnq_core.extend(schema.methods,
{
	toJSON: function()
	{
		var obj = this.toObject();
		obj.id = obj._id;
		delete obj._id;
		delete obj.__v;
		delete obj.password;
		return obj;
	},

	setPassword: function(password)
	{
		var hash = crypto.createHash("md5");
		hash.update(config.passwordSalt, "UTF-8");
		hash.update(password, "UTF-8");
		this.password = hash.digest("hex");
	},
    
    isUnconfirmed: function()
    {
        return this.status == "unconfirmed";
    },
    
	isPasswordValid: function(password)
	{
		var hash = crypto.createHash("md5");
		hash.update(config.passwordSalt, "UTF-8");
		hash.update(password, "UTF-8");
		return hash.digest("hex") == this.password;
	}
});

var User = module.exports = mongoose.model("User", schema);
