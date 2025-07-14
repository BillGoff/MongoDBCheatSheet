db.currentOp(true).inprog.forEach(function(op) { if (op.msg !== undefined) printjson(op) })



db.currentOp(
{	"command.createIndexes": { $exists: false },
	'op': { $in: ['getmore', 'query', 'count', 'command'] },
	'ns': 'sldb.s3_fs_metadata'
}).inprog.forEach(function(op) {
	if (op.secs_running > 200)
		print("Killing: " + op.opid);
		printjson(op);
		
//		db.killOp(op.opid);
})



db.currentOp(
{	"command.createIndexes": { $exists: false } 
}).inprog.forEach(function(op) {
if (op.secs_running > 200)
		print("Killing: " + op.opid);
		db.killOp(op.opid);
})	
	

var count=0
db.currentOp(
{	"command.createIndexes": { $exists: false },
	'op': { $in: ['getmore', 'query', 'count', 'command'] }
}).inprog.forEach(function(op) {
	if (op.secs_running > 200)
		count=count+1
//		printjson(op);
//		print(op.client);
})


db.system.profile.find({ millis: { $gt: 50 } }).sort({ ts: 1 });


db.getSiblingDB("sldb").s3_fs_metadata.find({ 
	"file_path": "MagellanHealthBeta/EnterpriseIntegrations/Correspondence/MHCORR_STAGE/TEST_BHBSCPRVCM_i5t4axx6-1740-2737-1578-322260000002_eDelivery_R.pdf"
}).sort({ "create_time": -1}).limit(10).pretty()


db.getSiblingDB("sldb").s3_fs_metadata.deleteMany({
	"file_path": "MagellanHealthBeta/EnterpriseIntegrations/Correspondence/MHCORR_STAGE/TEST_BHBSCPRVCM_i5t4axx6-1740-2737-1578-322260000002_eDelivery_R.pdf",
	"create_time": {$lte: ISODate("2025-02-21T22:04:24.467Z")}});