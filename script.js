
const API_URL = "http://localhost:3000/api/calendars";

const search = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const calendarList = document.getElementById("calendarList");
const resultCount = document.getElementById("resultCount");

const today = new Date();

document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

document.getElementById("todayDay").textContent =
    today.toLocaleDateString("en-IN", {
        weekday: "long"
    });

async function loadCalendars() {
    calendarList.innerHTML = "<p>Loading calendars...</p>";

    try {
        const params = new URLSearchParams({
            search: search.value.trim(),
            type: typeFilter.value
        });

        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
            throw new Error("Failed to load calendars");
        }

        const data = await response.json();

        resultCount.textContent =
            `Showing ${data.total} calendar(s)`;

        calendarList.innerHTML = "";

        if (data.calendars.length === 0) {
            calendarList.textContent = "No calendars found.";
            return;
        }

        data.calendars.forEach(calendar => {
            const card = document.createElement("div");
            card.className = "calendar-card";

            const title = document.createElement("h3");
            title.textContent = calendar.name;

            const region = document.createElement("p");
            region.textContent = "Region: " + calendar.region;

            const description = document.createElement("p");
            description.textContent = calendar.description;

            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = calendar.type;

            card.append(title, region, description, tag);
            calendarList.appendChild(card);
        });

    } catch (error) {
        resultCount.textContent = "Connection error";
        calendarList.textContent =
            "Please start your backend server on port 3000.";
        console.error(error);
    }
}

search.addEventListener("input", loadCalendars);
typeFilter.addEventListener("change", loadCalendars);

loadCalendars();
