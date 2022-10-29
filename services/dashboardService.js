const { Dashboard } = require('../models/Dashboard');

async function getDashboards(req, res) {
  try {
    const { userId } = req.user;

    const dashboards = await Dashboard.find({ created_by: userId });

    return res.json({ dashboards });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function editDashboard(req, res) {
  try {
    const dashboardId = req.params.id;
    const { name } = req.body;
    const dashboard = await Dashboard.findOne({ _id: dashboardId });

    if (!dashboard) {
      throw (new Error('No dashboard with this id!'));
    }

    if (!name) {
      throw (new Error('Please, specify request body parameters!'));
    }

    return Dashboard.findByIdAndUpdate({ _id: dashboardId }, { $set: { name } })
      .then(() => {
        res.json({ message: 'Updated succesfully' });
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function createDashboard(req, res) {
  try {
    const { name, description } = req.body;
    const { userId } = req.user;

    if (!name || !description) {
      throw (new Error('Please, specify request body parameters!'));
    }

    const dashboard = new Dashboard({
      name,
      description,
      created_by: userId,
    });

    await dashboard.save();
    const dashboards = Dashboard.find({ created_by: userId });
    return res.status(200).json({ message: 'Dashboard created succesfully!', dashboards });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function deleteDashboard(req, res) {
  try {
    const dashboardId = req.params.id;
    const dashboard = await Dashboard.findOne({ _id: dashboardId });

    if (!dashboard) {
      throw (new Error('No dashboard with this id!'));
    }

    return Dashboard.findByIdAndDelete({ _id: dashboardId })
      .then(() => {
        res.json({ message: 'Deleted succesfully' });
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  getDashboards,
  editDashboard,
  createDashboard,
  deleteDashboard,
};
