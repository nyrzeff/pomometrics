import Chart from "chart.js/auto";

document.querySelectorAll(".slidercontainer").forEach((container) => {
  const slider = container.querySelector("input");
  const output = container.querySelector("output");

  slider.oninput = function () {
    output.innerHTML = this.value;
  };
});



  );
  );
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
