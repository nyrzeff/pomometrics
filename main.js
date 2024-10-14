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

  const polylineWidth = 1000; // px
  const amountOfChunks = totalBlockDurationMinutes / 5;
  const smallestXIncrement = polylineWidth / amountOfChunks;

  // then 5.208(3) * amount of 5min increments corresponding to a break/session/cycle
  createSections(smallestXIncrement, cycleDurationMinutes, cycleCoefficient);
}

function createSections(
  smallestXIncrement,
  cycleDurationMinutes,
  cycleCoefficient,
) {
  // chunk = 5-minute block
  let x = 0,
    cycleChunks = cycleDurationMinutes / 5,
    sessionChunks = sessionDurationMinutes / 5,
    shortBreakChunks = shortBreakDuration / 5,
    actualMinutes = 0,
    currentTime;

  for (let i = 1; x + cycleChunks < 1000; ++i) {
    for (let j = 1; j <= sessionsPerCycle; ++j) {
      x =
        sessionChunks * (smallestXIncrement * j) + shortBreakDuration * (j - 1);

      console.log(`x is ${x}\tj is ${j}\n`);

      actualMinutes = sessionDurationMinutes * j + shortBreakDuration * (j - 1);
      currentTime = helper.calculateEndTime(startTime, actualMinutes);

      drawLine(x, 5, 10);
      drawText(x, 15, currentTime);

      x += shortBreakChunks * (smallestXIncrement * j);

      console.log("x is " + x + smallestXIncrement * shortBreakChunks);

      actualMinutes += shortBreakDuration;
      currentTime = helper.calculateEndTime(startTime, actualMinutes);

      if (j != sessionsPerCycle) {
        drawLine(x, 10, 15);
        drawText(x - 1, 33, currentTime);
      }
    }

    x = cycleChunks * (smallestXIncrement * i);

    actualMinutes = cycleDurationMinutes * i;
    currentTime = helper.calculateEndTime(startTime, actualMinutes);

    drawLine(x, 5, 15);
    drawText(x, 15, currentTime);
    console.log("\n");
  }
}

function drawLine(x, y1, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("id", "line");
  line.setAttribute("x1", x);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x);
  line.setAttribute("y2", y2);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "1");

  svg.appendChild(line);
}

function drawText(x, y2, currentTime) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttributeNS(null, "x", x - 8.5);
  text.setAttributeNS(null, "y", y2 - 12);
  text.setAttribute("font-size", "7");
  text.textContent = currentTime;

  svg.appendChild(text);
}
