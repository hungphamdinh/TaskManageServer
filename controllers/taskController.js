"use strict";

const firebase = require("../db");
const Task = require("../models/task");
const firestore = firebase.firestore();
const TASKS = "tasks";
const USERS = "users";

const addTask = async (req, res, next) => {
  try {
    const id = req.body.userId;
    const task = await firestore.collection(USERS).doc(id); // filerBy userId
    const tasKData = await task.get();
    if (tasKData.exists) {
      const data = req.body;
      const uid = firestore.collection(TASKS).doc().id
      console.log(uid);
      await firestore.collection(TASKS).doc().set({
        ...data,
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
};
