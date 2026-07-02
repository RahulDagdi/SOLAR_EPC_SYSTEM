// const City = require("../../models/masters/City");

// const base = require("./baseMaster.controller");

// exports.getCities = base.getAll(City);

// exports.getCity = base.getById(City);

// exports.createCity = base.create(City);

// exports.updateCity = base.update(City);

// exports.deleteCity = base.remove(City);

const City = require("../../models/masters/City");
const base = require("./baseMaster.controller");

// Get All Cities
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find()
      .populate("country", "name")
      .populate("state", "name")
      .sort({ name: 1 });

    res.json({
      success: true,
      count: cities.length,
      data: cities
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getCity = base.getById(City);
exports.createCity = base.create(City);
exports.updateCity = base.update(City);
exports.deleteCity = base.remove(City);