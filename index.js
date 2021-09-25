const core = require('@actions/core');
const github = require('@actions/github');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run() {
  try {
    const myToken = core.getInput('myToken');

    const octokit = github.getOctokit(myToken)
    const context = github.context;
    const tagFetchRequest = await octokit.rest.repos.listTags({
      ...context.repo,
    });

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

    const currentUrl = currentJson?.data?.url;
    const pastUrl = pastJson?.data?.url;

    console.log(`${currentUrl}`);
    console.log(`${pastUrl}`);

    const currentUrlResponse = await fetch(currentUrl);
    const currentJsonBody = await currentUrlResponse.json();
    console.log(currentJsonBody);

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
