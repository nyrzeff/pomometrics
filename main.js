import Chart from "chart.js/auto";

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



  console.log(
  );


  const doughnutData = {
    datasets: [
      {
        label: "Minutes",
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

}
