const API_URL = "http://localhost:5000";

const stationsContainer = document.getElementById("stations");
const searchInput = document.getElementById("searchInput");
const allBtn = document.getElementById("allBtn");
const availableBtn = document.getElementById("availableBtn");
const occupiedBtn = document.getElementById("occupiedBtn");
const viewBookingsButton = document.getElementById("viewBookingsBtn");

let allStations = [];


// ===============================
// LOAD STATIONS
// ===============================

async function loadStations() {
    try {
        const response = await fetch(`${API_URL}/stations`);

        if (!response.ok) {
            throw new Error("Failed to load stations");
        }

        allStations = await response.json();

        displayStations(allStations);

    } catch (error) {
        console.error(error);

        stationsContainer.innerHTML = `
            <p style="color:red;">
                Cannot connect to backend.
            </p>
        `;
    }
}


// ===============================
// DISPLAY STATIONS
// ===============================

function displayStations(stations) {

    if (stations.length === 0) {
        stationsContainer.innerHTML =
            "<p>No charging stations found.</p>";
        return;
    }

    stationsContainer.innerHTML = "";

    stations.forEach(station => {

        const stationCard = document.createElement("div");

        stationCard.className = "station-card";

        stationCard.innerHTML = `
            <h3>${station.name}</h3>

            <p>
                <strong>Location:</strong>
                ${station.location}
            </p>

            <p>
                <strong>Charger Type:</strong>
                ${station.chargerType}
            </p>

            <p>
                <strong>Status:</strong>
                <strong>${station.status}</strong>
            </p>

            ${
                station.status === "Available"
                ?
                `<button onclick="bookStation(${station.id})">
                    Book Now
                </button>`
                :
                `<button disabled>
                    Occupied
                </button>`
            }
        `;

        stationsContainer.appendChild(stationCard);
    });
}


// ===============================
// SEARCH
// ===============================

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText =
            searchInput.value.toLowerCase();

        const filteredStations = allStations.filter(station =>

            station.name.toLowerCase().includes(searchText) ||

            station.location.toLowerCase().includes(searchText) ||

            station.chargerType.toLowerCase().includes(searchText)

        );

        displayStations(filteredStations);
    });
}


// ===============================
// ALL STATIONS
// ===============================

if (allBtn) {

    allBtn.addEventListener("click", function () {

        displayStations(allStations);

    });
}


// ===============================
// AVAILABLE STATIONS
// ===============================

if (availableBtn) {

    availableBtn.addEventListener("click", function () {

        const availableStations =
            allStations.filter(
                station => station.status === "Available"
            );

        displayStations(availableStations);

    });
}


// ===============================
// OCCUPIED STATIONS
// ===============================

if (occupiedBtn) {

    occupiedBtn.addEventListener("click", function () {

        const occupiedStations =
            allStations.filter(
                station => station.status === "Occupied"
            );

        displayStations(occupiedStations);

    });
}


// ===============================
// BOOK STATION
// ===============================

async function bookStation(stationId) {

    const name = prompt("Enter your name:");

    if (!name) {
        return;
    }

    const date =
        prompt("Enter booking date (YYYY-MM-DD):");

    if (!date) {
        return;
    }

    const time =
        prompt("Enter booking time (HH:MM):");

    if (!time) {
        return;
    }

    try {

        const response =
            await fetch(`${API_URL}/bookings`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    stationId: stationId,

                    userName: name,

                    date: date,

                    time: time
                })
            });

        const data = await response.json();

        if (response.ok) {

            alert(
                "✅ Booking Confirmed!\n\n" +
                "Station: " +
                data.booking.stationName +
                "\nName: " +
                data.booking.userName +
                "\nDate: " +
                data.booking.date +
                "\nTime: " +
                data.booking.time
            );

        } else {

            alert(
                data.message ||
                "Booking failed."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to backend."
        );
    }
}


// ===============================
// VIEW MY BOOKINGS
// ===============================

async function viewBookings() {

    try {

        const response =
            await fetch(`${API_URL}/bookings`);

        if (!response.ok) {

            throw new Error(
                "Failed to load bookings"
            );
        }

        const bookings =
            await response.json();


        // Get/create bookings area
        let bookingsContainer =
            document.getElementById("bookingsContainer");


        if (!bookingsContainer) {

            bookingsContainer =
                document.createElement("div");

            bookingsContainer.id =
                "bookingsContainer";

            bookingsContainer.style.marginTop =
                "20px";

            bookingsContainer.style.maxHeight =
                "500px";

            bookingsContainer.style.overflowY =
                "auto";

            bookingsContainer.style.padding =
                "10px";

            bookingsContainer.style.borderRadius =
                "10px";


            viewBookingsButton
                .parentNode
                .appendChild(bookingsContainer);
        }


        // Clear old bookings
        bookingsContainer.innerHTML = "";


        // No bookings
        if (bookings.length === 0) {

            bookingsContainer.innerHTML = `
                <p>
                    📋 No bookings found.
                </p>
            `;

            return;
        }


        // Title
        const title =
            document.createElement("h3");

        title.textContent =
            "📋 My Bookings";

        bookingsContainer.appendChild(title);


        // Display every booking
        bookings.forEach((booking, index) => {

            const bookingCard =
                document.createElement("div");

            bookingCard.className =
                "booking-card";


            bookingCard.style.padding =
                "15px";

            bookingCard.style.marginBottom =
                "12px";

            bookingCard.style.border =
                "1px solid #ccc";

            bookingCard.style.borderRadius =
                "10px";

            bookingCard.style.background =
                "#f8f8f8";


            bookingCard.innerHTML = `

                <h4>
                    Booking ${index + 1}
                </h4>

                <p>
                    <strong>Station:</strong>
                    ${booking.stationName}
                </p>

                <p>
                    <strong>Name:</strong>
                    ${booking.userName}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${booking.date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${booking.time}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${booking.status}
                </p>

            `;


            bookingsContainer.appendChild(
                bookingCard
            );

        });


        // Scroll to bookings
        bookingsContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to backend."
        );
    }
}


// ===============================
// VIEW BOOKINGS BUTTON
// ===============================

if (viewBookingsButton) {

    viewBookingsButton.addEventListener(
        "click",
        viewBookings
    );
}


// ===============================
// START WEBSITE
// ===============================

loadStations();