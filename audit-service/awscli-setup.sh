#!/bin/bash

echo 'Ensure aws-cli is installed...'
if which aws
then
	echo 'aws-cli already exist'
else
	curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "/tmp/awscli-bundle.zip"
	unzip /tmp/awscli-bundle.zip -d /tmp/
	sudo /tmp/awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
	echo 'aws-cli installed'
fi
