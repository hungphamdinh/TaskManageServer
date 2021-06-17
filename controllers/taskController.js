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
const moment = require("moment");
const USERS = "users";
const status = {
  urgent: 0,
  running: 1,
  onGoing: 2,
  done: 3,
};
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
          timeCreated: moment(new Date()).format(),
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
          doc.data().currentTime
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
    let data = {};
    const userData = await firestore
      .collection(TASKS)
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data = doc.data();
          return doc;
        });
        return querySnapshot;
      });
    const admin = await firestore.collection(USERS).doc(data.userId).get();
    const adminData = admin.data();
    task = new TaskDetail(
      data.id,
      data.name,
      data.userId,
      data.status,
      data.timeCreated,
      data.timeStart,
      data.timeEnd,
      data.members.concat({
        profile: adminData.profile,
        userId: admin.id,
        role: adminData.role,
        googleUserId: adminData.googleUserId,
        mail: adminData.mail,
        name: adminData.name,
        memberId: admin.id,
        isActive: true,
      }), // add admin
      data.description,
      userId === data.userId ? true : false, //isAdmin
      data.date,
      {
        name: admin.data().name,
        email: admin.data().mail,
      }
    );
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
    const filterType = {
      urgent: 0,
      running: 1,
      onGoing: 2,
      doneTask: 3,
      timeCreated: 4,
      date: 5,
    };
    const id = req.query.id;
    const type = parseInt(req.query.type);
    let array = [];
    let response = [];
    //filter by userId
    const userData = await firestore
      .collection(TASKS)
      .where("userId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const task = getTask(doc.data());
          array.push(task);
          return doc;
        });
        return querySnapshot;
      }); // filerBy (parentId)
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
              //filter By Member id
              if (item.memberId === id) {
                const task = getTask(doc.data());
                array.push(task);
              }
            });
            return doc;
          });
          return querySnapshot;
        });
    }
    //Filter by timeCreated
    if (type === filterType.timeCreated || (!type && type !== 0)) {
      response = array
        .sort(function (a, b) {
          return (
            new Date(b.timeCreated).getTime() -
            new Date(a.timeCreated).getTime()
          );
        })
        .filter((item) => item.status !== status.done);
    }
    // filter by date close deadline
    else if (type == filterType.date) {
      response = array
        .sort((a) => new Date(a.date).getTime() - new Date().getTime())
        .filter((item) => item.status !== status.done);
    } else if (type === filterType.doneTask) {
      response = array.filter((item) => item.status === status.done);
    } else if (type === filterType.onGoing) {
      response = array.filter((item) => item.status === status.onGoing);
    } else if (type === filterType.running) {
      response = array.filter((item) => item.status === status.running);
    } else {
      response = array.filter((item) => item.status === status.urgent);
    }
    res.send({
      message: "Success",
      status: 200,
      data: response,
    });
    if (!userData.exist) {
      res.send("Wrong userId");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTask = (data) => {
  return new Task(
    data.id,
    data.name,
    data.userId,
    data.status,
    data.timeCreated,
    data.timeStart,
    data.timeEnd,
    data.members,
    data.description,
    data.date
  );
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

const leaveTask = async (req, res, next) => {
  try {
    const taskId = req.body.taskId;
    const userId = req.body.userId;
    const task = await firestore.collection(TASKS).doc(taskId);
    const tasKData = await task.get();
    const data = tasKData.data();
    const newTask = new TaskDetail(
      data.id,
      data.name,
      data.userId,
      data.status,
      data.timeCreated,
      data.timeStart,
      data.timeEnd,
      data.members.filter((item) => item.memberId != userId),
      data.description,
      data.isAdmin,
      data.date,
      data.admin
    );
    await task.set(JSON.parse(JSON.stringify(newTask)));
    res.send({
      status: 200,
      message: "Leave task success",
    });
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
  leaveTask,
};
