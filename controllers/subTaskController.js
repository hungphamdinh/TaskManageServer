"use strict";

const firebase = require("../db");
const SubTask = require("../models/subTask");
const firestore = firebase.firestore();
const SUBTASKS = "subTasks";
const TASKS = "tasks";
const status = {
  active: 1,
  inProgress: 0,
}
const addSubTask = async (req, res, next) => {
  try {
    const id = req.body.parentId;
    const task = await firestore.collection(TASKS).doc(id);
    const tasKData = await task.get();
    if (tasKData.exists) {
      const data = req.body;
      const uid = firestore.collection(SUBTASKS).doc().id
      await firestore.collection(SUBTASKS).doc(uid).set({
        ...data, //name, parentId, timeCreated
        id: uid,
        status: 0,
      });
      res.send("Record saved successfuly");
    } else {
      res.send("Insert Failed");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const getSubTaskByTaskId = async (req, res, next) => {
  try {
    const id = req.query.id;
    console.log(id);
    let array = [];
    const userData = await firestore
      .collection(SUBTASKS)
      .where("parentId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          const subTask = new SubTask(
            doc.data().id,
            doc.data().name,
            doc.data().parentId,
            doc.data().timeCreated,
            doc.data().status,
          );
          array.push(subTask);
          return doc;
        });
        res.send(array);
        return querySnapshot;
      }); // filerBy userId
    if (!userData.exist) {
      res.send("Wrong taskID");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateSubTask = async (req, res, next) => {
  try {
    const id = req.body.id;
    const data = req.body;
    const task = await firestore.collection(SUBTASKS).doc(id);
    await task.update({
      status: status.active,
    });
    res.send({
      id,
      status: status.active,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getSubTaskByTaskId,
  addSubTask,
  updateSubTask
};
