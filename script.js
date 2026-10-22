
const calendarSystems = [
  {
    id: "gregory",
    name: "Gregorian Calendar",
    region: "Worldwide",
    type: "Solar",
    description: "The internationally used civil calendar."
  },
  {
    id: "indian",
    name: "Indian National Calendar (Saka)",
    region: "India",
    type: "Solar",
    description: "India's national calendar, using Saka era years."
  },
  {
    id: "buddhist",
    name: "Buddhist Calendar",
    region: "Thailand and other Buddhist communities",
    type: "Traditional",
    description: "A calendar used in Buddhist cultural and religious settings."
  },
  {
    id: "islamic",
    name: "Islamic Calendar",
    region: "Muslim communities worldwide",
    type: "Lunar",
    description: "A lunar calendar used for Ramadan and Islamic observances."
  },
  {
    id: "islamic-civil",
    name: "Islamic Civil Calendar",
    region: "Calendar calculations",
    type: "Lunar",
    description: "A calculated version of the Islamic calendar."
  },
  {
    id: "hebrew",
    name: "Hebrew Calendar",
    region: "Jewish communities",
    type: "Lunisolar",
    description: "A lunisolar calendar used for Jewish observances."
  },
  {
    id: "chinese",
    name: "Chinese Calendar",
    region: "China and Chinese communities",
    type: "Lunisolar",
    description: "A traditional calendar used for festivals and cultural dates."
  },
  {
    id: "persian",
    name: "Persian Calendar",
    region: "Iran and Afghanistan",
    type: "Solar",
    description: "A solar calendar associated with Nowruz."
  },
  {
    id: "coptic",
    name: "Coptic Calendar",
    region: "Egyptian Coptic communities",
    type: "Solar",
    description: "A calendar used by the Coptic Orthodox Church."
  },
  {
    id: "ethiopic",
    name: "Ethiopian Calendar",
    region: "Ethiopia",
    type: "Solar",
    description: "A calendar with 13 months in a common year structure."
  },
  {
    id: "ethioaa",
    name: "Ethiopian Amete Alem",
    region: "Ethiopian tradition",
    type: "Solar",
    description: "An era system used in Ethiopian calendar formatting."
  },
  {
    id: "japanese",
    name: "Japanese Calendar",
    region: "Japan",
    type: "Era-based",
    description: "Uses Japanese imperial era names alongside Gregorian dates."
  },
  {
    id: "roc",
    name: "Republic of China Calendar",
    region: "Taiwan",
    type: "Era-based",
    description: "Uses the Republic of China era alongside civil dates."
  },
  {
    id: "dangi",
    name: "Dangi Calendar",
    region: "Korea",
    type: "Traditional era",
    description: "A traditional Korean era system available in some formatting tools."
  },
  {
    id: "islamic-umalqura",
    name: "Umm al-Qura Calendar",
    region: "Saudi Arabia",
    type: "Lunar",
    description: "An Islamic calendar based on the Umm al-Qura system."
  }
];

const $ = (id) => document.getElementById(id);

const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selectedDate = new Date(
  today.getFullYear(), today.getMonth(), today.getDate(), 12
);

const formatterOptions = {
  year: "numeric",
  month: "long",
  day: "numeric"
};

function makeDate(year, month, day) {
  return new Date(year, month, day, 12);
}

function formatDate(date, calendarId = "gregory") {
  try {
    return new Intl.DateTimeFormat("en", {
      ...formatterOptions,
      calendar: calendarId,
      timeZone: "UTC"
    }).format(date);
  } catch (error) {
    return date.toLocaleDateString();
  }
}

function getDateParts(date, calendarId) {
  try {
    const formatter = new Intl.DateTimeFormat("en", {
      calendar: calendarId,
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });

    return formatter.formatToParts(date)
      .filter(part => part.type !== "literal")
      .map(part => part.value);
  } catch (error) {
    return [String(date.getDate())];
  }
}

function populateCalendarSelect() {
  const select = $("calendarSelect");

  calendarSystems.forEach(calendar => {
    const option = document.createElement("option");
    option.value = calendar.id;
    option.textContent = calendar.name;
    select.appendChild(option);
  });
}

function renderToday() {
  $("todayDate").textContent = formatDate(today);
  $("todayWeekday").textContent =
    new Intl.DateTimeFormat("en", { weekday: "long" }).format(today);
}

function renderCalendar() {
  const calendarId = $("calendarSelect").value || "gregory";

  $("monthTitle").textContent = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric"
  }).format(makeDate(viewYear, viewMonth, 1));

  const grid = $("calendarGrid");
  grid.replaceChildren();

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  weekdayNames.forEach(day => {
    const heading = document.createElement("div");
    heading.className = "day-name";
    heading.textContent = day;
    grid.appendChild(heading);
  });

  const firstDay = makeDate(viewYear, viewMonth, 1).getDay();
  const daysInMonth = makeDate(viewYear, viewMonth + 1, 0).getDate();
  const previousMonthDays = makeDate(viewYear, viewMonth, 0).getDate();

  for (let i = 0; i < 42; i++) {
    let year = viewYear;
    let month = viewMonth;
    let day;
    let isOtherMonth = false;

    if (i < firstDay) {
      day = previousMonthDays - firstDay + i + 1;
      month--;
      isOtherMonth = true;
    } else if (i >= firstDay + daysInMonth) {
      day = i - firstDay - daysInMonth + 1;
      month++;
      isOtherMonth = true;
    } else {
      day = i - firstDay + 1;
    }

    const date = makeDate(year, month, day);
    const cell = document.createElement("button");
    cell.className = "date-cell";

    if (isOtherMonth) cell.classList.add("other-month");

    if (date.toDateString() === today.toDateString()) {
      cell.classList.add("today-cell");
    }

    if (date.toDateString() === selectedDate.toDateString()) {
      cell.classList.add("selected");
    }

    const alternateNumber = document.createElement("span");
    alternateNumber.textContent = getDateParts(date, calendarId)[0];

    const gregorianNumber = document.createElement("span");
    gregorianNumber.className = "gregorian-number";
    gregorianNumber.textContent = date.getDate();

    cell.append(alternateNumber, gregorianNumber);
    cell.title = formatDate(date, calendarId);
    cell.setAttribute("aria-label", formatDate(date, calendarId));

    cell.addEventListener("click", () => {
      selectedDate = date;
      viewYear = date.getFullYear();
      viewMonth = date.getMonth();
      renderCalendar();
      renderSelectedDate();
    });

    grid.appendChild(cell);
  }

  renderSelectedDate();
}

