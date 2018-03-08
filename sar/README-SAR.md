# Code Pipeline Slack Notifier

This small Lambda app will post updates to a Slack channel for pipeline events generated by all AWS Code Pipelines in an AWS account. 

## Prerequisites

* AWS Account using Code Pipeline. Otherwise there's not much point to this. :)
* [Slack](https://slack.com/) account, and an [**incoming webhook**](https://api.slack.com/incoming-webhooks) URL you can use to post to it. This will be something like `https://hooks.slack.com/services/....`
* An AWS user with sufficient privileges to deploy the application from the AWS Serverless Application Repository

## Setup

Install the application through the AWS Serverless Application Repository. When installing you'll need to supply the Slack Url that you were given when creating the Incoming Webhook in Slack

## Extensions / modifications

To change which types of events you want to be notified about, what pipelines you want to be notified for, or to change the format of the messages sent to Slack please fork the Open Source version of this application - see https://github.com/symphoniacloud/code-pipeline-slack-notifier

-----
Copyright 2017, Symphonia LLC