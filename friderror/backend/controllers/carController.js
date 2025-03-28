const Car = require('../models/Car');

exports.getAllCars = async (req, res, next) => {
  try {
    const { search, make, minYear, maxPrice } = req.query;
    const filters = { make, minYear, maxPrice };
    const cars = await Car.findAll(search, filters);
    res.json(cars);
  } catch (err) {
    next(err);
  }
};

exports.getCarMakes = async (req, res, next) => {
  try {
    const makes = await Car.getMakes();
    res.json(makes);
  } catch (err) {
    next(err);
  }
};

exports.getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    next(err);
  }
};

exports.createCar = async (req, res, next) => {
  try {
    const { make, model, year, color, price } = req.body;
    const carId = await Car.create({ make, model, year, color, price, userId: req.user.id });
    const newCar = await Car.findById(carId);
    res.status(201).json(newCar);
  } catch (err) {
    next(err);
  }
};

exports.updateCar = async (req, res, next) => {
  try {
    const { make, model, year, color, price } = req.body;
    const affectedRows = await Car.update(req.params.id, { make, model, year, color, price });
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    const updatedCar = await Car.findById(req.params.id);
    res.json(updatedCar);
  } catch (err) {
    next(err);
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    const affectedRows = await Car.delete(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};