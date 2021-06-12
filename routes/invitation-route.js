const express = require("express");
const {
  sendInvitation,
  getInvitationsByUserId,
  acceptInvitation,
  deleteInvitation,
} = require("../controllers/invitationController");

const router = express.Router();

router.get("/invitation/getByUserId", getInvitationsByUserId);
router.get("/invitation/accept", acceptInvitation);
router.post("/invitation/send", sendInvitation);
router.delete("/invitation/delete", deleteInvitation);

module.exports = {
  routes: router,
};
