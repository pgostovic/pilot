var mongoose = require("mongoose");
var phnq_core = require("phnq_core");
var log = require("phnq_log").create(__filename);
var Record = require("./record");

var schema = new mongoose.Schema(phnq_core.extend(
{
    type: { type:String, default:"health", match:/^health$/ },
	weight: { type:Number }, // kilograms
	sleep: { type:Number, min:0, max:1 },
	fatigue: { type:Number, min:0, max:1 },
	stress: { type:Number, min:0, max:1 },
	soreness: { type:Number, min:0, max:1 }
}, Record.schemaBase));

phnq_core.extend(schema.statics,
{
	findByUserId: function(userId, fn)
	{
        // HealthLog.find({"logType":"health", "userId":userId}, fn);
	}
});

phnq_core.extend(schema.methods,
{

});

var HealthRecord = module.exports = mongoose.connection.model("HealthRecord", schema, "records");
