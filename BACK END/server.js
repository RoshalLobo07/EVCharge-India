const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ===============================
// EV CHARGING STATIONS
// ===============================

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


// ===============================
// BOOKINGS
// ===============================

let bookings = [];


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {

    res.json({
        message: "EVCharge India API is running!"
    });

});


// ===============================
// GET ALL STATIONS
// ===============================

app.get("/stations", (req, res) => {

    res.json(stations);

});


// ===============================
// CREATE BOOKING
// ===============================

app.post("/bookings", (req, res) => {

    const {
        stationId,
        userName,
        date,
        time
    } = req.body;


    // Validate input

    if (!stationId || !userName || !date || !time) {

        return res.status(400).json({

            message:
                "Please provide stationId, userName, date and time."

        });

    }


    // Find station

    const station = stations.find(

        station =>
            station.id === Number(stationId)

    );


    // Station not found

    if (!station) {

        return res.status(404).json({

            message: "Station not found."

        });

    }


    // Check availability

    if (station.status === "Occupied") {

        return res.status(400).json({

            message:
                "This station is currently occupied."

        });

    }


    // Create booking

    const booking = {

        id: bookings.length + 1,

        stationId: station.id,

        stationName: station.name,

        userName: userName,

        date: date,

        time: time,

        status: "Confirmed"

    };


    // Save booking

    bookings.push(booking);


    // Send response

    res.status(201).json({

        message: "Booking Confirmed",

        booking: booking

    });

});


// ===============================
// GET ALL BOOKINGS
// ===============================

app.get("/bookings", (req, res) => {

    res.json(bookings);

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `EVCharge India API running on http://localhost:${PORT}`
    );

});
