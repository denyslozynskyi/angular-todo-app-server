/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const { Load } = require('../models/Load');
const { Truck } = require('../models/Truck');

const defaultLimit = 10;
const maxLimit = 50;
const defaultOffset = 0;
const loadStates = ['en route to pick up', 'arrived to pick up', 'en route to delivery', 'arrived to delivery'];

async function getLoads(req, res) {
  try {
    const { userId, role } = req.user;
    const { status } = req.query;
    let { limit, offset } = req.query;

    if (!limit) {
      limit = defaultLimit;
    } else if (limit < defaultLimit) {
      limit = defaultLimit;
    } else if (limit > maxLimit) {
      limit = maxLimit;
    }

    if (role === 'shipper') {
      const loads = await Load.find({ created_by: userId });

      if (loads.length === 0) {
        return res.status(400).json({ message: 'No loads found' });
      }

      if (!offset) {
        offset = defaultOffset;
      } else if (offset >= loads.length) {
        offset = defaultOffset;
      }

      const result = loads.slice(offset, limit);

      return res.status(200).json({ loads: result });
    }

    if (role === 'driver') {
      if (status !== 'assigned' && status !== 'shipped') {
        return res.status(400).json({ message: 'Please, specife status field' });
      }

      const loads = await Load.find({
        assigned_to: userId,
        $or: [
          { completed: true },
          { status },
        ],
      });

      if (loads.length === 0) {
        return res.status(400).json({ message: 'No loads found' });
      }

      if (!offset) {
        offset = defaultOffset;
      } else if (offset >= loads.length) {
        offset = defaultOffset;
      }

      const result = loads.slice(offset, limit);

      return res.status(200).json({ loads: result });
    }

    return res.status(400).json({ message: 'Only for driver or shipper role' });
  } catch (e) {
    return console.log(e.message);
  }
}

async function createLoad(req, res) {
  try {
    const { userId, role } = req.user;
    const {
      name, payload, pickup_address, delivery_address, dimensions,
    } = req.body;

    if (role !== 'shipper') {
      return res.status(400).json({ message: 'Only for shippers' });
    }

    if (!name || !payload || !pickup_address || !delivery_address || !dimensions) {
      return res.status(400).json({ message: 'Please, specify load information' });
    }

    const candidate = await Load.findOne({ name });

    if (candidate) {
      return res.status(400).json({ message: 'This load already created' });
    }

    const load = new Load({
      created_by: userId,
      assigned_to: null,
      name,
      payload,
      pickup_address,
      delivery_address,
      dimensions,
    });

    return load.save().then(() => res.status(200).json({ message: 'Load created successfully' }));
  } catch (e) {
    return console.log(e.message);
  }
}

async function getActiveLoad(req, res) {
  try {
    const { userId, role } = req.user;

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    const load = await Load.findOne({ $and: [{ assigned_to: userId }, { status: 'assigned' }] });

    if (!load) {
      return res.status(400).json({ message: 'No load found' });
    }

    return res.status(200).json({ load });
  } catch (e) {
    return console.log(e.message);
  }
}

async function toogleLoadState(req, res) {
  try {
    const { userId, role } = req.user;

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    const load = await Load.findOne({ $and: [{ assigned_to: userId }, { status: 'assigned' }] });

    if (!load) {
      return res.status(400).json({ message: 'No load found' });
    }

    const loadState = load.state;

    if (loadState === 'arrived to delivery') {
      await Load.findByIdAndUpdate({ _id: load._id }, { $set: { status: 'shipped', completed: true } });
      return res.status(400).json({ message: 'Last load state reached' });
    }

    const loadStateIndex = loadStates.indexOf(load.state);

    return Load.findByIdAndUpdate(
      { _id: load._id },
      { $set: { state: loadStates[loadStateIndex + 1] } },
    ).then(() => {
      res.status(200).json({ message: `Load state changed to '${loadStates[loadStateIndex + 1]}'` });
    });
  } catch (e) {
    return console.log(e.message);
  }
}

async function getLoad(req, res) {
  try {
    const { userId, role } = req.user;
    const loadId = req.params.id;

    if (role === 'shipper') {
      const load = await Load.findOne({ $and: [{ created_by: userId }, { _id: loadId }] });

      if (!load) {
        return res.status(400).json({ message: 'No load with this id' });
      }

      return res.status(200).json({ load });
    }

    if (role === 'driver') {
      const load = await Load.findOne({ $and: [{ assigned_to: userId }, { _id: loadId }] });

      if (!load) {
        return res.status(400).json({ message: 'No load with this id' });
      }

      return res.status(200).json({ load });
    }

    return res.status(400).json({ message: 'Only for drivers and shippers' });
  } catch (e) {
    return console.log(e.message);
  }
}

