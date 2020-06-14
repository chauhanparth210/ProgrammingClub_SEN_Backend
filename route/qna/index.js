const express = require("express");
const QnA = require("../../models/qna");

const getAllQuestions = (req, res) => {
  QnA.find()
    .populate("user", ["name", "studentID"])
    .select("user question date")
    .then((response) => {
      res.status(200).json({ question: response });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to query database..." });
    });
};

const getQuestionAnswer = (req, res) => {
  const qID = req.params.qID;
  QnA.findById(qID)
    .populate("user", ["name", "studentID"])
    .select("-_id -__v")
    .then((response) => {
      res.status(200).json({ question: response });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to query database..." });
    });
};

const postQuestion = (req, res) => {
  const { question, user } = req.body;

  const newQuestion = new QnA({
    question,
    user,
  });

  newQuestion
    .save()
    .then((response) => {
      res.status(200).json({ message: "Question posted successfully!..." });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to query database..." });
    });
};

const deleteQuestion = (req, res) => {
  const qID = req.params.qID;
  QnA.deleteOne({ _id: qID })
    .then((response) => {
      res.status(200).json({ message: "Question deleted successfully!..." });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to query database..." });
    });
};

const postQuestionAnswer = (req, res) => {
  const { user, answer } = req.body;
  const qID = req.params.qID;
  const newAnswer = {
    user,
    answer,
  };
  QnA.findById(qID)
    .then((response) => {
      response.answers.unshift(newAnswer);
      response.save().then((ans) => {
        res.status(200).json({ message: "post answer successfully!..." });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to query database..." });
    });
};

const postUpVote = (req, res) => {
  const { user } = req.body;
  const qID = req.params.qID;
  const ansID = req.params.ansID;
  QnA.findById(qID).then((response) => {
    response.findById(ansID).then((data) => {
      console.log(data);
    });
  });
};

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:qID", getQuestionAnswer);
router.post("/", postQuestion);
router.delete("/:qID", deleteQuestion);
router.post("/:qID", postQuestionAnswer);
router.post("/:qID/:ansID/upvote", postUpVote);

module.exports = router;
