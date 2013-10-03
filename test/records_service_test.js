var web = require("../web");
var assert = require("assert");
var mongoose = require("mongoose");
var User = require("../app/models/user");
var recordsService = require("../app/services/records_service");

var user = null;

describe("records_service", function()
{
	beforeEach(function(done)
	{
		mongoose.connection.collections.users.drop(function(err)
		{
    		mongoose.connection.collections.records.drop(function(err)
    		{
                user = new User();
                user.email = "test@test.com";
                user.setPassword("abc123");
                user.save(function(err)
                {
        			done();
                });
    		})
		})
	});
    
	describe("addHealthRecord", function()
	{
		it("should successfully add a health record with valid health info", function(done)
		{
            var healthInfo = { weight: 77.3, sleep: 0.5, fatigue: 0.4, stress: 0.3, soreness: 0.2 };
            
            recordsService.addHealthRecord(user.id, healthInfo, function(err)
            {
                assert.equal(err, null);
                done();
            });
		});

		it("should not add a health record with an invalid value for 'sleep'", function(done)
		{
            var healthInfo = { weight: 77.3, sleep: 1.5, fatigue: 0.4, stress: 0.3, soreness: 0.2 };
            
            recordsService.addHealthRecord(user.id, healthInfo, function(err)
            {
                assert.ok(!!err);
                done();
            });
		});

		it("should not add a health record with an invalid value for 'fatigue'", function(done)
		{
            var healthInfo = { weight: 77.3, sleep: 0.5, fatigue: -0.4, stress: 0.3, soreness: 0.2 };
            
            recordsService.addHealthRecord(user.id, healthInfo, function(err)
            {
                assert.ok(!!err);
                done();
            });
		});

		it("should not add a health record with an invalid value for 'stress'", function(done)
		{
            var healthInfo = { weight: 77.3, sleep: 0.5, fatigue: 0.4, stress: 5.3, soreness: 0.2 };
            
            recordsService.addHealthRecord(user.id, healthInfo, function(err)
            {
                assert.ok(!!err);
                done();
            });
		});

		it("should not add a health record with an invalid value for 'soreness'", function(done)
		{
            var healthInfo = { weight: 77.3, sleep: 0.5, fatigue: 0.4, stress: 0.3, soreness: -8.2 };
            
            recordsService.addHealthRecord(user.id, healthInfo, function(err)
            {
                assert.ok(!!err);
                done();
            });
		});
	});
});

