"use strict";

const firebase = require("../db");
const Task = require("../models/task");
const TaskDetail = require("../models/taskDetail");
const SubTask = require("../models/subTask");
const Comment = require("../models/comment");
const firestore = firebase.firestore();
const TASKS = "tasks";
const SUBTASKS = "subTasks";
const COMMENT = "comment";

const USERS = "users";

const addTask = async (req, res, next) => {
  try {
    const id = req.body.userId;
    const task = await firestore.collection(USERS).doc(id); // filerBy userId
    const tasKData = await task.get();
    if (tasKData.exists) {
      const data = req.body;
      const uid = firestore.collection(TASKS).doc().id;
      await firestore
        .collection(TASKS)
        .doc(uid)
        .set({
          ...data,//name, userId, timeCreated, timeStart, timeEnd
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

const getAllTask = async (req, res, next) => {
  try {
    const tasks = await firestore.collection(TASKS);
    const data = await tasks.get();
    const tasksArray = [];
    if (data.empty) {
      res.status(404).send("No student record found");
    } else {
      data.forEach((doc) => {
        const task = new Task(
          // doc.id,
          doc.data().name,
          doc.data().userId,
          doc.data().status,
          doc.data().timeCreated,
          doc.data().members,
          doc.data().description
        );
        tasksArray.push(task);
      });
      res.send(tasksArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getDetailTaskById = async (req, res, next) => {
  try {
    const id = req.query.id;
    const userId = req.query.userId;
    let task = {};
    let subTasks = [];
    let comments = [];
    const userData = await firestore
      .collection(TASKS)
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          task = new TaskDetail(
            data.id,
            data.name,
            data.userId,
            data.status,
            data.timeCreated,
            data.timeStart,
            data.timeEnd,
            data.members,
            data.description,
            userId === data.userId ? true : false
          );
          return doc;
        });
        return querySnapshot;
      });
    const taskData = await firestore
      .collection(SUBTASKS)
      .where("parentId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const subTask = new SubTask(
            doc.data().id,
            doc.data().name,
            doc.data().parentId,
            doc.data().timeCreated,
            doc.data().status
          );
          subTasks.push(subTask);
          return doc;
        });
        return querySnapshot;
      });
    const commentData = await firestore
      .collection(COMMENT)
      .where("taskId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const comment = new Comment(
            doc.data().id,
            doc.data().name,
            doc.data().taskId,
            doc.data().timeCreated
          );
          comments.push(subTask);
          return doc;
        });
        return querySnapshot;
      });
    task.subTasks = subTasks;
    task.comments = comments;
    res.send(task);
    if (!userData.exist) {
      res.send("Wrong taskId");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTasksByUserId = async (req, res, next) => {
  try {
    const id = req.query.id;
    console.log(id);
    let array = [];
    const userData = await firestore
      .collection(TASKS)
      .where("userId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          const task = new Task(
            doc.data().id,
            doc.data().name,
            doc.data().userId,
            doc.data().status,
            doc.data().timeCreated,
            doc.data().timeStart,
            doc.data().timeEnd,
            doc.data().members,
            doc.data().description
          );
          array.push(task);
          return doc;
        });
        res.send(array);
        return querySnapshot;
      }); // filerBy userId
    if (!userData.exist) {
      res.send("Wrong userId");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const task = await firestore.collection(TASKS).doc(id);
    await task.update(data);
    res.send("Task record updated successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection(TASKS).doc(id).delete();
    res.send("Record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addTask,
  getAllTask,
  getTasksByUserId,
  updateTask,
  deleteTask,
  getDetailTaskById,
};
