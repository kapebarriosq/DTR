const EMPLOYEE = {
  id: "KBR0003",
  password: "02192006",
  name: "James Arthur Buna"
};

const STORAGE_KEY = "kape_barrio_dtr_" + EMPLOYEE.id;
const SESSION_KEY = "kape_barrio_logged_in";

let activeShift = null;

const $ = (id) => document.getElementById(id);

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { history: [], activeShift: null };
  } catch {
    return { history: [], activeShift: null };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
}

function formatShortTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatDuration(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  if (minutes === 0) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function showLogin() {
  $("loginScreen").classList.remove("hidden");
  $("dashboardScreen").classList.add("hidden");
  $("password").value = "";
  $("loginError").textContent = "";
}

function showDashboard() {
  $("loginScreen").classList.add("hidden");
  $("dashboardScreen").classList.remove("hidden");
  render();
}

function updateClock() {
  const now = new Date();
  $("currentDate").textContent = now.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  $("currentTime").textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  const data = loadData();
  if (data.activeShift) {
    $("durationDisplay").textContent = "Current shift: " + formatDuration(Date.now() - new Date(data.activeShift.clockIn).getTime());
  }
}

function render() {
  const data = loadData();
  activeShift = data.activeShift;

  $("employeeName").textContent = EMPLOYEE.name;
  $("employeeId").textContent = "Employee ID: " + EMPLOYEE.id;

  const btn = $("attendanceBtn");

  if (activeShift) {
    $("statusText").textContent = "Currently working";
    $("clockInDisplay").textContent = "Clocked in: " + formatTime(activeShift.clockIn);
    $("clockInDisplay").classList.remove("hidden");
    $("clockOutDisplay").classList.add("hidden");
    $("durationDisplay").classList.remove("hidden");
    $("durationDisplay").textContent = "Current shift: " + formatDuration(Date.now() - new Date(activeShift.clockIn).getTime());
    btn.textContent = "CLOCK OUT";
    btn.classList.add("clock-out");
  } else {
    $("statusText").textContent = "Ready to clock in";
    $("clockInDisplay").classList.add("hidden");
    $("clockOutDisplay").classList.add("hidden");
    $("durationDisplay").classList.add("hidden");
    btn.textContent = "CLOCK IN";
    btn.classList.remove("clock-out");
  }

  renderHistory();
}

function renderHistory() {
  const data = loadData();
  const body = $("historyBody");
  body.innerHTML = "";

  if (!data.history.length) {
    $("historyEmpty").classList.remove("hidden");
    $("historyTable").classList.add("hidden");
    return;
  }

  $("historyEmpty").classList.add("hidden");
  $("historyTable").classList.remove("hidden");

  [...data.history].reverse().forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatDate(entry.clockIn)}</td>
      <td>${formatShortTime(entry.clockIn)}</td>
      <td>${formatShortTime(entry.clockOut)}</td>
      <td><strong>${formatDuration(entry.durationMs)}</strong></td>
    `;
    body.appendChild(tr);
  });
}

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const username = $("username").value.trim();
  const password = $("password").value;

  if (username === EMPLOYEE.id && password === EMPLOYEE.password) {
    sessionStorage.setItem(SESSION_KEY, "true");
    $("loginForm").reset();
    showDashboard();
  } else {
    $("loginError").textContent = "Incorrect Employee ID or password.";
  }
});

$("attendanceBtn").addEventListener("click", () => {
  const data = loadData();

  if (!data.activeShift) {
    const now = new Date().toISOString();
    data.activeShift = { clockIn: now };
    saveData(data);
    $("actionMessage").textContent = "Clock-in recorded.";
  } else {
    const clockOut = new Date().toISOString();
    const clockInMs = new Date(data.activeShift.clockIn).getTime();
    const clockOutMs = new Date(clockOut).getTime();

    if (clockOutMs < clockInMs) return;

    const entry = {
      clockIn: data.activeShift.clockIn,
      clockOut,
      durationMs: clockOutMs - clockInMs
    };

    data.history.push(entry);
    data.activeShift = null;
    saveData(data);

    $("actionMessage").textContent = "Clock-out recorded. Shift completed.";
  }

  render();
});

$("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

$("clearHistoryBtn").addEventListener("click", () => {
  const data = loadData();
  if (!data.history.length) return;

  if (confirm("Clear all DTR history on this device? This cannot be undone.")) {
    data.history = [];
    saveData(data);
    render();
  }
});

if (sessionStorage.getItem(SESSION_KEY) === "true") {
  showDashboard();
} else {
  showLogin();
}

updateClock();
setInterval(updateClock, 1000);
