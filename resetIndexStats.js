

var collectionNames = ["pm.pipeline_rt"];

collectionNames.forEach(function(n) {

	print("Hiding all indexes for " + n + " collection");
	var collection = db.getCollection(n);

	indexes = db[n].stats().indexSizes

	for (i in indexes) {
		print("Hiding " + i + " index.");
		collection.hideIndex(i);

		print("Unhiding " + i + " index.");
		collection.unhideIndex(i);
	}
});
