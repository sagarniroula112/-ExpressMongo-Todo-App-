const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const router = require("./routers/taskRouter");
const connectDB = require("./db/connect");
const taskSchema = require("./models/taskSchema");
require("dotenv").config();

app.use(express.json());
app.use("/api/v1/tasks", router);
const port = 3000;

async function getTasks() {
  const tasks = await taskSchema.find({});
  // console.log(tasks);
  return tasks;
}

app.get("/", (req, res) => {
  getTasks().then(function (tasks) {
    if (tasks.length === 0) {
      res.render("notask");
    }
    res.render("index", { taskList: tasks });
  });
});

app.post("/", (req, res) => {
  // console.log(req.body.taskName);
  let newTask = new taskSchema({
    taskName: req.body.taskName,
    completed: false,
  });
  newTask.save();
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  // const tasks = taskSchema.find({});
  // console.log(req.params);
  // const taskID = req.body.taskID.toString().trim();
  // console.log(taskID);
  // taskSchema.deleteOne({ id: taskID });
  // res.redirect("/");
  const taskID = req.body.taskID; // Assuming your form sends the task ID as 'taskId'
  // console.log(taskID);
  try {
    const deletedTask = await taskSchema.findByIdAndDelete(taskID);
    if (deletedTask) {
      // console.log("Task deleted successfully:", deletedTask);
      res.redirect("/");
    } else {
      console.log("Task not found with the provided ID");
      res.status(404).send("Task not found with the provided ID");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Error deleting task");
  }
});

app.post("/edit", async (req, res) => {
  const taskID = req.body.taskID; // Assuming your form sends the task ID as 'taskId'
  const updatedName = req.body.updatedName; // Assuming your form sends the updated name as 'updatedName'
  // console.log(updatedName);
  try {
    const updatedTask = await taskSchema.findByIdAndUpdate(
      taskID,
      { taskName: updatedName },
      { completed: true }
    );
    if (updatedTask) {
      console.log("Task updated successfully:");
      res.redirect("/");
    } else {
      console.log("Task not found with the provided ID");
      res.status(404).send("Task not found with the provided ID");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Error updating task");
  }
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, (req, res) => {
      console.log(`Server is listening.... `);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
