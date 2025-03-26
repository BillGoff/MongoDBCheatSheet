#!/bin/sh
# This script is used to do the following things with mongosync.
# 1.  Verify we can do a commit.
# 2.  commit
# 3.  verify it committed successfully
# 4.  reverse
# 5.  verify we reversed successfully

# function to print the help.
function printHelp () {
	echo ""
	echo "	There are three ways to execute this scipt:"
	echo "	Usage (1): interactivly,  If you do not supply an port as an arguement:"
	echo "		The scrip will as you for the port of the monogsync"
	echo "			progressCommitReverse.sh"
	echo "	Usage (2): provide a single port, this will cause the scritp to run against the port supplied:"
	echo "			progressCommitReverse.sh 27182"
	echo "	Usage (3): provide a list of ports, this will cause the script to multi-thread the calls against the ports supplied:"
	echo "			progressCommitReverse.sh 27182 27183"
	echo "	In all cases we will produce a log file based on the port"
	echo "		If you supply 27182, your log file for that run will be mongoSync.27182.log"
	echo "	Note: default mongosync port is 27182, ideally you want to use ports 27182 and up."
	echo ""
}

# This method validates the port making sure it is a number between 0 - 65535
function validatePort () {
	if [[ "$mongoSyncPort" =~ ^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$ ]]; then
		echo "Valid port number: $mongoSyncPort" > mongoSync.$mongoSyncPort.log
		return 0;
	fi
	return 1;
}

# this method is used to calculate how long something took to happen.
function calculateTime() {
        date1=$1
        date2=$2

        echo "comparing $date1 to $date2"
        date1_seconds=$(date -d "$date1" +%s)
        date2_seconds=$(date -d "$date2" +%s)

        if [[ -z "$date1_seconds" || -z "$date2_seconds" ]]; then
                echo "Invalid date format. Use 'YYYY-MM-DD HH:MM:SS'"
                exit 1
        fi

        diff_seconds=$((date2_seconds - date1_seconds))

        if [[ "$diff_seconds" -lt 0 ]]; then
                diff_seconds=$((-diff_seconds))
        fi

        days=$((diff_seconds / (60 * 60 * 24)))
        hours=$(( (diff_seconds % (60 * 60 * 24)) / (60 * 60) ))
        minutes=$(( (diff_seconds % (60 * 60)) / 60 ))
        seconds=$((diff_seconds % 60))

        msg="$days days, $hours hours, $minutes minutes, $seconds seconds"
        echo $msg
}

# This function does the actual checking the progress (making sure we can commit), then commits, then waits for the commit flag
# to come back as "COMMITTED", then does the reverse.
function progressCommitReverse () {
	mongoSyncPort=$1

	startDate=$(date);
	writeDuration=0

	echo "All log entries are now going to the mongoSync.$mongoSyncPort.log log file!"
	validatePort $mongoSyncPort
	validPort=$?
	if [ $validPort == 0 ]; then
		canCommit=false
		progressReport='"canCommit":false'

		# Check to make sure we can actually commit...
		while ! $canCommit
		do
			echo "Can Commit is false..  Retrying " >>  mongoSync.$mongoSyncPort.log
			progressReport=$(curl localhost:$mongoSyncPort/api/v1/progress)
			echo $progressReport >> mongoSync.$mongoSyncPort.log
			if [[ $progressReport =~ '"canCommit":true' ]]; then
				canCommit=true;
			fi
		done
		
		//We can commit.  now committing.
		echo "Committing $mongoSyncPort" >> mongoSync.$mongoSyncPort.log
		commitStatus=$(curl localhost:$mongoSyncPort/api/v1/commit -XPOST --data '{ }')
		echo $commitStatus >> mongoSync.$mongoSyncPort.log
		if [[ $commitStatus != '{"success":true}' ]]; then
			echo "Failed to successfully commit mongosync"
			echo "Failed to successfully commit mongosync" >> mongoSync.$mongoSyncPort.log
			exit 1
		fi

		//Check to make sure we are now in a COMMITTED state.
		committed=false
		canWrite=false;
		while ! $committed
		do
			echo "Committed is false... Retrying " >> mongoSync.$mongoSyncPort.log
			progressReport=$(curl localhost:$mongoSyncPort/api/v1/progress)
			echo $progressReport >> mongoSync.$mongoSyncPort.log
			if [[ $canWrite == false ]]; then
				if [[ $progressReport =~ '"canWrite":true' ]]; then
					writeDate=$(date)
					calculateTime "$startDate" "$writeDate"
					writeDuration=$msg
					echo "It took $writeDuration to be able to write"
					canWrite=true
				fi
			fi

			if [[ $progressReport =~ '"state":"COMMITTED"' ]]; then
				committed=true;
			fi
		done

		commitDate=$(date)
		calculateTime "$startDate" "$commitDate"
		commitDuration=$msg 
	
		echo "we are now in a committed state..  Reversing..." >> mongoSync.$mongoSyncPort.log
		reverseStatus=$(curl localhost:$mongoSyncPort/api/v1/reverse -XPOST --data '{ }')
		echo $reverseStatus >> mongoSync.$mongoSyncPort.log
		if [[ $reverseStatus != '{"success":true}' ]]; then
			echo "Failed to successfully reverse  mongosync"
			exit 1
		fi

		endDate=$(date)
		calculateTime "$startDate" "$endDate"

		echo "mongosync is now reversed" >> mongoSync.$mongoSyncPort.log

		echo "It took $writeDuration to be able to get to a writable state."
		echo "It took $commitDuration to complete commited state."
		echo "It took $msg to complete entire commit, reverse cycle."
	else
		exit 1
	fi
	exit 0
}

if [ "$#" -eq 0 ]; then
	printf "enter port to connect to Mongo Sync At:  "
	read mongoSyncPort
	progressCommitReverse $mongoSyncPort
elif [ "$#" -eq 1 ]; then
	if [ "$1" == "-h" ] || [ "$1" == "-help" ]; then
		printHelp
	else
		mongoSyncPort=$1
		progressCommitReverse $mongoSyncPort
	fi
else
	for mongoSyncPort in "$@"
	do
		echo "Attempting to commit reverse multiple ports $mongoSyncPort"
		progressCommitReverse $mongoSyncPort &
	done
	wait
	echo "all ports processed!"
fi
