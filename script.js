// Full Working Script.js

// Global Variables
let padelRevenue = 0, gymRevenue = 0, totalRevenue = 0;
let padelCosts = 0, gymCosts = 0, totalCosts = 0;
let totalInvestment = 0, annualProfit = 0;

function calculatePadel() {
  const courts = +document.getElementById("padelCourts").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const peakHours = +document.getElementById("padelPeakHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offHours = +document.getElementById("padelOffHours").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  padelRevenue = (
    ((peakHours * peakRate * peakUtil) + (offHours * offRate * offUtil))
    * courts * days * weeks
  );

  totalInvestment = +document.getElementById("padelGround").value
                   + +document.getElementById("padelStructure").value
                   + (courts * courtCost);

  padelCosts = ["padelUtil","padelInsure","padelMaint","padelMarket","padelAdmin","padelClean","padelMisc"]
    .map(id => +document.getElementById(id).value)
    .reduce((a, b) => a + b, 0);

  padelCosts += +document.getElementById("padelFtMgr").value * +document.getElementById("padelFtMgrSal").value;
  padelCosts += +document.getElementById("padelFtRec").value * +document.getElementById("padelFtRecSal").value;
  padelCosts += +document.getElementById("padelFtCoach").value * +document.getElementById("padelFtCoachSal").value;
  padelCosts += +document.getElementById("padelPtCoach").value * +document.getElementById("padelPtCoachSal").value;
  padelCosts += +document.getElementById("padelAddStaff").value * +document.getElementById("padelAddStaffSal").value;

  document.getElementById("padelSummary").innerHTML =
    `<strong>Annual Revenue:</strong> €${padelRevenue.toLocaleString()}<br>` +
    `<strong>Annual Costs:</strong> €${padelCosts.toLocaleString()}<br>` +
    `<strong>Investment:</strong> €${totalInvestment.toLocaleString()}`;

  updatePL();
  updateROI();
}

function calculateGym() {
  const ramp = document.getElementById("gymRamp").checked;
  let w = +document.getElementById("gymWeekMembers").value * +document.getElementById("gymWeekFee").value * 52;
  let m = +document.getElementById("gymMonthMembers").value * +document.getElementById("gymMonthFee").value * 12;
  let a = +document.getElementById("gymAnnualMembers").value * +document.getElementById("gymAnnualFee").value;

  if (ramp) {
    const duration = +document.getElementById("rampDuration").value;
    const effectiveness = +document.getElementById("rampEffect").value / 100;
    const factor = (duration / 12 + effectiveness) / 2;
    w *= factor; m *= factor; a *= factor;
  }

  gymRevenue = w + m + a;

  totalInvestment += +document.getElementById("gymEquip").value
                   + +document.getElementById("gymFloor").value
                   + +document.getElementById("gymAmen").value;

  gymCosts = ["gymUtil","gymInsure","gymMaint","gymMarket","gymAdmin","gymClean","gymMisc"]
    .map(id => +document.getElementById(id).value)
    .reduce((a, b) => a + b, 0);

  gymCosts += +document.getElementById("gymFtTrainer").value * +document.getElementById("gymFtTrainerSal").value;
  gymCosts += +document.getElementById("gymPtTrainer").value * +document.getElementById("gymPtTrainerSal").value;
  gymCosts += +document.getElementById("gymAddStaff").value * +document.getElementById("gymAddStaffSal").value;

  document.getElementById("gymSummary").innerHTML =
    `<strong>Annual Revenue:</strong> €${gymRevenue.toLocaleString()}<br>` +
    `<strong>Annual Costs:</strong> €${gymCosts.toLocaleString()}<br>`;

  updatePL();
  updateROI();
}

function updatePL() {
  totalRevenue = padelRevenue + gymRevenue;
  totalCosts = padelCosts + gymCosts;
  annualProfit = totalRevenue - totalCosts;

  document.getElementById("pnlSummary").innerHTML =
    `<strong>Total Revenue:</strong> €${totalRevenue.toLocaleString()}<br>` +
    `<strong>Total Costs:</strong> €${totalCosts.toLocaleString()}<br>` +
    `<strong>Annual Profit:</strong> €${annualProfit.toLocaleString()}`;

  const ctx = document.getElementById("pnlChart").getContext("2d");
  if (window.pnlChartObj) window.pnlChartObj.destroy();
  window.pnlChartObj = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Revenue", "Costs", "Profit"],
      datasets: [{
        label: "Annual Summary (€)",
        data: [totalRevenue, totalCosts, annualProfit],
        backgroundColor: ["#2a9d8f", "#e76f51", "#264653"]
      }]
    },
    options: { responsive: true }
  });
}

function updateROI() {
  const roiText = document.getElementById("yearsToROIText");
  if (annualProfit <= 0) {
    roiText.textContent = "ROI not achievable with current inputs.";
  } else {
    const years = Math.ceil(totalInvestment / annualProfit);
    roiText.textContent = `Estimated time to ROI: ${years} year(s)`;
  }

  const ctx = document.getElementById("roiChart").getContext("2d");
  if (window.roiChartObj) window.roiChartObj.destroy();
  window.roiChartObj = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...Array(6).keys()].map(i => `Year ${i+1}`),
      datasets: [{
        label: "Cumulative Profit (€)",
        data: [...Array(6).keys()].map(i => annualProfit * (i + 1)),
        borderColor: "#2a9d8f",
        fill: false
      }]
    },
    options: { responsive: true }
  });
}

document.getElementById("gymRamp").addEventListener("change", function() {
  document.getElementById("rampUpSettings").style.display = this.checked ? "block" : "none";
});

document.querySelectorAll("input[type='range']").forEach(slider => {
  slider.addEventListener("input", () => {
    const valDisplay = document.getElementById(slider.id + "Val");
    if (valDisplay) valDisplay.textContent = slider.value;
  });
});

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
