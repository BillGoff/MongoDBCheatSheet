var collectionStats = []

// Get the sizes
db.getCollectionNames().forEach(function(collectionName) {
	var collection = db.getCollection(collectionName)
	var collectionIndexSize = collection.totalIndexSize();
	//    var indexSizeInMB = collectionIndexSize/(1024*1024)
	collectionStats.push({ "collection": collectionName, "indexSize": formatBytes(collectionIndexSize) })
});

// Sort on collection name or index size
var reverse = true;
var sortField = "indexSizeInMB";
collectionStats.sort(function(a, b) {
	comparison = a[sortField] - b[sortField];
	if (isNaN(comparison)) comparison = a.collection.localeCompare(b.collection);
	if (reverse) comparison *= -1;
	return comparison;
}); undefined;

// Total size of indexes
print("Total size of indexes: " + formatBytes(db.stats()["indexSize"]));

// Print the collection stats
collectionStats.forEach(function(collection) {
	print(JSON.stringify(collection));
});
