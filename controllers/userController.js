"use strict";

const firebase = require("../db");
const User = require("../models/user");
const Member = require("../models/member");

const firestore = firebase.firestore();
const USERS = "users";
const MEMBER = "members";

const login = async (req, res, next) => {
  try {
    const { body } = req;
    const mail = body.mail;
    let array = [];
    await firestore
      .collection(USERS)
      .where("mail", "==", mail)
      .get()
      .then(async (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const user = new User(
            doc.id,
            doc.data().googleUserId,
            doc.data().name,
            doc.data().mail,
            doc.data().role,
            doc.data().profile
          );
          array.push(user);
          return doc;
        });
        if (querySnapshot.empty) {
          await firestore
            .collection(USERS)
            .doc()
            .set({
              name: body.name,
              mail: body.mail,
              role: body.role,
              profile: body.profile ? body.profile : body.name[0],
              googleUserId: body.userId ? body.userId : "",
              members: body.members ? body.members : [],
            });
          res.send({
            message: "Register Success",
          });
        } else {
          res.send(array[0]);
        }

        return array;
      }); // filerBy userId
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const addUser = async (req, res, next) => {
  try {
    const data = req.body;
    await firestore.collection(USERS).doc().set(data);
    res.send("Record saved successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await firestore.collection(USERS);
    const data = await users.get();
    const userArray = [];
    if (data.empty) {
      res.status(404).send("No student record found");
    } else {
      data.forEach((doc) => {
        userArray.push(doc.data());
      });
      res.send(userArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await firestore.collection(USERS).doc(id);
    const data = await user.get();
    if (!data.exists) {
      res.status(404).send("Student with the given ID not found");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await firestore.collection(USERS).doc(id);
    await user.update(data);
    res.send("User record updated successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection(USERS).doc(id).delete();
    res.send("Record deleted successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addNewMember = async (req, res, next) => {
  try {
    const id = req.body.memberId;
    await firestore.collection(MEMBER).doc(id).set(req.body)
    res.send("Record saved successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getMembersByUserID = async (req, res, next) => {
  try {
    const id = req.query.userId;
    console.log(req.query);
    let array = [];
    const userData = await firestore
      .collection(MEMBER)
      .where("userId", "==", id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          array.push(doc.data());
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
module.exports = {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  addNewMember,
  getMembersByUserID,
};
