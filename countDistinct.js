
function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

var distinctOrgSnodeIds = db.pm.pipeline_rt.distinct("org_snode_id");
var orgSnodeIdCount = []
var totalCount = 0;

distinctOrgSnodeIds.forEach(function(orgSnodeId) {	
	print("Collection count for " + orgSnodeId);
	var count = db.pm.pipeline_rt.count( { "org_snode_id": orgSnodeId });
	totalCount = totalCount + count;
	orgSnodeIdCount.push({ "org_snode_id": orgSnodeId, "count": count })
}); 

// Sort on org_snode_id or count
var reverse = true;
var sortField = "count";
orgSnodeIdCount.sort(function(a, b) {
	comparison = a[sortField] - b[sortField];
	if (isNaN(comparison)) comparison = a.collection.localeCompare(b.collection);
	if (reverse) comparison *= -1;
	return comparison;
}); undefined;


// Print the collection stats
orgSnodeIdCount.forEach(function(collection) {
//	print(JSON.stringify(collection));
	print(collection.org_snode_id + " : " + numberWithCommas(collection.count));
});

var average = Math.ceil(totalCount / distinctOrgSnodeIds.length);
print("average count: " + numberWithCommas(average));

	