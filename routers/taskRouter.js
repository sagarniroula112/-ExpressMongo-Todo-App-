const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createSingleTask,
  getSingleTask,
  updateTask,
  deleteTask,
} = require("./../controllers/taskController");

router.route("/").get(getAllTasks).post(createSingleTask);
router.route("/:id").get(getSingleTask).patch(updateTask).delete(deleteTask);

module.exports = router;
