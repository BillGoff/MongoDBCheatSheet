var indexesArr = {}

db.getCollectionNames().forEach(function(collection) {
//	if (collection == "jobs") {
		indexes = db[collection].stats().indexSizes
		for (i in indexes) indexesArr[collection + " - " + i] = indexes[i];
//	}
});

var sortable = [], x;
for (x in indexesArr) sortable.push([x, indexesArr[x]])
var pArr = sortable.sort(function(a, b) { return b[1] - a[1] })

var indexSize = 0;
var totalSize = 0;
for (x in pArr) {
	indexSize = pArr[x][1];
	print(formatBytes(indexSize) + " (" + indexSize + "): " + pArr[x][0]);
	totalSize = totalSize + indexSize;
}

print("Total Indexes: " + formatBytes(totalSize) + " (" + totalSize + ")");


// For all databases.

var indexesArr = {}

var dbResults = db.adminCommand({ listDatabases: 1 });

dbResults.databases.forEach(function(dbResult) {
	var dbName = dbResult.name;
	//print(dbName);
	if ((dbName != "admin" ) && (dbName != "config") && (dbName != "local")) {
		print("getting index sizes for " + dbName);
		var collectionNames = db.getSiblingDB(dbName).getCollectionNames();

		collectionNames.forEach(function(collection) {
			print("getting index stats for " + dbName + "." + collection);
			indexes = db.getSiblingDB(dbName)[collection].stats().indexSizes
			for (i in indexes) indexesArr[collection + " - " + i] = indexes[i];
		});
	}
});

var sortable = [], x;
for (x in indexesArr) sortable.push([x, indexesArr[x]])
var pArr = sortable.sort(function(a, b) { return b[1] - a[1] })

var indexSize = 0;
var totalSize = 0;
for (x in pArr) {
	indexSize = pArr[x][1];
	print(formatBytes(indexSize) + " (" + indexSize + "): " + pArr[x][0]);
	totalSize = totalSize + indexSize;
}

print("Total Indexes: " + formatBytes(totalSize) + " (" + totalSize + ")");
