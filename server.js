const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const stations = [
    {
        id: 1,
        name: "Sahyadri EV Charging Station",
        location: "Mangalore",
        chargerType: "Fast Charger",
        status: "Available"
    },
    {
        id: 2,
        name: "City EV Charge Point",
        location: "Mangalore",
        chargerType: "DC Charger",
        status: "Available"
    },
    {
        id: 3,
        name: "Highway EV Station",
        location: "Mangalore",
        chargerType: "Fast Charger",
        status: "Occupied"
    }
];

let bookings = [];

app.get("/", (req, res) => {
    res.json({
        message: "EVCharge India API is running!"
    });
});

app.get("/stations", (req, res) => {
    res.json(stations);
});

app.post("/bookings", (req, res) => {

    console.log("BOOKING RECEIVED:", req.body);

    const { stationId, name, vehicle } = req.body;

    if (!stationId || !name || !vehicle) {
        return res.status(400).json({
            message: "Missing booking information"
        });
    }

    const station = stations.find(
        s => s.id === Number(stationId)
    );

    if (!station) {
        return res.status(404).json({
            message: "Station not found"
        });
    }

    if (station.status !== "Available") {
        return res.status(400).json({
            message: "Station is currently occupied"
        });
    }

    const booking = {
        id: bookings.length + 1,
        stationId: station.id,
        stationName: station.name,
        location: station.location,
        chargerType: station.chargerType,
        name: name,
        vehicle: vehicle,
        status: "Confirmed"
    };

    bookings.push(booking);

    console.log("BOOKING SAVED:", booking);

    res.json({
        message: "Booking Confirmed",
        booking: booking
    });
});

app.get("/bookings", (req, res) => {
    res.json(bookings);
});

app.listen(PORT, () => {
    console.log(
        `EVCharge India API running on http://localhost:${PORT}`
    );
});