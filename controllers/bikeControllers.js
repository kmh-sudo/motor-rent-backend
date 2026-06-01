import Bike from "../models/Bike.js";

export async function createBike(req, res) {
  try {
    const { name, plate, monthlyRate, status } = req.body;
    const bike = new Bike({
      name,
      plate,
      monthlyRate,
      status,
    });
    await bike.save();
    return res.status(201).json(bike);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function getRentalReport(req, res) {
  try {
    const availableBikes = await Bike.find({status: 'available'});
    const rentedBikes = await Bike.find({status: 'rented'});

    return res.status(200).json({
        success: true,
        summery: {
            totalBikes: availableBikes.length + rentedBikes.length,
             availableBikes: availableBikes.length,
             rentedBikes: rentedBikes.length,
        },
        availableBikesList: availableBikes,
        rentedBikesList: rentedBikes,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getAllBikes(req, res) {
    try{
        const bikes = await Bike.find();
        return res.status(200).json({ success: true, data: bikes });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
}

export async function updateBikeStatus(req, res) {
    try{
        const { id } = req.params;
        const { status } = req.body;
        const updatedBike = await Bike.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if(!updatedBike){
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }
        return res.status(200).json({ success: true, data: updatedBike });
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}

export async function deleteBike(req, res) {
    try{
        const { id } = req.params;
        const deletedBike = await Bike.findByIdAndDelete(id);
        if(!deletedBike){
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }
        return res.status(200).json({ success: true, message: 'Bike deleted successfully' });
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}