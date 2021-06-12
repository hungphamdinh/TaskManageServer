"use strict";

const firebase = require("../db");
const Invitation = require("../models/invitation");

const firestore = firebase.firestore();
const INVITATION = "invitations";

const sendInvitation = async (req, res, next) => {
  try {
    const data = req.body;
    const uid = firestore.collection(INVITATION).doc().id;
    await firestore
      .collection(INVITATION)
      .doc(uid)
      .set({
        ...data,
        id: uid,
        status: 0,
      });
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
    const id = req.params.id;
    const type = req.params.type;
    if (type === 0) { //0: Receiver; 1: Sender
      const invitation = await firestore
        .collection(INVITATION)
        .where("receiverId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if ((doc.data().status = 0)) {
              //Status pending
              array.push(doc.data());
            }
            return doc;
          });
          res.send(array);
          return querySnapshot;
        });
      if (!invitation.exists) {
        res.send({
          status: 400,
          message: "Failure",
          data: [],
        });
      }
    } else if (type === 1) {
      const invitation = await firestore
        .collection(INVITATION)
        .where("userId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            array.push(doc.data());
            return doc;
          });
          res.send(array);
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
      const status = await firestore.collection(INVITATION).doc(id);
      await status.update({
        status: 1,
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
