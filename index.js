const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const myToken = core.getInput('myToken');

    const octokit = github.getOctokit(myToken)
    const context = github.context;
    const tags = await octokit.rest.repos.listTags({
      ...context.repo,
    });
    const tagOutput = JSON.stringify(tags, undefined, 2)

    console.log(`tags: ${tagOutput}`);

    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
