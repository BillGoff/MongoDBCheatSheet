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



function validateUniqueIndexes() {
    // Retrieve all databases
    const databases = db.adminCommand({ listDatabases: 1 }).databases;

    // Iterate over each database
    databases.forEach((dbInfo) => {
        const dbName = dbInfo.name;
        
        if (dbName != "admin")
		{
        	// Switch to current database
	        const currentDb = db.getSiblingDB(dbName);
	
	        // Get all collections
	        const collections = currentDb.getCollectionInfos({ type: "collection" });
	
	        // Iterate over each collection
	        collections.forEach((collectionInfo) => {
	            const collName = collectionInfo.name;
	            const collection = currentDb.getCollection(collName);
	
	            // Get all indexes for the collection
	            const indexes = collection.getIndexes();
	
	            // Check if there are any unique indexes
	            const uniqueIndexes = indexes.filter(idx => idx.unique);
	
	            if (uniqueIndexes.length > 0) {
	                // Validate the collection
	                const validationResult = collection.validate({ full: false });
	
	                // Log information about the collection and its indexes
	                print(`Database: ${dbName}, Collection: ${collName}, Unique Indexes: ${uniqueIndexes.length}`);
	                uniqueIndexes.forEach(idx => {
	                    print(`  - Index Name: ${idx.name}, Key: ${JSON.stringify(idx.key)}`);
	                });
	
	                // Check and print any validation issues
	                if (!validationResult.ok) {
	                    print(`  Validation issues found in ${dbName}.${collName}:`);
	                    printjson(validationResult);
	                } else {
	                    print(`  No validation issues found in ${dbName}.${collName}.`);
	                }
	            }
	        });
	   }
    });
}