function renderSelectedDate() {
  const calendarId = $("calendarSelect").value || "gregory";

  $("selectedDate").innerHTML = "";

  const heading = document.createElement("strong");
  heading.textContent = "Selected date";

  const gregorian = document.createElement("p");
  gregorian.textContent = "Gregorian: " + formatDate(selectedDate);

  const alternate = document.createElement("p");
  alternate.textContent =
    "Selected calendar: " + formatDate(selectedDate, calendarId);

  $("selectedDate").append(heading, gregorian, alternate);
}

function renderCalendarList(search = "") {
  const list = $("calendarList");
  list.replaceChildren();

  const query = search.toLowerCase();

  const extraCalendars = [
    {
      name: "Tamil Calendar",
      region: "Tamil Nadu and Tamil communities",
      type: "Traditional solar calendar",
      description:
        "Uses Tamil months such as Chithirai, Vaikasi, Aani and Aadi. Exact Tamil dates need a dedicated Tamil calendar calculation."
    },
    {
      name: "Mayan Calendar",
      region: "Mesoamerica",
      type: "Traditional cycles",
      description:
        "Includes the Tzolk'in, Haab' and Long Count calendar systems."
    },
    {
      name: "French Republican Calendar",
      region: "Historical France",
      type: "Historical solar calendar",
      description:
        "A historical calendar with 12 months of 30 days and additional days."
    },
    {
      name: "Ancient Roman Calendar",
      region: "Ancient Rome",
      type: "Historical calendar",
      description:
        "An evolving calendar system that preceded the Julian calendar."
    }
  ];

  [...calendarSystems, ...extraCalendars]
    .filter(calendar =>
      (calendar.name + " " + calendar.region + " " +
       calendar.type + " " + calendar.description)
        .toLowerCase().includes(query)
    )
    .forEach(calendar => {
      const item = document.createElement("article");
      item.className = "calendar-item";

      const name = document.createElement("h3");
      name.textContent = calendar.name;

      const region = document.createElement("p");
      region.textContent = "🌍 " + calendar.region;

      const type = document.createElement("p");
      type.textContent = "Type: " + calendar.type;

      const description = document.createElement("p");
      description.textContent = calendar.description;

      item.append(name, region, type, description);

      const supported = calendarSystems.some(
        system => system.name === calendar.name
      );

      if (supported) {
        const button = document.createElement("button");
        button.textContent = "Explore this calendar";
        button.addEventListener("click", () => {
          $("calendarSelect").value = calendar.id;
          renderCalendar();
          $("calendarSelect").scrollIntoView({ behavior: "smooth" });
        });
        item.appendChild(button);
      }

      list.appendChild(item);
    });

  if (!list.children.length) {
    list.textContent = "No matching calendars found.";
  }
}

function convertDate() {
  const value = $("dateInput").value;

  if (!value) {
    $("conversionResults").textContent = "Please select a date first.";
    return;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = makeDate(year, month - 1, day);
  const results = $("conversionResults");
  results.replaceChildren();

  calendarSystems.forEach(calendar => {
    const item = document.createElement("div");
    item.className = "result-item";

    const title = document.createElement("strong");
    title.textContent = calendar.name;

    const converted = document.createElement("span");
    converted.textContent = formatDate(date, calendar.id);

    item.append(title, converted);
    results.appendChild(item);
  });

  const tamil = document.createElement("div");
  tamil.className = "result-item";

  const tamilTitle = document.createElement("strong");
  tamilTitle.textContent = "Tamil Calendar";

  const tamilText = document.createElement("span");
  tamilText.textContent =
    "A specialised Tamil calendar calculation is needed for the exact Tamil date.";

  tamil.append(tamilTitle, tamilText);
  results.appendChild(tamil);
}

$("prevMonth").addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderCalendar();
});

$("nextMonth").addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderCalendar();
});

$("todayButton").addEventListener("click", () => {
  selectedDate = makeDate(
    today.getFullYear(), today.getMonth(), today.getDate()
  );
  viewYear = today.getFullYear();
  viewMonth = today.getMonth();
  renderCalendar();
});

$("calendarSelect").addEventListener("change", renderCalendar);

$("searchInput").addEventListener("input", event => {
  renderCalendarList(event.target.value);
});

$("convertButton").addEventListener("click", convertDate);

populateCalendarSelect();
$("dateInput").value =
  today.getFullYear() + "-" +
  String(today.getMonth() + 1).padStart(2, "0") + "-" +
  String(today.getDate()).padStart(2, "0");

renderToday();
renderCalendar();
renderCalendarList();
convertDate();
