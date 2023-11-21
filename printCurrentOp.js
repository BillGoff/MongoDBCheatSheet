db.currentOp(true).inprog.forEach(function(op) { if (op.msg !== undefined) printjson(op) })



db.currentOp(
	{
		"command.createIndexes": { $exists: false },
		'op': { $in: ['getmore', 'query', 'count', 'command'] },
		'ns': 'infer.locations'
	}).inprog.forEach(function(op) {
		if (op.secs_running > 200)
			print("yep");
	})



db.system.profile.find({ millis: { $gt: 50 } }).sort({ ts: 1 });
