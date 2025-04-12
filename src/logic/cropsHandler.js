function toastPopUp() {
  let toastPopUp = document.getElementById("Toast");
  toastPopUp.className = "show";
  setTimeout(function(){ toastPopUp.className = toastPopUp.className.replace("show", ""); }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  let allowRegrowth = document.getElementById("crop-regrowth");
  let allowRegrowthLive = document.getElementById("allowRegrowthLive");

  // TODO: Set default for regrowth to "no" on page load
  // TODO: Add live data validation for form fields

  allowRegrowth.addEventListener("change", function () {
    if(this.checked) {
      allowRegrowthLive.style.display= "block";
    } else {
      allowRegrowthLive.style.display = "none";
    }
  });
});

let cropForm = document.getElementById("crop-form");
let cropListTableBody = document.querySelector("#crop-list-table tbody");
let ctx = document.getElementById("crop-canvas").getContext("2d");
let cropData = [];
let cropLabels = [];

cropForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // TODO: Prevent form submission if fields are empty
  // TODO: Add validation for numeric fields (price, growth days, etc.)

  let cropName = document.getElementById("crop-name").value;
  let cropPrice = document.getElementById("crop-price").value;
  let cropGrowthDays = document.getElementById("crop-growth-days").value;
  let cropRegrowth = document.getElementById("crop-regrowth").value;
  let cropRegrowthEvery = document.getElementById("crop-regrowth-every").value;
  let cropQuantity = document.getElementById("crop-quantity").value;

  if (!cropName || !cropPrice || !cropGrowthDays || !cropQuantity) {
    toastPopUp();
    return;
  }
  // TODO: calculate crop price

  document.getElementById("no-crops-yet").style.display="none";
  const newRow = document.createElement("tr");
  
  // TODO: If crop has regrowth=yes, add "Every # Days" column with user input value
  newRow.innerHTML = `
        <td>${cropName}</td>
        <td>${cropPrice}</td>
        <td>${cropGrowthDays}</td>
        <td>${cropRegrowth}</td>
        <td>${cropRegrowthEvery}</td>
        <td>${cropQuantity}</td>
        <td>
          <!-- TODO: Add edit and delete buttons -->
        </td>
    `;

  cropListTableBody.appendChild(newRow);

  // TODO: Add event listeners for edit/delete buttons
  // TODO: Implement edit functionality
  // TODO: Implement delete functionality

  //updates graph
  cropData.push(cropQuantity);
  cropLabels.push(cropName);
  updateGraph();

  //reset form
  cropForm.reset();
});

// TODO: Add search functionality for crops
// TODO: Create function to filter/search crops in the table

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
          label: "Crop Price",
          data: cropData,
          borderColor: "rgb(57, 120, 65)",
          borderWidth: 1,
          fill: true,
          backgroundColor: ["rgb(53 128 175)", "rgb(48 124 42)", "rgb(114, 176, 131)", "rgb(214 151 48)",
          ]
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      title: {
        display: true,
        text: 'yomom',
      },
    },
  });
}