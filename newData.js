const cheerio = require("cheerio");
const axios = require("axios");
const nf = require("node-fetch");

const hackerrank = new Promise(async function (resolve, reject) {
  const response = await nf("https://www.hackerrank.com/contests");
  console.log(response);
  //   const liveContest = [],
  //     pastContest = [];
  //   let tempContest;
  //   const $ = cheerio.load(response.data);
  //   const liveContests = $(
  //     ".active_contests.active-contest-container.fnt-wt-600"
  //   ).find("li.contests-list-view.mdB");
  //   liveContests.each(function (i, el) {
  //     tempContest = $(el).find(".contest-name.head-col.truncate.txt-navy").text();
  //     liveContest.push({ title: `${tempContest}`, place: "Hackerrank" });
  //   });
  //   const pastContests = $(
  //     ".active_contests.archived-contest-container.fnt-wt-600"
  //   ).find("li.contests-list-view.mdB");
  //   pastContests.each(function (i, el) {
  //     tempContest = $(el)
  //       .find(".contest-name.head-col.truncate.txt-alt-grey")
  //       .text();
  //     pastContest.push({ title: `${tempContest}`, place: "Hackerrank" });
  //     resolve({
  //       hackerrank: {
  //         live: liveContest,
  //         past: pastContest,
  //       },
  //     });
  //   });
});

async function getData() {
  const data = await hackerrank();
  console.log(data);
}
