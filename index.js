const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const myToken = core.getInput('myToken');

    const octokit = github.getOctokit(myToken)
    const context = github.context;
    const tagFetchRequest = await octokit.rest.repos.listTags({
      ...context.repo,
    });
    const tagResponse = JSON.stringify(tagFetchRequest, undefined, 2);

    const { data: tags } = tagFetchRequest;
    const currentJson = await octokit.rest.repos.getContent({
      ...context.repo,
      path: 'app.json',
    });

    const pastJson = await octokit.rest.repos.getContent({
      ...context.repo,
      path: 'app.json',
      ref: tags[1].name,
    });

    console.log(`currentJson: ${currentJson}`);
    console.log(`pastJson: ${past}`);

    console.log(`tags: ${tagResponse}`);

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
