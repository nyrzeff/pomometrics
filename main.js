document.querySelectorAll(".slidercontainer").forEach((container) => {
  const slider = container.querySelector("input");
  const output = container.querySelector("output");

  slider.oninput = function () {
    output.innerHTML = this.value;
  };
});

document
  .getElementById("toggle-options")
  .addEventListener("change", function () {
    const additionalOptions = document.getElementById("additional-options");
    additionalOptions.style.display = this.checked ? "block" : "none";
  });

document.querySelector("button").addEventListener("click", function () {
  displayBreakdown();
});

function displayBreakdown() {
  const amountOfPomodoros = parseInt(
    document.getElementById("pomodoro-amount").value,
  );
  const sessionDuration = parseInt(
    document.getElementById("session-duration").value,
  );
  const shortBreakDuration = parseInt(
    document.getElementById("short-break-duration").value,
  );
  const longBreakDuration = parseInt(
    document.getElementById("long-break-duration").value,
  );
  const sessionsPerCycle = parseInt(
    document.getElementById("sessions-per-cycle").value,
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

  const doughnut = document.getElementById("chart1");

  const doughnutData = {
    labels: ["Focus", "Long break", "Short break"],
    datasets: [
      {
        label: "Minutes",
        data: [focusTime, longBreakTime, shortBreakTime],
        backgroundColor: [
          "rgb(60, 97, 30)",
          "rgb(208, 50, 14)",
          "rgb(255, 99, 71)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  new Chart(doughnut, {
    type: "doughnut",
    data: doughnutData,
  });

  // chart 2
  const bar = document.getElementById("chart2");
  const labels = Array.from({ length: Math.ceil(totalHours) }, (_, i) =>
    (i + 1).toString(),
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
        backgroundColor: "rgb(60, 97, 30)",
      },
      {
        label: "Long break",
        data: hourlyBreakdown.map((e) => e.longBreakTime),
        backgroundColor: "rgb(208, 50, 14)",
      },
      {
        label: "Short break",
        data: hourlyBreakdown.map((e) => e.shortBreakTime),
        backgroundColor: "rgb(255, 99, 71)",
      },
    ],
  };

  new Chart(bar, {
    type: "bar",
    data: barData,
    options: {
      plugins: {
        title: {
          display: true,
          text: "Stacked bar breakdown",
        },
        legend: {
          position: "top",
        },
      },
      responsive: true,
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
  });
}

function calculateHourlyBreakdown(
  sessionDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsPerCycle,
  totalHours,
) {
  const hourlyBreakdown = [];
  let totalMinutes = totalHours * 60;
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
      remainingMinutesInHour = 60;
    }
  }
  return hourlyBreakdown;
}
