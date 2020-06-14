const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const Contest = require('../../models/Contest')

const hackerrank = new Promise(function (resolve, reject) {
  axios
    .get("https://www.hackerrank.com/contests")
    .then((response) => {
      const liveContest = [],
        pastContest = [];
      let tempContest;
      const $ = cheerio.load(response.data);
      const liveContests = $(
        ".active_contests.active-contest-container.fnt-wt-600"
      ).find("li.contests-list-view.mdB");
      liveContests.each(function (i, el) {
        tempContest = $(el)
          .find(".contest-name.head-col.truncate.txt-navy")
          .text();
        liveContest.push({ title: `${tempContest}`, place: 'Hackerrank' });
      });
      const pastContests = $(
        ".active_contests.archived-contest-container.fnt-wt-600"
      ).find("li.contests-list-view.mdB");
      pastContests.each(function (i, el) {
        tempContest = $(el)
          .find(".contest-name.head-col.truncate.txt-alt-grey")
          .text();
        pastContest.push({ title: `${tempContest}`, place: 'Hackerrank' });
        resolve({
          hackerrank: {
            live: liveContest,
            past: pastContest,
          },
        });
      });
    })
    .catch((err) => {
      reject(err);
    });
});

const codeforces = new Promise(function (resolve, reject) {
  const liveContest = [],
    upcomingContest = [],
    pastContest = [];
  let temp, temp2;
  axios
    .get("https://codeforces.com/api/contest.list?gym=false")
    .then((response) => {
      temp = response.data.result.filter((contest) => {
        return contest.phase === "BEFORE";
      });
      temp.map((contest) => {
        upcomingContest.push({
          title: `${contest.name}`,
          place: 'Codeforces',
          startTime: contest.startTimeSeconds,
          endTime: contest.startTimeSeconds + contest.durationSeconds,
        });
      });
      temp = response.data.result.filter((contest) => {
        return contest.phase === "FINISHED";
      });
      temp2 = temp.slice(0, 5);
      temp2.map((contest) => {
        pastContest.push({
          title: `${contest.name}`,
          place: 'Codeforces',
          startTime: contest.startTimeSeconds,
          endTime: contest.startTimeSeconds + contest.durationSeconds,
        });
      });
      resolve({
        codeforces: {
          upcoming: upcomingContest,
          past: pastContest,
        },
      });
    });
});

const hackerearth = new Promise(async (resolve, reject) => {
  const urls = [],
    contests = [];
  let tempContest;
  const html = await axios.get("https://www.hackerearth.com/challenges/");
  const $ = cheerio.load(html.data);

  const ongoingContests = $(".ongoing.challenge-list").find(
    "div.challenge-card-modern"
  );
  ongoingContests.each((i, el) => {
    tempContest = $(el)
      .find(".challenge-card-wrapper.challenge-card-link")
      .attr("href");
    if (tempContest.includes("competitive")) {
      if (tempContest.includes("https://www.hackerearth.com/")) {
        urls.push({ url: tempContest, phase: "ONGOING" });
      } else {
        urls.push({
          url: "https://www.hackerearth.com" + tempContest,
          phase: "ONGOING",
        });
      }
    }
  });

  const upcomingContests = $(".upcoming.challenge-list").find(
    "div.challenge-card-modern"
  );
  upcomingContests.each((i, el) => {
    tempContest = $(el)
      .find(".challenge-card-wrapper.challenge-card-link")
      .attr("href");
    if (tempContest.includes("competitive")) {
      if (tempContest.includes("https://www.hackerearth.com/")) {
        urls.push({ url: tempContest, phase: "UPCOMING" });
      } else {
        urls.push({
          url: "https://www.hackerearth.com" + tempContest,
          phase: "UPCOMING",
        });
      }
    }
  });

  const data = await parallelProcess(urls);
  //   // console.log(await parallelProcess(urls));
  if (data) {
    resolve({
      hackerearth: {
        live: data.filter((contest) => {
          return contest.phase === "ONGOING";
        }),
        upcoming: data.filter((contest) => {
          return contest.phase === "UPCOMING";
        }),
      },
    });
  }
});

function getData(url) {
  return new Promise(function (resolve, reject) {
    let temp = [];
    axios
      .get(url.url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const title = $("h1.event-title").attr("title");
        const timeRef = $("span.timing-text");
        timeRef.each((i, el) => {
          temp[i] = $(el).text();
        });
        resolve({
          title: title.trim(),
          startTime: temp[0],
          endTime: temp[1],
          phase: url.phase,
          place: 'Hackerearth'
        });
      })
      .catch((e) => reject(e, "node"));
  });
}

function parallelProcess(urls) {
  try {
    const data = urls.map((url) => getData(url));
    return Promise.all(data);
  } catch (err) {
    console.log(err);
  }
}

const getContest = (req, res) => {
  Promise.all([hackerrank, codeforces, hackerearth])
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((e) => console.log(e, "Hello"));
};

const router = express.Router();
router.get("/", getContest);
router.get("/discussion/:title", async (req, res) => {
  const contest = await Contest.findOne({title: req.params.title})
  if(contest) {
    return res.status(200).json(contest)
  }
  else {
    const newC = await Contest.create({title: req.params.title})
    return res.status(200).json(newC)
  }
})
router.get("/all", async (req, res) => {
  //await Contest.deleteMany()
  const contests = await Contest.find()
  return res.status(200).json(contests)
})
module.exports = router;
