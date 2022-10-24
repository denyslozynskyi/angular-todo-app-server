const { Task } = require('../models/Task');

const taskStatuses = ['to do', 'in progress', 'done', 'archived'];

async function getTasks(req, res) {
  try {
    const { userId } = req.user;
    const dashboardId = req.params.id;

    const tasks = await Task.find({ $and: [{ created_by: userId, board: dashboardId }] });

    const result = {
      toDo: tasks.filter((task) => task.status === 'to do'),
      inProgress: tasks.filter((task) => task.status === 'in progress'),
      done: tasks.filter((task) => task.status === 'done'),
      archived: tasks.filter((task) => task.status === 'archived'),
    };

    return res.json({ result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function editTask(req, res) {
  try {
    const taskId = req.params.id;
    const { name, status } = req.body;
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      throw (new Error('No dashboard with this id!'));
    }

    if (!name || !status) {
      throw (new Error('Please, specify request body parameters!'));
    }

    if (!taskStatuses.includes(status)) {
      throw (new Error('Wrong task status!'));
    }

    return Task.findByIdAndUpdate({ _id: taskId }, { $set: { name, status } })
      .then(() => {
        res.json({ message: 'Updated succesfully' });
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

function createTask(req, res) {
  try {
    const { name, dashboardId, status } = req.body;
    const { userId } = req.user;

    if (!name || !dashboardId || !status) {
      throw (new Error('Please, specify request body parameters!'));
    }

    if (!taskStatuses.includes(status)) {
      throw (new Error('Wrong task status!'));
    }

    const task = new Task({
      name,
      status,
      board: dashboardId,
      created_by: userId,
    });

    return task.save().then(() => res.status(200).json({ message: 'Task created succesfully!' }));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      throw (new Error('No task with this id!'));
    }

    return Task.findByIdAndDelete({ _id: taskId })
      .then(() => {
        res.json({ message: 'Deleted succesfully' });
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  getTasks,
  editTask,
  createTask,
  deleteTask,
};
