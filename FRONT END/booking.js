const API_URL = "http://localhost:5000";

async function bookCharger(stationId) {

    const name = prompt("Enter your name:");

    if (!name) return;

    const vehicle = prompt("Enter your vehicle number:");

    if (!vehicle) return;

    try {

        const response = await fetch(
            API_URL + "/bookings",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stationId: stationId,
                    name: name,
                    vehicle: vehicle
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert("❌ " + result.message);
            return;
        }

        alert(
            "✅ BOOKING CONFIRMED!\n\n" +
            "Station: " + result.booking.stationName + "\n" +
            "Name: " + result.booking.name + "\n" +
            "Vehicle: " + result.booking.vehicle + "\n" +
            "Status: " + result.booking.status
        );

    } catch (error) {

        alert(
            "❌ Cannot connect to booking server."
        );

        console.error(error);
    }
}