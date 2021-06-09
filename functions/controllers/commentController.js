"use strict";

const firebase = require("../db");
const Comment = require("../models/comment");
const firestore = firebase.firestore();
const COMMENTS = "comments";
const TASKS = "tasks";
const addComment = async (req, res, next) => {
  try {
    const id = req.body.taskId;
    const data = req.body;
    const task = await firestore.collection(TASKS).doc(id);
    const commentData = await task.get();
    if (commentData.exists && data.user && data.message !== "") {
      const uid = firestore.collection(COMMENTS).doc().id;
      await firestore
        .collection(COMMENTS)
        .doc(uid)
        .set({
          ...data, //name, taskId, timeCreated, image, file
          id: uid,
          image: data.image ? data.image : "",
          file: data.file ? data.file : "",
        });
      res.send({
        message: "Record saved successfuly",
        statusCode: 200,
      });
    } else if (data.user) {
      res.send({
        message: "User info not null",
        statusCode: 400,
      });
    } else {
      res.send({
        message: "Record save failed",
        statusCode: 400,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCommentByTaskId = async (req, res, next) => {
  try {
    const id = req.query.taskId;
    let array = [];
    const userData = await firestore
      .collection(COMMENTS)
      .where("taskId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          const comment = new Comment(
            doc.data().id,
            doc.data().message,
            doc.data().taskId,
            doc.data().timeCreated,
            doc.data().image,
            doc.data().file,
            doc.data().user
          );
          array.push(comment);
          return doc;
        });
        res.send({
          message: "Success",
          statusCode: 200,
          data: array,
        });
        return querySnapshot;
      }); // filerBy userId
    if (!userData.exist) {
      res.send({
        message: "Wrong task Id",
        statusCode: 400,
        data: [],
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = {
  addComment,
  getCommentByTaskId,
};
