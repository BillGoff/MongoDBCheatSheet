#!/bin/sh

if [ ! $1 ]; then
        echo " Example of use: $0 database_name [dir_to_store]"
        exit 1
fi
db=$1
out_dir=$2
if [ ! $out_dir ]; then
        out_dir="./"
else
        mkdir -p $out_dir
fi


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

tmp_file="getCollectionNames.js"
echo "print('_ ' + db.getCollectionNames())" > $tmp_file

echo "Running mongo -u admin -p $sourcePassword $sourceMongo/$db --authenticationDatabase=admin"

cols=`mongo -u admin -p $sourcePassword $sourceMongo/$db --authenticationDatabase=admin $tmp_file | grep '_' | awk '{print $2}' | tr ',' ' '`
for c in $cols
do
	if [ $c != 'to:' ] || [ $c != 'fs_data.chunks' ] ; then
		echo "Processing $db.$c"
		`mongodump --host=$sourceMongoHost --port=$sourceMongoHostPort --gzip --db=$db --collection=$c --authenticationDatabase=admin -u admin -p $sourcePassword`
		
		mv /Users/bgoff/git/MongoDBCheatSheet/main/dump/cslsched /Users/bgoff/git/MongoDBCheatSheet/main/dump/slsched 
		
		echo "loading $db.$c"
		`mongorestore --uri $destMongo --nsInclude=$db.slsched --username bgoff --password $distPassword --gzip /Users/bgoff/git/MongoDBCheatSheet/dump`
		rm -Rf /Users/bgoff/git/MongoDBCheatSheet/dump/*
	fi
done

