"use strict";

const firebase = require("../db");
const Invitation = require("../models/invitation");
const Member = require("../models/member");

const firestore = firebase.firestore();
const INVITATION = "invitations";
const USER = "users";
const MEMBER = "members";
const TASK = "tasks";
const status = {
  pending: 0,
  accepted: 1,
  rejected: 2,
};
const sendInvitation = async (req, res, next) => {
  try {
    const data = req.body;
    const batch = firestore.batch();
    data.forEach((doc) => {
      console.log(doc);
      var docRef = firestore.collection(INVITATION).doc();
      batch.set(docRef, {
        ...doc,
        id: docRef.id,
        status: status.pending, //pending
        content: `You have one invitation from ${doc.userName}`,
      });
    });
    batch.commit();
    // await firestore
    //   .collection(INVITATION)
    //   .doc(uid)
    //   .set({
    //     ...data,
    //     id: uid,
    //     status: 0,
    //   });
    res.send({
      status: 200,
      message: "Record save successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: 200,
      message: error.message,
    });
  }
};

const getInvitationsByUserId = async (req, res, next) => {
  try {
    const userType = {
      receiver: 0,
      sender: 1,
    };
    let array = [];
    let sender = [];
    const id = req.query.id;
    const type = req.query.type;
    if (type == userType.receiver) {
      //0: Receiver; 1: Sender
      const invitation = await firestore
        .collection(INVITATION)
        .where("receiverId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.data().status);
            if (doc.data().status == status.pending) {
              //Status pending
              array.push({
                ...doc.data(),
                type: "Receiver",
              });
            }
            return doc;
          });
          return querySnapshot;
        });
      res.send({
        status: 200,
        message: "Success",
        type: "Receiver",
        data: array,
      });
      if (!invitation.exists) {
        res.send({
          status: 400,
          message: "Failure",
          data: [],
        });
      }
    } else if (type == userType.sender) {
      const invitation = await firestore
        .collection(INVITATION)
        .where("userId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            array.push({
              ...doc.data(),
              type: "Sender",
            });
            return doc;
          });
          return querySnapshot;
        });
      res.send({
        status: 200,
        message: "Success",
        type: "Sender",
        data: array,
      });
      if (!invitation.exists) {
        res.send({
          status: 400,
          message: "Failure",
          data: [],
        });
      }
    } else {
      res.send({
        status: 400,
        message: "Cannot find type",
        data: [],
      });
    }
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: error.message,
      data: [],
    });
  }
};

const acceptInvitation = async (req, res, next) => {
  try {
    const id = req.body.id;
    const taskId = req.body.taskId;
    const userId = req.body.userId;
    // const invitation = await firestore
    //   .collection(INVITATION)
    //   .where("receiverId", "==", userId)
    //   .get();
    let haveData = false;
    await firestore
      .collection(INVITATION)
      .where("receiverId", "==", userId)
      .get()
      .then(async (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            haveData = true;
          } else {
            haveData = false;
          }
          return doc;
        });

        return querySnapshot;
      });
    // Update Invitation
    if (haveData) {
      console.log(id);
      const statusData = await firestore.collection(INVITATION).doc(id);
      await statusData.update({
        status: status.accepted,
      });
      //Get ParentId from Invitation
      const invitationData = await statusData.get();
      //ADd new member
      const user = await firestore.collection(USER).doc(userId);
      const userData = await user.get();
      const member = new Member(
        userId,
        userData.data().googleUserId,
        userData.data().name,
        userData.data().mail,
        userData.data().role,
        userData.data().profile,
        invitationData.data().userId //parentId
      );
      await firestore.collection(MEMBER).doc(userId).set({
        memberId: member.memberId,
        googleUserId: member.googleUserId,
        name: member.name,
        mail: member.mail,
        role: member.role,
        profile: member.profile,
        userId: member.userId,
      });
      const task = await firestore.collection(TASK).doc(taskId).get();
      await firestore
        .collection(TASK)
        .doc(taskId)
        .update({
          members: task.data().members.concat({
            memberId: member.memberId,
            googleUserId: member.googleUserId,
            name: member.name,
            mail: member.mail,
            role: member.role,
            profile: member.profile,
            userId: member.userId,
          }),
        });
      res.send({
        status: 200,
        message: "Success",
      });
    } else {
      res.send({
        status: 400,
        message: "Cannot find userId",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteInvitation = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const id = req.query.id;
    const invitation = await firestore
      .collection(INVITATION)
      .where("userId", "==", userId);
    if (invitation.exists) {
      await firestore.collection(USERS).doc(id).delete();
      res.send({
        status: 200,
        message: "Success",
      });
    } else {
      res.send({
        status: 400,
        message: "Cannot find userId",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  sendInvitation,
  getInvitationsByUserId,
  acceptInvitation,
  deleteInvitation,
};
