
db.getSiblingDB("assets").snodes.count({"type": "Account", "metadata.d_time": {$exists : true} });

db.getSiblingDB("sldb").accounts.find({ "instance_id": "e55fa133-e03d-484a-9993-dafdaf2cc3f1" })



//db.getSiblingDB("sldb").accounts.count({ "metadata.rbin_account" : true })


//db.getSiblingDB("assets").snodes.count({ type": "Account", "metadata.d_time": {$exists : true} } );


var count = 0;
const aids = db.getSiblingDB("assets").snodes.find({"type": "Account", "metadata.d_time": {$exists : true} },{ "a_id": 1, "_id": 0});
aids.forEach(function (instanceId) {
	db.getSiblingDB("sldb").accounts.updateOne({ "instance_id": instanceId.a_id }, { $set: { "metadata.rbin_account" : true }})
	count = count + 1;
})
print("Marked " + count + " accounts with the rbin_account flag.");



var count = 0;
const instanceIds = db.getSiblingDB("sldb").accounts.distinct("instance_id");
instanceIds.forEach(function (instanceId) {
	const foundId = db.getSiblingDB("assets").snodes.count({ "a_id": instanceId });
	if(foundId <= 0) {
		print("marking " + instanceId + " as an orphan account");
		db.getSiblingDB("sldb").accounts.updateOne({ "instance_id": instanceId }, { $set: { "metadata.orphan_account" : true }})
		count = count + 1;
	}
})
print("orphaned " + count + " accounts.");



const instanceIds = db.getSiblingDB('sldb').accounts.aggregate([{ $group: { _id: "$instance_id" } }], { allowDiskUse: true });
var count = 0;
instanceIds.forEach(function (instanceId) {
	const foundId = db.getSiblingDB("assets").snodes.count({ "a_id": instanceId._id });
	if(foundId <= 0) {
		db.getSiblingDB("sldb").accounts.updateOne({ "instance_id": instanceId._id }, { $set: { "metadata.orphan_account" : true }})
		count = count + 1;
	}
})
print("orphaned " + count + " accounts.");