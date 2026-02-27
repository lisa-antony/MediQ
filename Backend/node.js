
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/hospitalDB");


// Doctor Schema
const DoctorSchema = new mongoose.Schema({
    name: String,
    qualification: String,
    department: String,
    slots: [String]
});

const Doctor = mongoose.model("Doctor", DoctorSchema);


// Appointment Schema
const AppointmentSchema = new mongoose.Schema({
    patientName: String,
    patientAge: Number,
    doctorId: String,
    slot: String
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);



// Get Departments
app.get("/departments", async (req, res) => {
    const departments = await Doctor.distinct("department");
    res.json(departments);
});


// Get Doctors
app.get("/doctors/:dept", async (req, res) => {
    const doctors = await Doctor.find({department: req.params.dept});
    res.json(doctors);
});


// Get Slots
app.get("/slots/:id", async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    res.json(doctor.slots);
});


// Book Appointment
app.post("/book", async (req, res) => {

    const appointment = new Appointment({
        patientName: req.body.patientName,
        patientAge: req.body.patientAge,
        doctorId: req.body.doctorId,
        slot: req.body.slot
    });

    await appointment.save();

    res.json({message: "Appointment Booked"});
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});