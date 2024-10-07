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

const svg = document.getElementById("svg-node");
const svgStartTime = document.getElementById("svg-start-time");
const svgEndTime = document.getElementById("svg-end-time");

const calculateButton = document.getElementById("calculate-button");

calculateButton.addEventListener("click", () => {
  calculate();
});

function calculate() {
  const endTime = helper.calculateEndTime(startTime, totalBlockDurationMinutes);

  // should this be here?
  svgStartTime.innerHTML = startTime;
  svgEndTime.innerHTML = endTime;

  const cycleDurationMinutes =
    (sessionDurationMinutes + shortBreakDuration) * sessionsPerCycle -
    shortBreakDuration +
    longBreakDuration;

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

  displayVisualization(cycleCoefficient, cycleDurationMinutes);
}

function displayVisualization(cycleCoefficient, cycleDurationMinutes) {
  // polyline always has the same width (1000px), but can de divided in up to 192 five-minute chunks (16h max block duration)
  // helpful: where do I need to set a marker in the polyline?
  // 1000 px / 192 chunks = 5.208(3)
  // then 5.208(3) * amount of 5min increments corresponding to a break/session/cycle

  const workingWidth = 1000; // px
  const amountOfChunks = totalBlockDurationMinutes / 5;
  const smallestChunkIncrement = workingWidth / amountOfChunks;

  createSections(smallestChunkIncrement, cycleDurationMinutes);
}

function createSections(smallestChunkIncrement, cycleDurationMinutes) {
  let x = 0,
    inc = 0;

  for (let i = 1; x + inc < 1000; ++i) {
    let y1, y2;

    inc = cycleDurationMinutes / 5;
    x = smallestChunkIncrement * inc * i;
    console.log(`marker at ${x}\n`);

    y1 = 5;
    y2 = 15;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("id", "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y2);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "1");

    const actualMinutes = cycleDurationMinutes * i;

    console.log(
      `actualMinutes: ${actualMinutes}\n\nBreakdown:\n\ttotalBlockDurationMinutes: ${totalBlockDurationMinutes}\n\tx: ${x}\n\tres: ${helper.floorToMultipleOf(
        (totalBlockDurationMinutes * x) / 960,
        5,
      )}\n\tres (nofloor): ${(totalBlockDurationMinutes * x) / 960}`,
    );

    const currentTime = helper.calculateEndTime(startTime, actualMinutes);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = currentTime;

    text.setAttributeNS(null, "x", x - 12);
    text.setAttributeNS(null, "y", y2 - 12);

    svg.appendChild(line);
    svg.appendChild(text);
  }
}
