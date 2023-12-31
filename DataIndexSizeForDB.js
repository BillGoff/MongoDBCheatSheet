var stats = [];
var totalDiskSize = 0;
var totalIndexSize = 0;

var dbResults = db.adminCommand({ listDatabases: 1 });

dbResults.databases.forEach(function(dbResult) {
	var dbName = dbResult.name;
	var collectionNames = db.getSiblingDB(dbName).getCollectionNames();

	collectionNames.forEach(function(collectionName) {
		//		print (dbName + " : " + collectionName);
		stats.push(db.getSiblingDB(dbName)[collectionName].stats());
	});
});


for (var c in stats) {
	// skip views
	if (!stats[c]["ns"])
		continue;
	totalDiskSize = totalDiskSize + stats[c]["storageSize"];
	totalIndexSize = totalIndexSize + stats[c]["totalIndexSize"];
	print(stats[c]["ns"].padEnd(40) + ": " + ('' + stats[c]["size"]).padEnd(15) +
		" (" + formatBytes(stats[c]["storageSize"]).padStart(8) + ")" +
		" (" + formatBytes(stats[c]["totalIndexSize"]).padStart(8) + ")");

}

print("total Disk Size: " + formatBytes(totalDiskSize) +
	"\ntotal Index Size: " + formatBytes(totalIndexSize));