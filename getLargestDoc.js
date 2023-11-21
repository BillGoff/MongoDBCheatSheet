

var objectSize = 0;

idSize = db.pm.pipeline_rt.aggregate(
	[{
		$addFields: {
			bsonsize: { $bsonSize: "$$ROOT" }
		}
	}, { $sort: { bsonsize: -1 } },
	{ $limit: 1 },
	{
		$project: {
			_id: 1,
			bsonsize: 1

		}
	}
	]);

objectSize = idSize.bsonsize;

print("id: " + idSize._id + " Size:" + formatBytes(objectSize));