const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/bookingDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Schema
const bookingSchema = new mongoose.Schema({
    patientName: String,
    patientAge: Number,
    doctorId: String,
    slot: String,
    status: String
});

// Model
const Booking = mongoose.model("Booking", bookingSchema);

// GET booking by ID
app.get("/booking/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);

    } catch (err) {
        res.status(500).json({ message: "Error fetching booking" });
    }
});

// POST create booking
app.post("/book", async (req, res) => {
    try {
        const booking = await Booking.create({
            ...req.body,
            status: "Confirmed"
        });

        res.json(booking);

    } catch (err) {
        res.status(500).json({ message: "Error creating booking" });
    }
});

// Start server
app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});