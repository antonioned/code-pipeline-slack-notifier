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

    var PRStateEvent = "CodeCommit Pull Request State Change";
    var PRCommentEvent = "CodeCommit Comment on Pull Request";

    console.log(event);

    var color;
    var text = '';
    var username = '';
    var PRstatus = event.detail.pullRequestStatus;  // Sets PR status which can be Open, Closed or Merged.
    var repoPRstate = event.detail.repositoryNames;  // Sets repo name in the PR State Change event
    var repoPRcomment = event.detail.repositoryName;   // Sets repo name in the Comment on PR event (this is different than Stage Change event)
    var PRnumber = event.detail.pullRequestId;   // Sets the PR number
    var title = event.detail.title;  // Sets the PR title
    var arn = "arn:aws:iam::12345:user/";  // Sets the common part of the user ARN (optional to set)

    if (event.detail.callerUserArn == "" + arn + "/name"){
        username = "name";
    }
    else if (event.detail.callerUserArn == "" + arn + "/name2"){
        username = "name2";
    }
    else throw new Error ("Unknown user.");

    if (event.detail.isMerged == "True"){      // This gets the value of the isMerged field in the CW event, so you can set the status to Merged.
         PRstatus = "Merged";                  // If you don't do this, then PRstatus will just show as Closed.
    }
    else PRstatus = PRstatus;


    // Sets the text for the slack notification for the PR State Change event. Please take not of the link, you may have to alter this.
    var textPRstate = "A pull request event occured in the *" + repoPRstate + "* repo, created by *" + username + "*, with the title: `" + title + "`. Status of the PR is *" + PRstatus + "*. To view it, please visit https://us-west-2.console.aws.amazon.com/codesuite/codecommit/repositories/" + repoPRstate + "/pull-requests/" + PRnumber + "/details?region=us-west-2";

    // Sets the text for the Comment on PR event.
    var textPRcomments = "*" + username + "* left a comment on the PR number " + PRnumber + ". To view it, please visit https://us-west-2.console.aws.amazon.com/codesuite/codecommit/repositories/" + repoPRcomment + "/pull-requests/" + PRnumber + "/changes?region=us-west-2";


    if (event['detail-type'] == PRStateEvent) {
        color = "#d6cec0";
        text += textPRstate;
        }
    else if (event['detail-type'] == PRCommentEvent){
        color = "#d6cec0";
        text += textPRcomments;
    }
    else throw new Error ("Unsupported detail type: " + event['detail-type']);

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

exports.__test__ = {
    generateRequestDetails: generateRequestDetails
};
