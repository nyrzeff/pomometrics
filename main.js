import Chart from "chart.js/auto";

window.onload = function () {
  const amountOfPomodoros = document.querySelector(
    '[data-id="pomodoro-amount"]',
  );
  const sessionDuration = document.querySelector(
    '[data-id="session-duration"]',
  );
  const shortBreakDuration = document.querySelector(
    '[data-id="short-break-duration"]',
  );

  const longBreakDuration = document.querySelector(
    '[data-id="long-break-duration"]',
  );
  const sessionsPerCycle = document.querySelector(
    '[data-id="sessions-per-cycle"]',
  );

  amountOfPomodoros.value = amountOfPomodoros.getAttribute(
    "data-original-value",
  );
  sessionDuration.value = sessionDuration.getAttribute("data-original-value");
  shortBreakDuration.value = shortBreakDuration.getAttribute(
    "data-original-value",
  );
  longBreakDuration.value = longBreakDuration.getAttribute(
    "data-original-value",
  );
  sessionsPerCycle.value = sessionsPerCycle.getAttribute("data-original-value");

  document.querySelector("input[type='checkbox']").checked = false;
};

document.querySelectorAll(".slider-container").forEach((container) => {
  const slider = container.querySelector("input");
  const output = container.querySelector("output");

  slider.oninput = function () {
    output.innerHTML = this.value;
  };
});

document
  .querySelector("input[type='checkbox']")
  .addEventListener("change", function () {
    const additionalOptions = document.querySelector(
      '[data-id="additional-options"]',
    );
    additionalOptions.style.display = this.checked ? "block" : "none";
  });

document.querySelector("button").addEventListener("click", function () {
  document.querySelector(".chart-section").style.display = "flex";
  displayBreakdown();
});

function displayBreakdown() {
  const amountOfPomodoros = parseInt(
    document.querySelector('[data-id="pomodoro-amount"]').value,
  );
  const sessionDuration = parseInt(
    document.querySelector('[data-id="session-duration"]').value,
  );
  const shortBreakDuration = parseInt(
    document.querySelector('[data-id="short-break-duration"]').value,
  );
  const longBreakDuration = parseInt(
    document.querySelector('[data-id="long-break-duration"]').value,
  );
  const sessionsPerCycle = parseInt(
    document.querySelector('[data-id="sessions-per-cycle"]').value,
  );

  const focusTime = sessionDuration * amountOfPomodoros;
  const amountOfLongBreaks = Math.floor(
    (amountOfPomodoros - 1) / sessionsPerCycle,
  );
  const longBreakTime = longBreakDuration * amountOfLongBreaks;
  const shortBreakTime =
    shortBreakDuration * (amountOfPomodoros - 1) -
    shortBreakDuration * amountOfLongBreaks;

  const totalHours = (focusTime + shortBreakTime + longBreakTime) / 60;

  createDoughnutChart(focusTime, shortBreakTime, longBreakTime);

  createStackedBarChart(
    totalHours,
    sessionDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsPerCycle,
  );
}

let doughnut, bar;

function createDoughnutChart(focusTime, longBreakTime, shortBreakTime) {
  const ctx = document.querySelector('[data-id="chart1"]').getContext("2d");

  if (doughnut) doughnut.destroy();

  const data = {
    labels: ["Focus", "Long break", "Short break"],
    datasets: [
      {
        label: "Minutes",
        data: [focusTime, longBreakTime, shortBreakTime],
        backgroundColor: ["#006400", "#f70d1a", "#ff6347"],
        hoverOffset: 4,
      },
    ],
  };

  const config = {
    type: "doughnut",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      borderColor: "#000f00",
      plugins: {
        title: {
          display: true,
          text: "Total breakdown",
          font: {
            size: 24,
          },
        },
        legend: {
          position: "top",
        },
      },
    },
    data: data,
  };

  doughnut = new Chart(ctx, config);
}

