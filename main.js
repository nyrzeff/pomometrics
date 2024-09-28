import Chart from 'chart.js/auto';

const calculateButton = document.getElementById("calculate-button");
calculateButton.addEventListener("click", () => {
   calculate();
});

function calculate() {
   const totalBlockDuration = parseInt(document.getElementById("total-block-duration").value);
   const sessionDuration = parseInt(document.getElementById("session-duration").value);
   const shortBreakDuration = parseInt(document.getElementById("short-break-duration").value);
   const longBreakDuration = parseInt(document.getElementById("long-break-duration").value);
   const sessionsPerCycle = parseInt(document.getElementById("sessions-per-cycle").value);
   const startTime = document.getElementById("start-time").value;

   const endTime = calculateEndTime(startTime, totalBlockDuration)
   console.log(`end time is ${endTime}`);

   const totalCycleDuration = ((sessionDuration + shortBreakDuration) * sessionsPerCycle) - shortBreakDuration + longBreakDuration;
   const numberOfCycles = totalBlockDuration / totalCycleDuration;
   console.log(`Cycle duration: ${totalCycleDuration}\nNumber of cycles: ${numberOfCycles}`);

   const focusTimePerCycle = sessionDuration * sessionsPerCycle;
   const breakTimePerCycle = totalCycleDuration - focusTimePerCycle;
   console.log(`Focus time per cycle: ${focusTimePerCycle}\nBreak time per cycle: ${breakTimePerCycle}`);

   const totalFocusTime = focusTimePerCycle * numberOfCycles;
   const totalBreakTime = breakTimePerCycle * numberOfCycles;
   console.log(`Total focus time: ${totalFocusTime}\nTotal break time: ${totalBreakTime}`);

   createChart(totalFocusTime, totalBreakTime);
}

function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const endHours = endDate.getHours().toString().padStart(2, '0');
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
  
  return `${endHours}:${endMinutes}`;
}

function createChart(totalFocusTime, totalBreakTime) {
   const xValues = ["Focus time", "Break time"];
   const yValues = [totalFocusTime, totalBreakTime];
   const barColors = ["green", "blue"];

   const ctx = document.getElementById("pomodoro-chart");

   new Chart(ctx, {
      type: "doughnut",
      data: {
         labels: xValues,
         datasets: [{
            backgroundColor: barColors,
            data: yValues
         }]
      },
      options: {
         title: {
            display: true,
            text: "Total focus and break time distribution"
         }
      }
   });
}
