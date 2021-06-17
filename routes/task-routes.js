const express = require("express");
const {
  addTask,
  getAllTask,
  getTasksByUserId,
  updateTask,
  deleteTask,
  getDetailTaskById,
  leaveTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/task", addTask);
router.get("/tasks", getAllTask);
router.get("/tasks/getTasksById", getTasksByUserId);
router.get("/task/getDetail", getDetailTaskById);
router.post("/task/leaveTask", leaveTask);
router.put("/task/update", updateTask);
router.delete("/task/:id", deleteTask);

module.exports = {
  routes: router,
};
