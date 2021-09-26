const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const githubToken = core.getInput('githubToken');
    const keysToCheck = JSON.parse(core.getInput('compareKeys'));
    const filePath = core.getInput('filePath');

    const octokit = github.getOctokit(githubToken)
    const context = github.context;
    const tagFetchRequest = await octokit.rest.repos.listTags({
      ...context.repo,
    });

    const { data: tags } = tagFetchRequest;
    const currentJson = await octokit.rest.repos.getContent({
      ...context.repo,
      path: filePath,
      ref: tags[0].name,
    });

    const pastJson = await octokit.rest.repos.getContent({
      ...context.repo,
      path: filePath,
      ref: tags[1].name,
    });

    const currentUrl = currentJson.data.download_url;
    const pastUrl = pastJson.data.download_url;

    async function getContent(url) {
      try {
        const response = await axios.get(url);
        return response;
      } catch (error) {
        console.error(error);
      }
    }
    const currentUrlResponse = await getContent(currentUrl);
    const { data: current } = currentUrlResponse;
    const pastUrlResponse = await getContent(pastUrl);
    const { data: past } = pastUrlResponse;

    let matches = true;

    for(let i = 0; i < keysToCheck.length; i++) {
      if (current[keysToCheck[i]] !== past[keysToCheck[i]]) {
        matches = false;
        break;
      }
    }

    core.setOutput("valuesMatch", matches);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
