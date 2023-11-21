var indexesArr = {}

db.getCollectionNames().forEach(function(collection) {
	if (collection == "plex") {
		indexes = db[collection].stats().indexSizes
		for (i in indexes) indexesArr[collection + " - " + i] = indexes[i];
	}
});

var sortable = [], x;
for (x in indexesArr) sortable.push([x, indexesArr[x]])
var pArr = sortable.sort(function(a, b) { return b[1] - a[1] })

var indexSize = 0;

for (x in pArr) {
	indexSize = pArr[x][1];
	print(formatBytes(indexSize) + " (" + indexSize + "): " + pArr[x][0]);
}

