#!/bin/sh

collections="pm.cc_load pm.cc_metrics.v2 pm.orphaned_pipeline_rt pm.pipeline pm.pipeline_rt pm.pipeline_suggest_rt pm.snaplex_load_average pm.suggest_rt pm.suggest_values_rt pm.temp_rt project_migration_status promotion_history regression_test rs_config rs_sharding_info rt_archive_status rt_history smartlink_context smartlink_history snap_history task_exec_stats telemetry usage_db"


db=cslserver
realDb=slserver

stty -echo
printf "Source Password: "
read sourcePassword
stty echo
printf "\n"

stty -echo
printf "Destination Password: "
read distPassword
stty echo
printf "\n"

# CanaryMain Primary...
#sourceMongoHost="na03sl-mgdb-ux1004.fsac3.snaplogic.net"

# CanaryShard04 Primary...
#sourceMongoHost="na03sl-mgdb-0da16a074a767d21a.nia3.snaplogic.net"

# CanaryShard05 Primary...
#sourceMongoHost="na03sl-mgdb-00ad9e3c2bf894fa0.nia3.snaplogic.net"

# CanarySnapReplica Primary...
sourceMongoHost="na03sl-mgdb-ux1008.fsac3.snaplogic.net"

sourceMongoHostPort="27017"
sourceMongo=$sourceMongoHost:$sourceMongoHostPort

# MacawMain.
#destMongo="mongodb+srv://snaplogicmain.o5da7.mongodb.net"

# MacawShard01
#destMongo="mongodb+srv://snaplogicshard01.o5da7.mongodb.net"

# MacawShard02
#destMongo="mongodb+srv://snaplogicshard02.o5da7.mongodb.net"

# MacawSnapReplica
destMongo="mongodb+srv://snaplogicsnapreplica.o5da7.mongodb.net"


for c in $collections
do
	echo "dumping $db.$c"
	`mongodump --host=$sourceMongoHost --port=$sourceMongoHostPort --gzip --db=$db --collection=$c --authenticationDatabase=admin -u admin -p $sourcePassword`
		
	mv /Users/bgoff/git/MongoDBCheatSheet/dump/cslserver /Users/bgoff/git/MongoDBCheatSheet/dump/slserver
		
	echo "restoring to $realDb.$c"
	
	`mongorestore --uri $destMongo --nsInclude=$realDb.$c --username bgoff --password $distPassword --gzip /Users/bgoff/git/MongoDBCheatSheet/dump`
	rm -Rf /Users/bgoff/git/MongoDBCheatSheet/dump/*

done

