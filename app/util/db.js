var mongoose = require("mongoose");
var log = require("phnq_log").create(__filename);

module.exports =
{
    dropAllCollections: function(fn)
    {
        var collNames = [];
        for(collName in mongoose.connection.collections)
        {
            collNames.push(collName);
        }
        
        var dropNextColl = function()
        {
            var collName = collNames.pop();
            if(collName)
            {
        		mongoose.connection.collections[collName].drop(function(err)
        		{
                    // ignore the error if it exists -- some collections may not exist.
                    dropNextColl();
                });
            }
            else
            {
                fn();
            }
        };
        
        dropNextColl();
    }
};
