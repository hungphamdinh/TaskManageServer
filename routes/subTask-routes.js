const express = require("express");
const {
  addSubTask,
  getSubTaskByTaskId,
  updateSubTask,
} = require("../controllers/subTaskController");

const router = express.Router();

router.post('/subTask', addSubTask);
router.get("/subTask/getSubTaskById", getSubTaskByTaskId);
router.put('/subTask/doneTask', updateSubTask);

module.exports = {
  routes: router,
};
