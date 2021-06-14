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
const MEMBER = "members";

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
          ...data, //name, userId, timeCreated, timeStart, timeEnd
          id: uid,
          timeCreated: new Date()
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
          doc.data().description,
          doc.data().currentTime,
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
            userId === data.userId ? true : false,
            data.date,
          );
          return doc;
        });
        return querySnapshot;
      });
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
    let array = [];
    const userData = await firestore
      .collection(TASKS)
      .where("userId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const task = new Task(
            doc.data().id,
            doc.data().name,
            doc.data().userId,
            doc.data().status,
            doc.data().timeCreated,
            doc.data().timeStart,
            doc.data().timeEnd,
            doc.data().members,
            doc.data().description,
            doc.data().date
          );
          array.push(task);
          return doc;
        });
        return querySnapshot;
      }); // filerBy userId
    const parentUser = await firestore.collection(MEMBER).doc(id).get();
    if (parentUser.exists) {
      const userId = parentUser.data().userId;
      await firestore
        .collection(TASKS)
        .where("userId", "==", userId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.data().members.forEach((item) => {
              if (item.memberId === id) {
                // console.log('abc');
                const task = new Task(
                  doc.data().id,
                  doc.data().name,
                  doc.data().userId,
                  doc.data().status,
                  doc.data().timeCreated,
                  doc.data().timeStart,
                  doc.data().timeEnd,
                  doc.data().members,
                  doc.data().description,
                  doc.data().date
                );
                array.push(task);
              }
            });

            return doc;
          });
          return querySnapshot;
        });
    }

    res.send({
      message: "Success",
      status: 200,
      data: array,
    });
    if (!userData.exist) {
      res.send("Wrong userId");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = req.body.id;
    const data = req.body;
    const task = await firestore.collection(TASKS).doc(id);
    const dataTask = await task.get();
    await task.update({
      name: data.name,
      status: data.status,
      members: data.members,
      description: data.description,
    });
    res.send({
      status: 200,
      message: "Record save successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
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
