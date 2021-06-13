"use strict";

const firebase = require("../db");
const Invitation = require("../models/invitation");

const firestore = firebase.firestore();
const INVITATION = "invitations";
const status = {
  pending: 0,
  accepted: 1,
}
const sendInvitation = async (req, res, next) => {
  try {
    const data = req.body;
    const batch = firestore.batch();
    data.forEach((doc) => {
      console.log(doc);
      var docRef = firestore.collection(INVITATION).doc();
      var uid = firestore.collection(INVITATION).doc().id;
      batch.set(docRef, {
        ...doc,
        id: uid,
        status: status.pending, //pending
        content: `You have one invitation from ${doc.userName}`
      });
    })
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
    let array = [];
    const id = req.query.id;
    const type = req.query.type;
    if (type == 0) { //0: Receiver; 1: Sender
      const invitation = await firestore
        .collection(INVITATION)
        .where("receiverId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if ((doc.data().status = status.pending)) {
              //Status pending
              array.push(doc.data());
            }
            return doc;
          });
          res.send({
            status: 200,
            message: "Success",
            type: 'Receiver',
            data: array
          });
          return querySnapshot;
        });
      if (!invitation.exists) {
        res.send({
          status: 400,
          message: "Failure",
          data: [],
        });
      }
    } else if (type == 1) {
      const invitation = await firestore
        .collection(INVITATION)
        .where("userId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            array.push(doc.data());
            return doc;
          });
          res.send({
            status: 200,
            message: "Success",
            type: 'Sender',
            data: array
          });
          return querySnapshot;
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
    const userId = req.body.userId;
    const invitation = await firestore
      .collection(INVITATION)
      .where("receiverId", "==", userId);
    if (invitation.exists) {
      const statusData = await firestore.collection(INVITATION).doc(id);
      await statusData.update({
        status: status.accepted,
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
    const userId = req.params.userId;
    const id = req.params.id;
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
