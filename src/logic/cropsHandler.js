function toastPopUp() {
  let toastPopUp = document.getElementById("Toast");
  toastPopUp.className = "show";
  setTimeout(function () {
    toastPopUp.className = toastPopUp.className.replace("show", "");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  let allowRegrowth = document.getElementById("crop-regrowth");
  let allowRegrowthLive = document.getElementById("allowRegrowthLive");

  // DONE: Set default for regrowth to "no" on page load
  // NONEED: Add live data validation for form fields

  allowRegrowth.addEventListener("change", function () {
    if (this.checked) {
      allowRegrowthLive.style.display = "block";
    } else {
      allowRegrowthLive.style.display = "none";
    }
  });

  let cropDuration = document.getElementById("crop-duration");
  let cropCustomDuration = document.getElementById("cropCustomDuration");
});

let cropForm = document.getElementById("crop-form");
let cropListTableBody = document.querySelector("#crop-list-table tbody");
let ctx = document.getElementById("crop-canvas").getContext("2d");

let cropDetails = [];
let cropData = [];
let cropLabels = [];

cropForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let cropName = document.getElementById("crop-name").value;
  let seedPrice = document.getElementById("seed-price").value;
  let cropGrowthDays = document.getElementById("crop-growth-days").value;
  let cropRegrowth = document.getElementById("crop-regrowth").checked;
  let cropRegrowthEvery = document.getElementById("crop-regrowth-every").value;
  let cropPrice = document.getElementById("crop-price").value;

  if (!cropName || !seedPrice || !cropGrowthDays || !cropPrice) {
    toastPopUp();
    return;
  }

  // Convert values
  const Seed_Price = parseFloat(seedPrice);
  const growthDays = parseInt(cropGrowthDays);
  const regrowthEvery = parseInt(cropRegrowthEvery) || 0;
  const Crop_Price = parseInt(cropPrice);

  // Calculations
  const seasonDuration = 28;
  let harvests = 1;

  if (cropRegrowth && regrowthEvery > 0) {
    const remainingDays = seasonDuration - growthDays;
    harvests += Math.floor(remainingDays / regrowthEvery);
  }

  // Fixed profitPerDay calculation
  const profitPerHarvest = Crop_Price - Seed_Price;
  const normalTotalProfit = profitPerHarvest * harvests;

  const profitPerSeed = normalTotalProfit;
  const roi = (profitPerSeed / Seed_Price) * 100;

  const totalGrowthTime = cropRegrowth ? 28 : growthDays;
  const profitPerDay = normalTotalProfit / totalGrowthTime;

  // Store details for tooltip
  cropDetails.push({
    name: cropName,
    quantity: Crop_Price,
    profitPerSeed: roi,
    duration: growthDays,
    harvests: harvests,
    regrowth: cropRegrowth ? `Yes (every ${cropRegrowthEvery} days)` : "No",
    normalTotalProfit: normalTotalProfit,
    profitPerDay: profitPerDay,
  });

  // Update table
  document.getElementById("no-crops-yet").style.display = "none";
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td>${cropName}</td>
    <td>${seedPrice}</td>
    <td>${cropGrowthDays}</td>
    <td>${cropRegrowth ? "Yes" : "No"}</td>
    <td>${cropRegrowth ? cropRegrowthEvery : "-"}</td>
    <td>${cropPrice}</td>

  `;

  cropListTableBody.appendChild(newRow);

  cropLabels.push(cropName);
  cropData.push(profitPerSeed);

  console.log(cropLabels, cropData);
  updateGraph();
  cropForm.reset();
  allowRegrowthLive.style.display = "none";
});

function updateGraph() {
  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: cropLabels,
      datasets: [
        {
          label: "Total Profit",
          data: cropData,
          borderColor: "rgb(57, 120, 65)",
          borderWidth: 1,
          backgroundColor: ["rgb(48, 124, 42)"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          min: 0.0,
          ticks: {
            stepSize: 2,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || "";
              return `${label}: G$${context.raw.toFixed(2)}`;
            },
            afterLabel: function (context) {
              const crop = cropDetails.find((c) => c.name === context.label);
              if (!crop) return "";

              return [
                `Sell Price: ${crop.quantity}`,
                `Profit Per Seed: ${crop.profitPerSeed}`,
                `Duration: ${crop.duration} days`,
                `Harvests: ${crop.harvests}`,
                `Regrowth: ${crop.regrowth}`,
                `Total Profit: G$${crop.normalTotalProfit.toFixed(2)}`,
                `Profit/Day: G$${crop.profitPerDay.toFixed(2)}`,
              ].join("\n");
            },
          },
        },
      },
    },
  });
}
