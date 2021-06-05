"use strict";

const firebase = require("../db");
const Comment = require("../models/comment");
const firestore = firebase.firestore();
const COMMENTS = "comments";

const addComment = async (req, res, next) => {
  try {
    const id = req.body.taskId;
    const task = await firestore.collection(COMMENTS).doc(id);
    const commentData = await task.get();
    if (commentData.exists) {
      const data = req.body;
      const uid = firestore.collection(COMMENTS).doc().id
      await firestore.collection(COMMENTS).doc(uid).set({
        ...data, //name, taskId, timeCreated
        id: uid,
      });
      res.send("Record saved successfuly");
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


module.exports = {
  addComment
};
