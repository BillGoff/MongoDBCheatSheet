var stats = [];
var totalDocumentCount = 0;
var totalDiskSize = 0;
var totalIndexSize = 0;

var dbResults = db.adminCommand({ listDatabases: 1 });


dbResults.databases.forEach(function(dbResult) {
	var dbName = dbResult.name;

	if (( dbName == "sldb" )) {	
//	if ((dbName != "admin" ) && (dbName != "config") && 
//		(dbName != "local") && (dbName != "mongosync_reserved_for_internal_use")) {
		var collectionNames = db.getSiblingDB(dbName).getCollectionNames();

		collectionNames.forEach(function(collectionName) {
//			if (! (collectionName.startsWith("mongosync.tmp"))) {
//			if (collectionName == "joblog") {
			if (collectionName.startsWith("api")) {
				stats.push(db.getSiblingDB(dbName)[collectionName].stats());
			}
		});
	}
});

print("database.collection".padEnd(40) + 
	": Size bytes".padEnd(15) + 
	"   ( # of Documents".padStart(15) + " )" +
	" ( Storage ".padStart(8) + " )" +
	" ( Index Size".padStart(8) + " )");

for (var c in stats) {
	// skip views
	if (!stats[c]["ns"])
		continue;
	totalDiskSize = totalDiskSize + stats[c]["storageSize"];
	totalIndexSize = totalIndexSize + stats[c]["totalIndexSize"];
	totalDocumentCount = totalDocumentCount + stats[c]["count"];
	
	print(stats[c]["ns"].padEnd(40) + 
		": " + ('' + numberWithCommas(stats[c]["size"])).padEnd(15) +
		" (" + numberWithCommas(stats[c]["count"]).padStart(15) + " )" +
		" (" + formatBytes(stats[c]["storageSize"]).padStart(8) + " )" +
		" (" + formatBytes(stats[c]["totalIndexSize"]).padStart(8) + " )");

}

print("Total Document Count " + numberWithCommas(totalDocumentCount) +
	"\ntotal Disk Size: " + formatBytes(totalDiskSize) +
	"\ntotal Index Size: " + formatBytes(totalIndexSize));