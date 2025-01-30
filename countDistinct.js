
function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

var distinctValues = db.pm.pipeline_rt.distinct("org_snode_id");
var distinctValuesCount = []
var totalCount = 0;

distinctValues.forEach(function(distinctValue) {	
	print("Collection count for " + distinctValue);
	var count = db.pm.pipeline_rt.count( { "org_snode_id": distinctValue });
	totalCount = totalCount + count;
	distinctValuesCount.push({ "org_snode_id": distinctValue, "count": count })
}); 

// Sort on distinctValue or count
var reverse = true;
var sortField = "count";
distinctValuesCount.sort(function(a, b) {
	comparison = a[sortField] - b[sortField];
	if (isNaN(comparison)) comparison = a.collection.localeCompare(b.collection);
	if (reverse) comparison *= -1;
	return comparison;
}); undefined;

print("Distinct Values : " + numberWithCommas(distinctValues.length));

// Print the collection stats
distinctValuesCount.forEach(function(collection) {
//	print(JSON.stringify(collection));
	print(collection.org_snode_id + " : " + numberWithCommas(collection.count));
});

var average = Math.ceil(totalCount / distinctValues.length);
print("average count: " + numberWithCommas(average));

	