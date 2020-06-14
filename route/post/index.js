const express = require("express");

const Post = require("../../models/post");
const User = require("../../models/user");

const {
  checkPCMember,
  checkAuth
} = require("../../middleware/checkAuthenticity");

const getPosts = (req, res) => {
  Post.find()
    .populate("user", ["name", "studentID"])
    .select("user likes title date")
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
};

const getPost = (req, res) => {
  Post.findById(req.params.id)
    .populate("user", "name studentID -_id")
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ nopostfound: "No post found with that ID" });
      }
    })
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
};

const createPost = (req, res) => {
  const { title, editorState, createdBy, createDate } = req.body;
  const newPost = new Post({
    user: createdBy,
    title,
    post: editorState,
    date: createDate
  });
  newPost.save().then(post => res.json(post));
};

const deletePost = (req, res) => {
  User.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Check for post owner
        // if (post.user.toString() !== req.user.id) {
        //   return res.status(401).json({ notauthorized: "User not authorized" });
        // }

        // Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  });
};

const LikePost = (req, res) => {
  Post.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } })
    .then(post => {
      res.json({ message: "liked post" });
    })
    .catch(err => console.log(err));
};

const commentPost = (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // console.log(req.body);

      const newComment = {
        comment: req.body.comment,
        createdBy: req.body.createdBy,
        date: req.body.date
      };

      console.log(newComment);

      // Add to comments array
      post.comments.unshift(newComment);

      // Save
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: "No post found" }));
};

const router = express.Router();

router.get("/", getPosts); //done
router.get("/:id", getPost); //done
router.post("/", checkPCMember, createPost); //done
router.delete("/:id", checkPCMember, deletePost);
router.post("/like/:id", checkAuth, LikePost); //done
router.post("/comment/:id", checkAuth, commentPost);

module.exports = router;
