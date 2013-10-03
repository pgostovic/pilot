var mongoose = require("mongoose");
var phnq_core = require("phnq_core");
var log = require("phnq_log").create(__filename);
var config = require("../../config");

var types = [ "health", "activity" ];

var schemaBase =
{
	date: { type:Date, required:true, default:Date.now},
	userId: { type:mongoose.Schema.Types.ObjectId, ref:"User", required:true }
};

module.exports =
{
    schemaBase: schemaBase
};
