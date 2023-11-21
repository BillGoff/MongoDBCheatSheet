var stats = [];
var totalDiskSize = 0;
var totalIndexSize = 0;

var collectionNames = db.getCollectionNames();
var collectionNames = ["diagnostic", "fs_data.chunks.chunks", "fs_data.files",
	"sf_data.files.chunks", "fs_metadata", "pm.cc_metrics", "pm.cc_metrics.v1",
	"promotion_history", "rt_archive_status", "s3_fs_metadata", "snap_history"];


var collectionNames = ["plex"];


collectionNames.forEach(function(n) {
	stats.push(db[n].stats());
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

print("total Disk Size: " + formatBytes(totalDiskSize) + " (" + totalDiskSize + ")");
print("total Index Size: " + formatBytes(totalIndexSize) + " (" + totalIndexSize + ")");