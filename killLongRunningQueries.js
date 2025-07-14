function killLongRunningQuereis (maxSecsRunning) {
	currOp = db.currentOp();
	for (oper in currOp.inprog) {
		op = currOp.inprog[oper-0];
		if (op.secs_running > maxSecsRunning && op.op == "query" && !op.ns.startsWith("local")) {
			print("Killing opId: " + op.opid + " running over for secs: " + op.secs_running);
			db.killOp(op.opid);
		}
	}
};

var count = 0;

db.currentOp({"command.createIndexes": { $exists : false }, 
'op': { $in: ['getmore', 'query', 'count', 'command']}}).inprog.forEach(function(op) {
	if(op.secs_running > 200) {
		print(op.opid);
		printjson(op.host);
		print(op.secs_running);
		printjson(op.clientMetadata.driver);
		printjson(op.effectiveUsers);
		printjson(op.command);
		print("\n");
		count++;
	}
})

print("TotalNumber of ops: " + count);

		
	
db.currentOp({ secs_running: { $gte:  200 }})
