// calculate time spent on sessions and on breaks in minutes
function calculate() {
   const totalFocusLength = document.getElementById("total-focus-length").valueAsNumber;
   const sessionLength = document.getElementById("session-length").valueAsNumber;
   const shortBreakLength = document.getElementById("short-break-length").valueAsNumber;
   const longBreakLength = document.getElementById("long-break-length").valueAsNumber;
   const sessionsPerCycle = document.getElementById("sessions-per-cycle").valueAsNumber;
   const startTime = document.getElementById("start-time").value;

   const endTime = calculateEndTime(startTime, totalFocusLength)
   console.log(`end time is ${endTime}`);

   const totalCycleDuration = ((sessionLength + shortBreakLength) * sessionsPerCycle) - shortBreakLength + longBreakLength;
   const numberOfCycles = totalFocusLength / totalCycleDuration;
   console.log(`Cycle duration: ${totalCycleDuration}\nNumber of cycles: ${numberOfCycles}`);

   const focusTimePerCycle = sessionLength * sessionsPerCycle;
   const breakTimePerCycle = totalCycleDuration - focusTimePerCycle;
   console.log(`Focus time per cycle: ${focusTimePerCycle}\nBreak time per cycle: ${breakTimePerCycle}`);

   const totalFocusTime = focusTimePerCycle * numberOfCycles;
   const totalBreakTime = breakTimePerCycle * numberOfCycles;
   console.log(`Total focus time: ${totalFocusTime}\nTotal break time: ${totalBreakTime}`);
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
