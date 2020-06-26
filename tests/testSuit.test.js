const req = require("supertest");
const app = require("../app");

// Models required
const User = require("../models/user");
const QnA = require("../models/qna");
const Post = require("../models/post");

//test cases for Sign IN the Application
describe("SignIn", () => {
  test("should 500 if username is missing from body", async () => {
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    await SignIn(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database query Failed!..",
    });
  });

  test("should 404 if user doesnot exist in system", async () => {
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    await SignIn(req, res);
    expect(res.message).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "username doesnot exist in system",
    });
  });

  test("should 500 with Email Confirmation Pending....", async () => {
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    await SignIn(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(user.isStudentVerified).value(false);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email Confirmation Pending....",
    });
  });

  test("should 500 with Auth failed!..", async () => {
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    await SignIn(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(user.isStudentVerified).value(true);
    expect(compare(req.body.password, user.password).toHaveBeenCalledWith(500));
    expect(res.json).toHaveBeenCalledWith({ message: "Auth failed!...." });
  });

  test("should 201 Successful Authentication.!", async () => {
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    await SignIn(req, res);
    expect(user.isStudentVerified).value(true);
    expect(compare(req.body.password, user.password).toHaveBeenCalledWith(201));
    expect(res.json).toHaveBeenCalledWith({
      message: "Successful Authentication.!",
    });
  });

  test('should 500 Incorrect Password!.."', async () => {
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    await SignIn(req, res);
    expect(user.isStudentVerified).value(true);
    expect(compare(req.body.password, user.password).toHaveBeenCalledWith(201));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Incorrect Password!.."',
    });
  });
});

//test cases for studentVerification the Application
describe("studentVerification", () => {
  test("should 500 if User is not in the system", async () => {
    const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
    await studentVerification(req, res);
    const req = User.update({ studentID }, { isStudentVerified: true });
    const res = req.status();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error. Could not verify user!..",
    });
  });

  test("should 500 if User is not in the system", async () => {
    await studentVerification(req, res);
    const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
    const req = User.update({ studentID }, { isStudentVerified: true });
    const res = req.status();
    expect(res.status).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith({
      message: "Updated Successfully and indirect to Login Page",
    });
    res.redirect(process.env.LOGIN_PAGE);
  });
});

//test cases for sendPasswordResetLink
describe("sendPasswordResetLink", () => {
  test("should 201 if Send the mail to user ", async () => {
    await sendPasswordResetLink(req, res);
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    expect(res.status).toHaveBeenCalledWith(201);
    sendPasswordResetMail(studentID);
    expect(res.json).toHaveBeenCalledWith({
      message: "Plaese check your email!.",
    });
  });

  test("should 500 if User is not in the system", async () => {
    await sendPasswordResetLink(req, res);
    const req = User.findOne({ studentID: req.body.studentID });
    const res = req.status();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User is not exist!..."',
    });
  });
});

//test cases for resetPassword
describe("resetPassword", () => {
  test("should 201 if Password is changed Successfully.", async () => {
    await resetPassword(req, res);
    const { password } = req.body;
    const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
    const { studentID } = user;
    bcrypt.genSalt(saltRounds, (err, salt));
    bcrypt.hash(password, salt, (err, hash));
    expect(
      User.findOneAndUpdate(
        { studentID },
        { password: hash }
      ).toHaveBeenCalledWith(201)
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Password is changed Successfully.",
    });
  });

  test("should 500 if Password is not changed!..", async () => {
    await resetPassword(req, res);
    const { password } = req.body;
    const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
    const { studentID } = user;
    bcrypt.genSalt(saltRounds, (err, salt));
    bcrypt.hash(password, salt, (err, hash));
    expect(
      User.findOneAndUpdate(
        { studentID },
        { password: hash }
      ).toHaveBeenCalledWith(500)
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Password is not changed!...",
    });
  });
});

//test cases for getAllQuestions
describe("getAllQuestions", () => {
  test("should no any response if no any questions", async () => {
    await getAllQuestions(req, res);
    const { studentID } = user;
    expect(
      QnA.find()
        .populate("user", ["name", "studentID"])
        .select("user question date")
    ).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "This are the Questions",
    });
  });

  test("should 500 if Database query failed!...", async () => {
    await getAllQuestions(req, res);
    const { studentID } = user;
    expect(
      QnA.find()
        .populate("user", ["name", "studentID"])
        .select("user question date")
    ).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to query database...",
    });
  });
});

//test cases for postQuestion
describe("postQuestion", () => {
  test("successfully posted the Question", async () => {
    await postQuestion(req, res);
    const { question, user } = req.body;
    const newQuestion = new QnA({ question, user });
    expect(newQuestion.save()).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Question posted successfully!...",
    });
  });

  test("should 500 if Database query failed!...", async () => {
    await postQuestion(req, res);
    const { question, user } = req.body;
    const newQuestion = new QnA({ question, user });
    expect(newQuestion.save()).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to query database...",
    });
  });
});

//test cases for deleteBlog
describe("deletePost", () => {
  test("should no any response if no any questions", async () => {
    await deletePost(req, res);
    const user = User.findOne({ user: req.user.id });
    const post = Post.findById(req.params.id);
    post.remove();
    expect(res.json).toHaveBeenCalledWith({
      message: "success: true ",
    });
  });

  test("should 404  if No post found!...", async () => {
    await deletePost(req, res);
    const user = User.findOne({ user: req.user.id });
    const post = Post.findById(req.params.id);
    post.remove();
    expect(res.response).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'postnotfound: "No post found" ',
    });
  });
});

//test cases for ClapBlog
describe("LikePost", () => {
  test("successfully posted the Question", async () => {
    await LikePost(req, res);
    const user = User.findOne({ user: req.user.id });
    const post = Post.findById(req.params.id);
    Post.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } });
    expect(Post).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'message: "liked post"' });
  });

  test("should 500 if NO any post!...", async () => {
    await LikePost(req, res);
    const user = User.findOne({ user: req.user.id });
    const post = Post.findById(req.params.id);
    expect(Post).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: '"No Any post" ' });
  });
});

//test cases for Create Blog
describe("createPost", () => {
  test("successfully  createPost", async () => {
    await createPost(req, res);
    const { title, editorState, createdBy, createDate } = req.body;
    const newPost = new Post({
      user: createdBy,
      title,
      post: editorState,
      date: createDate,
    });
    expect(newPost.save()).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Successfully posted"' });
  });

  test("should 500 if issue in creating  post!...", async () => {
    await createPost(req, res);
    const { title, editorState, createdBy, createDate } = req.body;
    const newPost = new Post({
      user: createdBy,
      title,
      post: editorState,
      date: createDate,
    });
    expect(newPost.save()).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error on Creating Post"',
    });
  });
});

//test cases for getBlog

describe("getPost", () => {
  test("successfully  getPost", async () => {
    await getPost(req, res);
    const Post = Post.findById(req.params.id);
    Post.populate("user", "name studentID -_id");
    expect(res.json(post).toHaveBeenCalledWith(post));
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successfully get posted "',
    });
  });

  test("should 404 No post found with that ID...", async () => {
    await getPost(req, res);
    const Post = Post.findById(req.params.id);
    Post.populate("user", "name studentID -_id");
    expect(res.json(Post).toHaveBeenCalledWith(404));
    expect(res.json).toHaveBeenCalledWith({
      message: 'No post found with that ID "',
    });
  });
});
