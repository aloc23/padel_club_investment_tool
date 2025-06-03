// script.js

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function calculatePadel() {
  const courts = +document.getElementById("padelCourts").value;
  const perCourt = +document.getElementById("padelCourtCost").value;
  const ground = +document.getElementById("padelGround").value;
  const struct = +document.getElementById("padelStructure").value;

  const peakHours = +document.getElementById("padelPeakHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;

  const offHours = +document.getElementById("padelOffHours").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;

  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const revenue = courts * (
    peakHours * peakRate * peakUtil +
    offHours * offRate * offUtil
  ) * days * weeks;

  const costs = ["padelUtil", "padelInsure", "padelMaint", "padelMarket", "padelAdmin", "padelClean", "padelMisc"]
    .map(id => +document.getElementById(id).value)
    .reduce((a, b) => a + b, 0);

  const staffCosts = [
    +document.getElementById("padelFtMgr") * +document.getElementById("padelFtMgrSal").value,
    +document.getElementById("padelFtRec") * +document.getElementById("padelFtRecSal").value,
    +document.getElementById("padelFtCoach") * +document.getElementById("padelFtCoachSal").value,
    +document.getElementById("padelPtCoach") * +document.getElementById("padelPtCoachSal").value,
    +document.getElementById("padelAddStaff") * +document.getElementById("padelAddStaffSal").value
  ].reduce((a, b) => a + b, 0);

  const investment = ground + struct + courts * perCourt;
  const totalCost = costs + staffCosts;

  document.getElementById("padelSummary").innerHTML =
    `Annual Revenue: €${revenue.toLocaleString()}<br>` +
    `Operational Costs: €${costs.toLocaleString()}<br>` +
    `Staff Costs: €${staffCosts.toLocaleString()}<br>` +
    `Total Investment: €${investment.toLocaleString()}`;

  window.padel = { revenue, totalCost, investment };
  updatePnL();
  updateROI();
}

function calculateGym() {
  const equipment = +document.getElementById("gymEquip").value;
  const flooring = +document.getElementById("gymFloor").value;
  const amenities = +document.getElementById("gymAmen").value;

  const weekMembers = +document.getElementById("gymWeekMembers").value;
  const weekFee = +document.getElementById("gymWeekFee").value;
  const monthMembers = +document.getElementById("gymMonthMembers").value;
  const monthFee = +document.getElementById("gymMonthFee").value;
  const annualMembers = +document.getElementById("gymAnnualMembers").value;
  const annualFee = +document.getElementById("gymAnnualFee").value;

  const rampUp = document.getElementById("gymRamp").checked;
  const rampMonths = +document.getElementById("rampDuration").value;
  const rampEffect = +document.getElementById("rampEffect").value / 100;

  let revenue =
    weekMembers * weekFee * 52 +
    monthMembers * monthFee * 12 +
    annualMembers * annualFee;

  if (rampUp) {
    revenue *= (rampMonths * rampEffect + (12 - rampMonths)) / 12;
  }

  const costs = ["gymUtil", "gymInsure", "gymMaint", "gymMarket", "gymAdmin", "gymClean", "gymMisc"]
    .map(id => +document.getElementById(id).value)
    .reduce((a, b) => a + b, 0);

  const staffCosts = [
    +document.getElementById("gymFtTrainer") * +document.getElementById("gymFtTrainerSal").value,
    +document.getElementById("gymPtTrainer") * +document.getElementById("gymPtTrainerSal").value,
    +document.getElementById("gymAddStaff") * +document.getElementById("gymAddStaffSal").value
  ].reduce((a, b) => a + b, 0);

  const investment = equipment + flooring + amenities;
  const totalCost = costs + staffCosts;

  document.getElementById("gymSummary").innerHTML =
    `Annual Revenue: €${revenue.toLocaleString()}<br>` +
    `Operational Costs: €${costs.toLocaleString()}<br>` +
    `Staff Costs: €${staffCosts.toLocaleString()}<br>` +
    `Total Investment: €${investment.toLocaleString()}`;

  window.gym = { revenue, totalCost, investment };
  updatePnL();
  updateROI();
}

function updatePnL() {
  const rev = (window.padel?.revenue || 0) + (window.gym?.revenue || 0);
  const cost = (window.padel?.totalCost || 0) + (window.gym?.totalCost || 0);
  const profit = rev - cost;

  const isMonthly = document.querySelector("input[name='pl_toggle']:checked").value === "monthly";

  const revData = isMonthly ? Array(12).fill(rev / 12) : [rev];
  const costData = isMonthly ? Array(12).fill(cost / 12) : [cost];
  const profitData = isMonthly ? Array(12).fill(profit / 12) : [profit];

  drawChart("pnlChart", "Revenue vs Costs", ["Revenue", "Costs"], [revData, costData]);
  drawChart("profitTrendChart", "Profit Trend", ["Profit"], [profitData]);
  drawPie("costPieChart", ["Staff", "Other"], [
    (window.padel?.totalCost || 0) + (window.gym?.totalCost || 0) - ((window.padel?.investment || 0) + (window.gym?.investment || 0)),
    (window.padel?.investment || 0) + (window.gym?.investment || 0)
  ]);

  document.getElementById("pnlSummary").innerHTML =
    `Total Revenue: €${rev.toLocaleString()}<br>` +
    `Total Costs: €${cost.toLocaleString()}<br>` +
    `Profit: €${profit.toLocaleString()}`;
}

function updateROI() {
  const invest = (window.padel?.investment || 0) + (window.gym?.investment || 0);
  const profit = ((window.padel?.revenue || 0) + (window.gym?.revenue || 0)) - ((window.padel?.totalCost || 0) + (window.gym?.totalCost || 0));

  const years = [];
  const roi = [];
  let cum = 0;
  let yearToBreakEven = "Not within 10 years";
  for (let i = 1; i <= 10; i++) {
    cum += profit;
    years.push("Year " + i);
    roi.push(cum);
    if (cum >= invest && yearToBreakEven === "Not within 10 years") yearToBreakEven = `Year ${i}`;
  }
  document.getElementById("yearsToROIText").innerText = `Break Even: ${yearToBreakEven}`;

  drawChart("roiLineChart", "ROI Over Time", ["ROI"], [roi], years);
  drawChart("roiBarChart", "ROI Bar", ["ROI"], [roi], years);
  drawPie("roiPieChart", ["Investment", "Year 1 Profit"], [invest, profit]);
  drawChart("roiBreakEvenChart", "Break Even Trend", ["Cumulative ROI"], [roi], years);
}

function drawChart(id, label, labels, datasets, xLabels = []) {
  const ctx = document.getElementById(id).getContext("2d");
  if (window[id]) window[id].destroy();
  window[id] = new Chart(ctx, {
    type: "line",
    data: {
      labels: xLabels.length ? xLabels : labels,
      datasets: datasets.map((data, i) => ({
        label: labels[i],
        data,
        fill: false,
        borderColor: `hsl(${i * 90}, 70%, 50%)`,
        tension: 0.1
      }))
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  });
}

function drawPie(id, labels, data) {
  const ctx = document.getElementById(id).getContext("2d");
  if (window[id]) window[id].destroy();
  window[id] = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Cost Breakdown",
        data,
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"]
      }]
    }
  });
}

document.getElementById("gymRamp").addEventListener("change", () => {
  document.getElementById("rampUpSettings").style.display =
    document.getElementById("gymRamp").checked ? "block" : "none";
});
