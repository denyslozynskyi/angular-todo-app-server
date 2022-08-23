/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const { Truck } = require('../models/Truck');

const types = ['sprinter', 'small_straight', 'large_straight'];

const dimensions = {
  sprinter: {
    width: 250,
    length: 300,
    height: 170,
  },
  small_straight: {
    width: 250,
    length: 500,
    height: 170,
  },
  large_straight: {
    width: 350,
    length: 700,
    height: 200,
  },
};

const payloads = {
  sprinter: 1700,
  small_straight: 2500,
  large_straight: 4000,
};

async function getTrucks(req, res) {
  try {
    const { userId, role } = req.user;
    const trucks = await Truck.find({ created_by: userId });

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    if (!trucks) {
      return res.status(400).json({ message: 'No trucks found' });
    }

    const result = trucks.map((truck) => {
      const {
        _id, created_by, assigned_to, type, status, createdDate,
      } = truck;

      return {
        _id,
        created_by,
        assigned_to,
        type,
        status,
        created_date: createdDate,
      };
    });

    return res.status(200).json({ trucks: result });
  } catch (e) {
    return console.log(e.message);
  }
}

function createTruck(req, res) {
  try {
    const { type } = req.body;
    const { role, userId } = req.user;

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    if (!types.includes(type)) {
      return res.status(400).json({ message: `Can not create truck with type ${type}` });
    }

    const truck = new Truck({
      created_by: userId,
      assigned_to: null,
      type,
      dimensions: dimensions[type],
      payload: payloads[type],
    });

    return truck.save().then(() => res.status(200).json({ message: 'Truck created successfully' }));
  } catch (e) {
    return console.log(e.message);
  }
}

async function getTruck(req, res) {
  try {
    const truckId = req.params.id;
    const { userId, role } = req.user;
    const truck = await Truck.findOne({ _id: truckId, created_by: userId });

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    if (!truck) {
      return res.status(400).json({ message: 'No trucks with this id' });
    }

    const result = {
      _id: truck._id,
      created_by: truck.created_by,
      assigned_to: truck.assigned_to,
      type: truck.type,
      status: truck.status,
      created_date: truck.createdDate,
    };

    return res.status(200).json({ truck: result });
  } catch (e) {
    return console.log(e.message);
  }
}

async function updateTruck(req, res) {
  try {
    const truckId = req.params.id;
    const { type } = req.body;
    const { userId, role } = req.user;
    const truck = await Truck.findOne({ _id: truckId, created_by: userId });
    const newDimensions = dimensions[type];
    const newPayload = payloads[type];

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    if (!truck) {
      return res.status(400).json({ message: 'No trucks with this id' });
    }

    if (type === truck.type) {
      return res.status(400).json({ message: `Truck already has ${type} type` });
    }

    if (!types.includes(type)) {
      return res.status(400).json({ message: `Can not update truck to type ${type}` });
    }

    return Truck.findByIdAndUpdate(
      { _id: truckId },
      { $set: { type, dimensions: newDimensions, payload: newPayload } },
    )
      .then(() => res.status(200).json({ message: 'Truck details changed successfully' }));
  } catch (e) {
    return console.log(e.message);
  }
}

async function deleteTruck(req, res) {
  try {
    const truckId = req.params.id;
    const { userId, role } = req.user;
    const truck = await Truck.findOne({ _id: truckId, created_by: userId });

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    if (!truck) {
      return res.status(400).json({ message: 'No trucks with this id' });
    }

    return Truck.findByIdAndDelete({ _id: truckId })
      .then(() => res.status(200).json({ message: 'Truck deleted successfully' }));
  } catch (e) {
    return console.log(e.message);
  }
}

async function assignTruck(req, res) {
  try {
    const truckId = req.params.id;
    const { userId, role } = req.user;
    const truck = await Truck.findOne({ _id: truckId, created_by: userId });

    if (role !== 'driver') {
      return res.status(400).json({ message: 'Only for drivers' });
    }

    if (!truck) {
      return res.status(400).json({ message: 'No trucks with this id' });
    }

    if (truck.assigned_to) {
      return res.status(400).json({ message: 'Truck already assigned' });
    }

    return Truck.findByIdAndUpdate({ _id: truckId }, { $set: { assigned_to: userId } })
      .then(() => res.status(200).json({ message: 'Truck assigned successfully' }));
  } catch (e) {
    return console.log(e.message);
  }
}

module.exports = {
  getTrucks,
  createTruck,
  getTruck,
  updateTruck,
  deleteTruck,
  assignTruck,
};
