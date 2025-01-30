var collectionNames = db.getCollectionNames();

var collectionNames = ["diagnostic", "fs_data.chunks.chunks", "fs_data.files",
	"sf_data.files.chunks", "fs_metadata", "pm.cc_metrics", "pm.cc_metrics.v1",
	"promotion_history", "rt_archive_status", "s3_fs_metadata", "snap_history"];
var collectionNames = ["plex"];



function formatBytes(fileSizeInBytes) {
	var i = -1;
	var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
	do {
		fileSizeInBytes /= 1024;
		i++;
	} while (fileSizeInBytes > 1024);

	return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}


function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

var stats = [];
var totalDiskSize = 0;
var totalIndexSize = 0;
var docsCount = 0;

db = db.getSiblingDB("admin");
var dbs = db.runCommand({ "listDatabases": 1 }).databases;

dbs.forEach(function (database) 
{
	db = db.getSiblingDB(database.name);
	collectionNames = db.getCollectionNames();
	collectionNames.forEach(function(n) {
		stats.push(db[n].stats());
	});
});

var count = 0;
for (var c in stats) {
	// skip views
	if (!stats[c]["ns"])
		continue;
	totalDiskSize = totalDiskSize + stats[c]["storageSize"];
	totalIndexSize = totalIndexSize + stats[c]["totalIndexSize"];
	docsCount = docsCount + stats[c]["count"];
	
	if(count == 0)
	print( "database.collection".padEnd(40) + ": size".padEnd(16) + 
		"  (Disk space)".padStart(10) + 
		" (Index Size)".padStart(10) + 
		" (document  count) ");
	
	print(stats[c]["ns"].padEnd(40) + 
		": " + ('' + stats[c]["size"]).padEnd(15) +
		" (" + formatBytes(stats[c]["storageSize"]).padStart(10) + ")" +
		" (" + formatBytes(stats[c]["totalIndexSize"]).padStart(10) + ")" +
		" (" + numberWithCommas(stats[c]["count"]).padStart(15) + ")");
	count++;
}

print("total Disk Size: " + formatBytes(totalDiskSize) + " (" + totalDiskSize + ")");
print("total Index Size: " + formatBytes(totalIndexSize) + " (" + totalIndexSize + ")");
print("total Document Count: " + numberWithCommas(docsCount) + ")");