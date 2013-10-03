var HealthRecord = require("../models/health_record");

module.exports =
{
    addHealthRecord: function(userId, healthInfo, fn)
    {
        var healthRecord = new HealthRecord(healthInfo);
        healthRecord.userId = userId;
        
        healthRecord.save(function(err)
        {
            fn(err);
        });
    }
};
