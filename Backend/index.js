const bookingSchema = new mongoose.Schema({
    patientName: String,
    patientAge: Number,
    doctorId: String,
    slot: String,
    status: String
});

const Booking = mongoose.model("Booking", bookingSchema);
app.get("/booking/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking)
            return res.status(404).json({ message: "Booking not found" });

        res.json(booking);

    } catch (err) {
        res.status(500).json({ message: "Error fetching booking" });
    }
});
app.post("/book", async (req, res) => {
    const booking = await Booking.create({
        ...req.body,
        status: "Confirmed"
    });

    res.json(booking);
})
.then(data => {
    window.location = `status.html?id=${data._id}`;
});
const params = new URLSearchParams(window.location.search);
const bookingId = params.get("id");

async function loadStatus() {
    try {
        const response = await fetch(
            `http://localhost:8080/booking/${bookingId}`
        );

        if (!response.ok) throw new Error();

        const booking = await response.json();

        document.getElementById("statusCard").innerHTML = `
            <h3>${booking.patientName}</h3>
            <p>Doctor ID: ${booking.doctorId}</p>
            <p>Time: ${booking.slot}</p>
            <p>Status: ${booking.status}</p>
        `;

    } catch {
        document.getElementById("statusCard").innerText =
            "Unable to fetch booking status.";
    }
}

loadStatus();