// Get collection names
var collectionNames = db.getCollectionNames()
var col_stats = [];

// Get stats for every collections
collectionNames.forEach(function(n) {
	col_stats.push(db.getCollection(n).stats());
});

// Print
for (var item of col_stats) {
	print(`${item['ns']} | size: ${item['size']} (${(item['size'] / 1073741824).toFixed(2)} GB) | storageSize: ${item['storageSize']} (${(item['storageSize'] / 1073741824).toFixed(2)} GB)`);
}
