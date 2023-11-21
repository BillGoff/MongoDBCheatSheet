
db.rs_sharding_info.updateMany(
	{ "current_replicaset": "rs_2" },
	{ $set: { "current_replicaset": "shardrs05" } })

db.rs_sharding_info.find(
	{ "current_replicaset": "rs_2" }).limit(229).
	forEach(function(doc) {
		db.rs_sharding_info.update(
			{ _id: doc._id },
			{ "current_replicaset": "shardrs04" }
		)
	})
