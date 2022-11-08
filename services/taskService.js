const { Task } = require('../models/Task');

const taskStatuses = ['to do', 'in progress', 'done', 'archived'];

async function getTasks(req, res) {
  try {
    const { userId } = req.user;
    const dashboardId = req.params.id;

    if (!userId || !dashboardId) {
      throw (new Error('Please, provide request params'));
    }

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

async function getTask(req, res) {
  try {
    const { userId } = req.user;
    const taskId = req.params.id;

    if (!taskId) {
      throw (new Error('Please, add task id to request params'));
    }

    const task = await Task.findOne({ $and: [{ created_by: userId, _id: taskId }] });
    return res.json(task);
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
      throw (new Error('No task with this id!'));
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

async function addComment(req, res) {
  try {
    const taskId = req.params.id;
    const { comment } = req.body;
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      throw (new Error('No task with this id!'));
    }

    if (!comment) {
      throw (new Error('Please, specify request body parameters!'));
    }

    task.comments.push(comment);

    return task.save()
      .then(() => {
        res.json({ task });
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function deleteComment(req, res) {
  try {
    const { id, index } = req.params;
    const task = await Task.findOne({ _id: id });

    if (!task) {
      throw (new Error('No task with this id!'));
    }

    if (!task.comments.length) {
      throw (new Error('No comments in this task!'));
    }

    if (!index) {
      throw (new Error('Please, specify request parameters!'));
    }

    if (index > task.comments.length - 1) {
      throw (new Error('No comment with this index'));
    }

    task.comments.splice(index, 1);

    return task.save()
      .then(() => {
        res.json({ task });
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function createTask(req, res) {
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

    await task.save();
    const tasks = await Task.find({ $and: [{ created_by: userId, board: dashboardId }] });

    const result = {
      toDo: tasks.filter((item) => item.status === 'to do'),
      inProgress: tasks.filter((item) => item.status === 'in progress'),
      done: tasks.filter((item) => item.status === 'done'),
      archived: tasks.filter((item) => item.status === 'archived'),
    };

    return res.json({ message: 'Task created succesfully!', result });
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
  getTask,
  editTask,
  addComment,
  deleteComment,
  createTask,
  deleteTask,
};
