var sizeMap = {}

// Iterate through every collection
db.getCollectionNames().forEach(function(cName) {
	indexes = db[cName].stats().indexSizes

	// Now iterate through every index of the current collection
	// We create a map here with key as combination of collection name and index name
	for (i in indexes) sizeMap[cName + " - " + i] = indexes[i];
});

var sizeArray = [];

// Map is converted to an array each element of which is a two member array
// This inner arrary contains the collection+index name key and the size itself
for (key in sizeMap) sizeArray.push([key, sizeMap[key]])

// Now sort outer array using the second column of inner array
var sizeArray = sizeArray.sort(function(a, b) { return b[1] - a[1] })

// Print list of index size in sorted form
for (x in sizeArray) {
	//	print( sizeArray[x][0] + ": " + (sizeArray[x][1]/1024).toFixed(2) +" kb");
	print(sizeArray[x][0] + ": " + formatBytes(sizeArray[x][1]) + " (" + (sizeArray[x][1]) + ")");
}