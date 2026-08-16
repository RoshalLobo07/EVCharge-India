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
    const { stationId, userName, date, time } = req.body;

    if (!stationId || !userName || !date || !time) {
        return res.status(400).json({
            message: "Please provide stationId, userName, date and time."
        });
    }

    const station = stations.find(
        station => station.id === Number(stationId)
    );

    if (!station) {
        return res.status(404).json({
            message: "Station not found."
        });
    }

    if (station.status === "Occupied") {
        return res.status(400).json({
            message: "This station is currently occupied."
        });
    }

    const booking = {
        id: bookings.length + 1,
        stationId: station.id,
        stationName: station.name,
        userName,
        date,
        time
    };

    bookings.push(booking);

    res.status(201).json({
        message: "Booking Confirmed",
        booking
    });
});

app.get("/bookings", (req, res) => {
    res.json(bookings);
});

app.listen(PORT, () => {
    console.log(`EVCharge India API running on http://localhost:${PORT}`);
});