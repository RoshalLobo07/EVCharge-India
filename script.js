const API = "http://localhost:5000";

let stations = [];

async function loadStations() {

    const response = await fetch(API + "/stations");

    stations = await response.json();

    showStations(stations);
}


function showStations(list) {

    const box = document.getElementById("stations");

    box.innerHTML = "";

    list.forEach(station => {

        const div = document.createElement("div");

        div.className = "station-card";

        div.innerHTML = `
            <h3>${station.name}</h3>

            <p>Location: ${station.location}</p>

            <p>Charger Type: ${station.chargerType}</p>

            <p>Status: ${station.status}</p>

            <button class="details-btn">
                View Details
            </button>

            ${
                station.status === "Available"
                ?
                `<button class="book-btn">
                    Book Charger
                 </button>`
                :
                `<button disabled>
                    Currently Occupied
                 </button>`
            }
        `;


        div.querySelector(".details-btn")
            .addEventListener("click", () => {

                alert(
                    "Station ID: " + station.id +
                    "\nLocation: " + station.location +
                    "\nCharger: " + station.chargerType +
                    "\nStatus: " + station.status
                );

            });


        const bookButton =
            div.querySelector(".book-btn");


        if (bookButton) {

            bookButton.addEventListener(
                "click",
                () => book(station)
            );

        }


        box.appendChild(div);

    });
}


async function book(station) {

    const name = prompt(
        "Enter your name:"
    );

    if (!name) return;


    const vehicle = prompt(
        "Enter your vehicle number:"
    );

    if (!vehicle) return;


    const response = await fetch(
        API + "/bookings",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                stationId: station.id,

                name: name,

                vehicle: vehicle

            })
        }
    );


    const result =
        await response.json();


    if (!response.ok) {

        alert(
            "❌ " + result.message
        );

        return;
    }


    alert(
        "✅ BOOKING CONFIRMED!\n\n" +

        "Station: " +
        result.booking.stationName +

        "\nName: " +
        result.booking.name +

        "\nVehicle: " +
        result.booking.vehicle +

        "\nStatus: " +
        result.booking.status
    );

}


document
    .getElementById("allBtn")
    .onclick = () =>
        showStations(stations);


document
    .getElementById("availableBtn")
    .onclick = () =>
        showStations(
            stations.filter(
                s => s.status === "Available"
            )
        );


document
    .getElementById("occupiedBtn")
    .onclick = () =>
        showStations(
            stations.filter(
                s => s.status === "Occupied"
            )
        );


loadStations();