function createStackedBarChart(
  totalHours,
  sessionDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsPerCycle,
) {
  const ctx = document.querySelector('[data-id="chart2"]').getContext("2d");

  if (bar) bar.destroy();

  const labels = Array.from(
    { length: Math.ceil(totalHours) },
    (_, i) => `${i}h-${i + 1}h`,
  );

  const hourlyBreakdown = calculateHourlyBreakdown(
    sessionDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsPerCycle,
    totalHours,
  );

  console.log(hourlyBreakdown);

  const barData = {
    labels: labels,
    datasets: [
      {
        label: "Focus",
        data: hourlyBreakdown.map((e) => e.focusTime),
        backgroundColor: "#006400",
      },
      {
        label: "Long break",
        data: hourlyBreakdown.map((e) => e.longBreakTime),
        backgroundColor: "#f70d1a",
      },
      {
        label: "Short break",
        data: hourlyBreakdown.map((e) => e.shortBreakTime),
        backgroundColor: "#ff6347",
      },
    ],
  };

  const config = {
    type: "bar",
    data: barData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      borderColor: "#000f00",
      plugins: {
        title: {
          display: true,
          text: "Hourly breakdown",
          font: {
            size: 24,
          },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Hours elapsed",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Time (minutes)",
          },
          max: 60,
        },
      },
    },
  };

  bar = new Chart(ctx, config);
}

function calculateHourlyBreakdown(
  sessionDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsPerCycle,
  totalHours,
) {
  const hourlyBreakdown = [];
  let totalMinutes = Math.round(totalHours * 60);
  let totalProcessedMinutes = 0,
    remainingMinutesInHour = 60;
  let focus = 0,
    shortBreak = 0,
    longBreak = 0;
  let focusRemainder = 0,
    shortBreakRemainder = 0,
    longBreakRemainder = 0;
  let sessionCount = 0;

  while (totalProcessedMinutes < totalMinutes) {
    if (remainingMinutesInHour > 0 && totalProcessedMinutes < totalMinutes) {
      if (sessionDuration > remainingMinutesInHour) {
        focus += remainingMinutesInHour;
        focusRemainder = sessionDuration - remainingMinutesInHour;
        totalProcessedMinutes += remainingMinutesInHour;
        remainingMinutesInHour = 0;
      } else {
        if (shortBreakRemainder === 0 && longBreakRemainder === 0) {
          if (focusRemainder > 0) {
            totalProcessedMinutes += focusRemainder;
            remainingMinutesInHour -= focusRemainder;
            focus += focusRemainder;
            focusRemainder = 0;
          } else {
            totalProcessedMinutes += sessionDuration;
            remainingMinutesInHour -= sessionDuration;
            focus += sessionDuration;
          }
          sessionCount++;
        }
      }
    }

    if (remainingMinutesInHour > 0 && totalProcessedMinutes < totalMinutes) {
      if (sessionCount > 0 && sessionCount % sessionsPerCycle === 0) {
        if (longBreakDuration > remainingMinutesInHour) {
          longBreak += remainingMinutesInHour;
          longBreakRemainder = longBreakDuration - remainingMinutesInHour;
          totalProcessedMinutes += remainingMinutesInHour;
          remainingMinutesInHour = 0;
        } else {
          if (shortBreakRemainder === 0 && focusRemainder === 0) {
            if (longBreakRemainder > 0) {
              totalProcessedMinutes += longBreakRemainder;
              remainingMinutesInHour -= longBreakRemainder;
              longBreak += longBreakRemainder;
              longBreakRemainder = 0;
            } else {
              totalProcessedMinutes += longBreakDuration;
              remainingMinutesInHour -= longBreakDuration;
              longBreak += longBreakDuration;
            }
          }
        }
      } else {
        if (shortBreakDuration > remainingMinutesInHour) {
          shortBreak += remainingMinutesInHour;
          shortBreakRemainder = shortBreakDuration - remainingMinutesInHour;
          totalProcessedMinutes += remainingMinutesInHour;
          remainingMinutesInHour = 0;
        } else {
          if (longBreakRemainder === 0 && focusRemainder === 0) {
            if (shortBreakRemainder > 0) {
              totalProcessedMinutes += shortBreakRemainder;
              remainingMinutesInHour -= shortBreakRemainder;
              shortBreak += shortBreakRemainder;
              shortBreakRemainder = 0;
            } else {
              totalProcessedMinutes += shortBreakDuration;
              remainingMinutesInHour -= shortBreakDuration;
              shortBreak += shortBreakDuration;
            }
          }
        }
      }
    }

    if (
      remainingMinutesInHour === 0 ||
      totalProcessedMinutes === totalMinutes
    ) {
      hourlyBreakdown.push({
        focusTime: focus,
        longBreakTime: longBreak,
        shortBreakTime: shortBreak,
      });

      focus = 0;
      longBreak = 0;
      shortBreak = 0;

      if (totalProcessedMinutes <= totalMinutes) remainingMinutesInHour = 60;
    }
  }
  return hourlyBreakdown;
}
