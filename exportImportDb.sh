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

tmp_file="getCollectionNames.js"
echo "print('_ ' + db.getCollectionNames())" > $tmp_file

echo "Running mongo -u admin -p $sourcePassword $sourceMongo/$db --authenticationDatabase=admin"

cols=`mongo -u admin -p $sourcePassword $sourceMongo/$db --authenticationDatabase=admin $tmp_file | grep '_' | awk '{print $2}' | tr ',' ' '`
for c in $cols
do
	if [ $c != 'to:' ] || [ $c != 'fs_data.chunks' ] ; then
		echo "Processing $db.$c"
		`mongodump --host=$sourceMongoHost --port=$sourceMongoHostPort --gzip --db=$db --collection=$c --authenticationDatabase=admin -u admin -p $sourcePassword`
		echo "loading $db.$c"
		`mongorestore --uri $destMongo --nsInclude=$db.$c --username bgoff --password $distPassword --gzip /Users/bgoff/git/MongoDBCheatSheet/dump`
		rm -Rf /Users/bgoff/git/MongoDBCheatSheet/dump/*
	fi
done

