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

  const totalBreakTime = helper.floorToMultipleOf(
    breakTimePerCycle * cycleCoefficient,
    shortBreakDuration,
  );

  displayVisualization(cycleDurationMinutes, cycleCoefficient);
}

function displayVisualization(cycleDurationMinutes, cycleCoefficient) {
  //
}