async function updateLoad(req, res) {
  try {
    const { userId, role } = req.user;
    const loadId = req.params.id;

    const {
      name, payload, pickup_address,
      delivery_address, dimensions,
    } = req.body;

    const { width, length, height } = dimensions;

    if (role !== 'shipper') {
      return res.status(400).json({ message: 'Only for shippers' });
    }

    if (!name && !payload && !pickup_address && !delivery_address && !dimensions) {
      return res.status(400).json({ message: 'Please, specify any field' });
    }

    const load = await Load.findOne({ $and: [{ created_by: userId }, { _id: loadId }] });

    if (!load) {
      return res.status(400).json({ message: 'No load with this id' });
    }

    const resultDimensions = {
      width: width || load.dimensions.width,
      length: length || load.dimensions.length,
      height: height || load.dimensions.height,
    };

    return Load.findByIdAndUpdate(
      { _id: load._id },
      {
        $set: {
          name: name || load.name,
          payload: payload || load.payload,
          pickup_address: pickup_address || load.pickup_address,
          delivery_address: delivery_address || load.delivery_address,
          dimensions: resultDimensions,
        },
      },
    )
      .then(() => {
        res.status(200).json({ message: 'Load details changed successfully' });
      });
  } catch (e) {
    return console.log(e.message);
  }
}

async function deleteLoad(req, res) {
  try {
    const { userId, role } = req.user;
    const loadId = req.params.id;

    if (role !== 'shipper') {
      return res.status(400).json({ message: 'Only for shippers' });
    }

    const load = await Load.findOne({ $and: [{ created_by: userId }, { _id: loadId }] });

    if (!load) {
      return res.status(400).json({ message: 'No load with this id' });
    }

    return Load.findByIdAndDelete({ _id: loadId }).then(() => {
      res.status(200).json({ message: 'Load deleted successfully' });
    });
  } catch (e) {
    return console.log(e.message);
  }
}

async function postLoad(req, res) {
  try {
    const { userId, role } = req.user;
    const loadId = req.params.id;

    if (role !== 'shipper') {
      return res.status(400).json({ message: 'Only for shippers' });
    }

    const load = await Load.findOne({ $and: [{ created_by: userId }, { _id: loadId }] });

    if (!load) {
      return res.status(400).json({ message: 'No load with this id' });
    }

    await Load.findByIdAndUpdate({ _id: loadId }, { $set: { status: 'posted' } });

    const { payload, dimensions } = load;
    const { width, length, height } = dimensions;

    const candidate = await Truck.findOne({ status: 'IS' });

    if (!candidate) {
      return res.status(400).json({ message: 'Truck not found' });
    }

    const { payload: truckPayload, dimensions: truckDimensions } = candidate;
    const { width: truckWidth, length: truckLength, height: truckHeight } = truckDimensions;

    if (truckPayload < payload
      || truckWidth < width
      || truckLength < length
      || truckHeight < height) {
      await Load.findByIdAndUpdate({ _id: loadId }, { $set: { status: 'new' } });

      return res.status(400).json({ message: 'Truck not found' });
    }

    const truck = candidate;

    await Truck.findByIdAndUpdate({ _id: truck._id }, { $set: { status: 'OL' } });
    await Load.findByIdAndUpdate(
      { _id: loadId },
      {
        $set: {
          status: 'assigned',
          state: loadStates[0],
          assigned_to: truck.assigned_to,
        },
      },
    );

    return res.status(200).json({
      message: 'Load posted successfully',
      driver_found: true,
    });
  } catch (e) {
    return console.log(e.message);
  }
}

async function getShippingInfo(req, res) {
  try {
    const { userId, role } = req.user;
    const loadId = req.params.id;

    if (role !== 'shipper') {
      return res.status(400).json({ message: 'Only for shippers' });
    }

    const load = await Load.findOne({ $and: [{ created_by: userId }, { _id: loadId }, { status: 'assigned' }] });

    if (!load) {
      return res.status(400).json({ message: 'No load with this id' });
    }

    return res.status(200).json({ load });
  } catch (e) {
    return console.log(e.message);
  }
}

module.exports = {
  getLoads,
  createLoad,
  getActiveLoad,
  toogleLoadState,
  getLoad,
  updateLoad,
  deleteLoad,
  postLoad,
  getShippingInfo,
};
