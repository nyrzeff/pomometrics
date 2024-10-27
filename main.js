import Chart from "chart.js/auto";
import * as helper from "./helper.mjs";

const totalBlockDurationMinutes = parseInt(
  document.getElementById("total-block-duration").value,
);

const sessionDurationMinutes = parseInt(
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

const startTime = document.getElementById("start-time").value;

const calculateButton = document.getElementById("calculate-button");

calculateButton.addEventListener("click", () => {
  calculate();
});

function calculate() {
  const endTime = helper.calculateEndTime(startTime, totalBlockDurationMinutes);

  const cycleDurationMinutes =
    (sessionDurationMinutes + shortBreakDuration) * sessionsPerCycle -
    shortBreakDuration;

  const cycleCoefficient = totalBlockDurationMinutes / cycleDurationMinutes;

  const focusTimePerCycle = sessionDurationMinutes * sessionsPerCycle;
  const breakTimePerCycle = cycleDurationMinutes - focusTimePerCycle;

  const totalFocusTime = helper.floorToMultipleOf(
    focusTimePerCycle * cycleCoefficient,
    sessionDurationMinutes,
  );

  const totalShortBreakTime = helper.floorToMultipleOf(
    breakTimePerCycle * cycleCoefficient,
    shortBreakDuration,
  );

  const totalLongBreakTime = helper.floorToMultipleOf(
    longBreakDuration * (Math.floor(cycleCoefficient) - 1),
    longBreakDuration,
  );

  displayVisualization(totalFocusTime, totalShortBreakTime, totalLongBreakTime);
}

function displayVisualization(
  totalFocusTime,
  totalShortBreakTime,
  totalLongBreakTime,
) {
  const unusedTime =
    totalBlockDurationMinutes -
    (totalFocusTime + totalShortBreakTime + totalLongBreakTime);

  console.log(
    `totalFocus: ${totalFocusTime}\ntotalShortBreak: ${totalShortBreakTime}\ntotalLongBreak: ${totalLongBreakTime}\nremainingTime: ${unusedTime}`,
  );

  const doughnut = document.getElementById("breakdownDoughnut");

  const doughnutData = {
    labels: ["Focus", "Long break", "Short break", "Unused time"],
    datasets: [
      {
        label: "Minutes",
        data: [
          totalFocusTime,
          totalLongBreakTime,
          totalShortBreakTime,
          unusedTime,
        ],
        backgroundColor: [
          "rgb(60, 97, 30)",
          "rgb(208, 50, 14)",
          "rgb(255, 99, 71)",
          "rgb(169, 169, 169)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  new Chart(doughnut, {
    type: "doughnut",
    data: doughnutData,
  });

}
