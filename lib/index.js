var request = require('request');

const SLACK_URL = process.env.SLACK_URL;

exports.handler = (event, context, callback) => {
    request(generateRequestDetails(event, SLACK_URL), function (err, res, body) {
        if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            callback(null, 'Done');
        }
        else {
            console.log('Error: ' + err + ' ' + res + ' ' + body);
            callback('Error');
        }
    });
};

function generateRequestDetails(event, url) {

    var CodePipelineEvent = "CodePipeline Stage Execution State Change";
    var CodeCommitEvent = "CodeCommit Repository State Change";
    var ECSEvent = "ECS Task State Change";

    console.log(event);
    //if (event['detail-type'] != CodePipelineEvent || event['detail-type'] != CodeCommitEvent || event['detail-type'] != ECSEvent)
      //  throw new Error ("Unsupported detail type: " + event['detail-type']);


    var color;
    var text = '';
    var textCodeCommit = "Branch (*" + event.detail.referenceName + "*) from repository (*" + event.detail.repositoryName + "*) has been updated.";
    var textPipeline = "CodePipeline (*" + event.detail.pipeline + "*) Stage: *" + event.detail.stage + "* ";
    var textECS = "*" + event.detail.group + "* is updating...";
    var pipelineState = event.detail.state;
    //var branchName = event.detail.referenceName;
    //var ECSserviceName = event.detail.group;
    var branches = process.env.BRANCHES;
    var repos = process.env.REPOS;
    var ecs_services = process.env.ECS_SERVICES;
    branches = Array.from(branches.split(','));
    repos = Array.from(repos.split(','));
    ecs_services = Array.from(ecs_services.split(','));

    if (event['detail-type'] == CodePipelineEvent) text += textPipeline;
    if (event['detail-type'] == CodeCommitEvent) {
        if (branches.indexOf(event.detail.referenceName) != -1 && repos.indexOf(event.detail.repositoryName) != -1) {
            color = "good";
            text += textCodeCommit;
        }
        else throw new Error ("Branch/Repo does not have a pipeline set.");
    }

    if (event['detail-type'] == ECSEvent) {
        if (ecs_services.indexOf(event.detail.group) != -1) {
            color = "#85C1E9";
            text += textECS;
        }
        else throw new Error ("ECS service does not have a pipeline set.");
    }

    if (pipelineState) {
        if (pipelineState == 'STARTED') {
                //await sleep(10000);
                color = "#888888";
                text += "has started.";
        }
        else if (pipelineState == 'SUCCEEDED') {
                color = "good";
                text += "has *succeeded*.";
        }
        else if (pipelineState == 'FAILED') {
                color = "danger";
                text += "has *failed*.";
        }
        else {
            color = "warning";
            text += "has " + pipelineState + " (This is an unknown state to the Slack notifier.)";
        }
    }

    console.log('Posting following message to Slack: ' + text);

    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
            attachments: [ {text: text, color: color}]
        }
    };

    return options;
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

exports.__test__ = {
    generateRequestDetails: generateRequestDetails
};
