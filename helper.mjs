function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const endHours = endDate.getHours().toString().padStart(2, "0");
  const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

  return `${endHours}:${endMinutes}`;
}

function floorToMultipleOf(number, multipleOf) {
  return Math.floor(number / multipleOf) * multipleOf;
}

export {calculateEndTime, floorToMultipleOf};
