import Bike from "../models/Bike.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createBike(req, res) {
  try {
    const { name, brand, plate, price, description, status } = req.body;
    const monthlyRate = req.body.monthlyRate ?? price;

    if (!req.file) {
      return res.status(400).json({ message: "Bike image file is required" });
    }

    if (!name || !plate || monthlyRate === undefined || monthlyRate === "") {
      return res.status(400).json({ message: "Name, plate, and monthlyRate or price are required" });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    let uploadResponse;

    try {
      uploadResponse = await cloudinary.uploader.upload(fileBase64, {
        folder: "bikes",
        resource_type: "image",
      });
    } catch (err) {
      return res.status(500).json({ message: `Cloudinary upload failed: ${err.message}` });
    }

    const bike = new Bike({
      name,
      brand,
      plate,
      monthlyRate,
      description,
      status,
      image: {
        url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      },
    });

    await bike.save();
    return res.status(201).json(bike);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

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
