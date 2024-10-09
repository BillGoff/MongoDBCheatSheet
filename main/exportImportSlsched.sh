#!/bin/sh

db=cslsched
realDb=slsched

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
sourceMongoHost="na03sl-mgdb-ux1004.fsac3.snaplogic.net"

sourceMongoHostPort="27017"
sourceMongo=$sourceMongoHost:$sourceMongoHostPort

# MacawMain.
destMongo="mongodb+srv://snaplogicmain.o5da7.mongodb.net"

cols=`mongo -u admin -p $sourcePassword $sourceMongo/$db --authenticationDatabase=admin $tmp_file | grep '_' | awk '{print $2}' | tr ',' ' '`
for c in $col
do
	echo "dumping $db.$c"
	`mongodump --host=$sourceMongoHost --port=$sourceMongoHostPort --gzip --db=$db --collection=$c --authenticationDatabase=admin -u admin -p $sourcePassword`
		
	mv /Users/bgoff/git/MongoDBCheatSheet/main/dump/cslsched /Users/bgoff/git/MongoDBCheatSheet/main/dump/slsched
		
	echo "restoring to $realDb.$c"
	
	`mongorestore --uri $destMongo --nsInclude=$realDb.$c --username bgoff --password $distPassword --gzip /Users/bgoff/git/MongoDBCheatSheet/dump`
	rm -Rf /Users/bgoff/git/MongoDBCheatSheet/dump/*

done

