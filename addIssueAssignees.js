const { Octokit, App } = require("octokit");
require("dotenv").config({ path: require("find-config")(".env") });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const assigneeList = ["derrickmehaffy", "kasonde", "bolg55"];

async function randomAssignee() {
  const random = Math.floor(Math.random() * assigneeList.length);
  console.log(`Assigning to ${assigneeList[random]}`);
  return assigneeList[random];
}

async function getIssues() {
  console.log("Getting issues");

  const data = await octokit.rest.issues.listForRepo({
    owner: "strapi",
    repo: "strapi",
    state: "open",
    per_page: 100,
    labels: "status: pending reproduction",
    assignee: "none",
  });

  const issues = [];

  for (const issue of data.data) {
    issues.push({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      state: issue.state,
      created_at: issue.created_at,
      url: issue.url,
      assignee: issue.assignee,
    });
  }

  console.log(`Found ${issues.length} issues`);

  return issues;
}

async function assignIssues() {
  const issues = await getIssues();

  for (const issue of issues) {
    const assignee = await randomAssignee();

    console.log(`Assigning issue ${issue.number} to ${assignee}`);

    try {
      await octokit.rest.issues.addAssignees({
        owner: "strapi",
        repo: "strapi",
        issue_number: issue.number,
        assignees: [assignee],
      });
    } catch (error) {
      console.log(error);
    }

    console.log("Done");
  }
}

assignIssues();
