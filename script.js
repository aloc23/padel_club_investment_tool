// Keep charts global to destroy when redrawing
let pnlChart, profitTrendChart, costPieChart;
let roiLineChart, roiBarChart, roiPieChart, roiBreakEvenChart;

// Show/hide tabs
function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
  document.querySelectorAll(".tabs button").forEach((btn) => btn.classList.remove("active"));
  document.getElementById("tab" + capitalizeFirstLetter(tabId)).classList.add("active");
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Padel calculations
function calculatePadel() {
  // Investment
  const ground = getNum("padelGround");
  const structure = getNum("padelStructure");
  const courts = getNum("padelCourts");
  const courtCost = getNum("padelCourtCost");
  const amenities = getNum("padelAmen");

  const investment = ground + structure + courts * courtCost + amenities;

  // Revenue calculation (peak + off-peak)
  const peakHours = getNum("padelPeakHours");
  const peakRate = getNum("padelPeakRate");
  const peakUtil = getNum("padelPeakUtil") / 100;
  const offHours = getNum("padelOffHours");
  const offRate = getNum("padelOffRate");
  const offUtil = getNum("padelOffUtil") / 100;
  const daysPerWeek = getNum("padelDays");
  const weeksPerYear = getNum("padelWeeks");

  const peakRevenue = peakHours * peakRate * peakUtil * daysPerWeek * weeksPerYear;
  const offRevenue = offHours * offRate * offUtil * daysPerWeek * weeksPerYear;
  const revenue = peakRevenue + offRevenue;

  // Operational Costs
  const util = getNum("padelUtil");
  const insure = getNum("padelInsure");
  const maint = getNum("padelMaint");
  const market = getNum("padelMarket");
  const admin = getNum("padelAdmin");
  const clean = getNum("padelClean");
  const misc = getNum("padelMisc");

  const opCosts = util + insure + maint + market + admin + clean + misc;

  // Staff Costs
  const ftMgr = getNum("padelFtMgr");
  const ftMgrSal = getNum("padelFtMgrSal");
  const ftRec = getNum("padelFtRec");
  const ftRecSal = getNum("padelFtRecSal");
  const ftCoach = getNum("padelFtCoach");
  const ftCoachSal = getNum("padelFtCoachSal");
  const ptCoach = getNum("padelPtCoach");
  const ptCoachSal = getNum("padelPtCoachSal");
  const addStaff = getNum("padelAddStaff");
  const addStaffSal = getNum("padelAddStaffSal");

  const staffCost =
    ftMgr * ftMgrSal +
    ftRec * ftRecSal +
    ftCoach * ftCoachSal +
    ptCoach * ptCoachSal +
    addStaff * addStaffSal;

  const totalCosts = opCosts + staffCost;

  // Summary display
  const summary = `
    <p><strong>Investment:</strong> €${investment.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Estimated Annual Revenue:</strong> €${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Operational Costs:</strong> €${opCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Staff Costs:</strong> €${staffCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Total Costs:</strong> €${totalCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Net Profit:</strong> €${(revenue - totalCosts).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
  `;
  document.getElementById("padelSummary").innerHTML = summary;

  // Store values globally for use in PnL and ROI
  window.padel = { investment, revenue, opCosts, staffCost, totalCosts, netProfit: revenue - totalCosts };
}

// Gym calculations
function calculateGym() {
  // Investment
  const equip = getNum("gymEquip");
  const floor = getNum("gymFloor");
  const amenities = getNum("gymAmen");
  const investment = equip + floor + amenities;

  // Revenue calculation with ramp-up
  let weeklyMembers = getNum("gymWeekMembers");
  let weeklyFee = getNum("gymWeekFee");
  let monthlyMembers = getNum("gymMonthMembers");
  let monthlyFee = getNum("gymMonthFee");
  let annualMembers = getNum("gymAnnualMembers");
  let annualFee = getNum("gymAnnualFee");

  let baseRevenue =
    weeklyMembers * weeklyFee * 52 +
    monthlyMembers * monthlyFee * 12 +
    annualMembers * annualFee;

  // Ramp-up
  const rampChecked = document.getElementById("gymRamp").checked;
  let revenue = baseRevenue;

  if (rampChecked) {
    const rampDuration = getNum("rampDuration");
    const rampEffect = getNum("rampEffect") / 100;
    revenue = 0;
    for (let month = 1; month <= 12; month++) {
      let monthFactor = month <= rampDuration ? (month / rampDuration) * rampEffect : 1;
      let monthRevenue = baseRevenue / 12 * monthFactor;
      revenue += monthRevenue;
    }
  }

  // Operational Costs
  const util = getNum("gymUtil");
  const insure = getNum("gymInsure");
  const maint = getNum("gymMaint");
  const market = getNum("gymMarket");
  const admin = getNum("gymAdmin");
  const clean = getNum("gymClean");
  const misc = getNum("gymMisc");

  const opCosts = util + insure + maint + market + admin + clean + misc;

  // Staff Costs
  const ftTrainer = getNum("gymFtTrainer");
  const ftTrainerSal = getNum("gymFtTrainerSal");
  const ptTrainer = getNum("gymPtTrainer");
  const ptTrainerSal = getNum("gymPtTrainerSal");
  const addStaff = getNum("gymAddStaff");
  const addStaffSal = getNum("gymAddStaffSal");

  const staffCost = ftTrainer * ftTrainerSal + ptTrainer * ptTrainerSal + addStaff * addStaffSal;

  const totalCosts = opCosts + staffCost;

  // Summary display
  const summary = `
    <p><strong>Investment:</strong> €${investment.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Estimated Annual Revenue:</strong> €${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Operational Costs:</strong> €${opCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Staff Costs:</strong> €${staffCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Total Costs:</strong> €${totalCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Net Profit:</strong> €${(revenue - totalCosts).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
  `;
  document.getElementById("gymSummary").innerHTML = summary;

  // Store values globally for use in PnL and ROI
  window.gym = { investment, revenue, opCosts, staffCost, totalCosts, netProfit: revenue - totalCosts };
}

// Utility for getting numbers safely
function getNum(id) {
  const val = parseFloat(document.getElementById(id).value);
  return isNaN(val) ? 0 : val;
}

// Toggle ramp-up settings visibility
function toggleRampUp() {
  const rampSettings = document.getElementById("rampUpSettings");
  rampSettings.classList.toggle("hidden");
  updateRampLabels();
  calculateGym();
  updateROI();
  updatePnL();
}

// Update ramp sliders display values
function updateRampLabels() {
  document.getElementById("rampDurationVal").textContent = document.getElementById("rampDuration").value;
  document.getElementById("rampEffectVal").textContent = document.getElementById("rampEffect").value;
}

// Update P&L display and charts
function updatePnL() {
  // Aggregate revenue and costs from Padel + Gym
  const padel = window.padel || {};
  const gym = window.gym || {};

  // Calculate combined values
  const totalRevenue = (padel.revenue || 0) + (gym.revenue || 0);
  const totalCosts = (padel.totalCosts || 0) + (gym.totalCosts || 0);
  const netProfit = totalRevenue - totalCosts;
  const ebitda = netProfit; // For simplicity, no depreciation/amortization included
  const netMargin = totalRevenue ? (netProfit / totalRevenue) * 100 : 0;

  // Show summary
  document.getElementById("pnlSummary").innerHTML = `
    <p><strong>Total Revenue:</strong> €${totalRevenue.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p><strong>Total Costs:</strong> €${totalCosts.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p><strong>EBITDA (Approx):</strong> €${ebitda.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p><strong>Net Margin:</strong> ${netMargin.toFixed(2)}%</p>
  `;

  // Build monthly breakdown table
  const tbody = document.querySelector("#monthlyBreakdown tbody");
  tbody.innerHTML = "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  // Distribute revenue/costs/profits evenly for demo (can be improved)
  let monthlyRevenue = totalRevenue / 12;
  let monthlyCosts = totalCosts / 12;
  let monthlyProfit = netProfit / 12;
  for (let i=0; i<12; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${months[i]}</td>
      <td>€${monthlyRevenue.toFixed(2)}</td>
      <td>€${monthlyCosts.toFixed(2)}</td>
      <td>€${monthlyProfit.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  }

  // Draw Charts
  drawPnLCharts(totalRevenue, totalCosts, netProfit, monthlyRevenue, monthlyCosts, monthlyProfit);

}

// Draw P&L charts
function drawPnLCharts(totalRevenue, totalCosts, netProfit, monthlyRevenue, monthlyCosts, monthlyProfit) {
  // Destroy old charts if exist
  if (pnlChart) pnlChart.destroy();
  if (profitTrendChart) profitTrendChart.destroy();
  if (costPieChart) costPieChart.destroy();

  // Bar chart: Total Revenue, Costs, Profit
  const ctx1 = document.getElementById("pnlChart").getContext("2d");
  pnlChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["Revenue", "Costs", "Profit"],
      datasets: [{
        label: "Annual Amount (€)",
        data: [totalRevenue, totalCosts, netProfit],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"]
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Line chart: Monthly profit, revenue, costs
  const ctx2 = document.getElementById("profitTrendChart").getContext("2d");
  profitTrendChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [
        {
          label: "Revenue",
          data: Array(12).fill(monthlyRevenue),
          borderColor: "#4caf50",
          fill: false,
          tension: 0.3
        },
        {
          label: "Costs",
          data: Array(12).fill(monthlyCosts),
          borderColor: "#f44336",
          fill: false,
          tension: 0.3
        },
        {
          label: "Profit",
          data: Array(12).fill(monthlyProfit),
          borderColor: "#2196f3",
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: { responsive: true }
  });

  // Pie chart: Revenue vs Costs vs Profit
  const ctx3 = document.getElementById("costPieChart").getContext("2d");
  costPieChart = new Chart(ctx3, {
    type: "pie",
    data: {
      labels: ["Revenue", "Costs", "Profit"],
      datasets: [{
        data: [totalRevenue, totalCosts, netProfit],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"]
      }]
    },
    options: { responsive: true }
  });
}

// Update ROI tab
function updateROI() {
  const padel = window.padel || {};
  const gym = window.gym || {};
  const investment = (padel.investment || 0) + (gym.investment || 0);
  const baseRevenue = (padel.revenue || 0) + (gym.revenue || 0);
  const baseCosts = (padel.totalCosts || 0) + (gym.totalCosts || 0);

  // Get adjustments from sliders
  const revAdjustPct = parseFloat(document.getElementById("revAdjust").value) / 100;
  const costAdjustPct = parseFloat(document.getElementById("costAdjust").value) / 100;

  document.getElementById("revAdjustVal").textContent = (revAdjustPct * 100).toFixed(0) + "%";
  document.getElementById("costAdjustVal").textContent = (costAdjustPct * 100).toFixed(0) + "%";

  const adjustedRevenue = baseRevenue * (1 + revAdjustPct);
  const adjustedCosts = baseCosts * (1 + costAdjustPct);
  const profit = adjustedRevenue - adjustedCosts;

  // Calculate cumulative profit, payback period etc for 10 years
  let cumulativeProfit = 0;
  let paybackYear = null;
  let paybackData = [];

  for (let year = 1; year <= 10; year++) {
    cumulativeProfit += profit;
    paybackData.push({ year, cumulativeProfit, investment });
    if (!paybackYear && cumulativeProfit >= investment) paybackYear = year;
  }

  // ROI at year 1,3,5
  const roiYear1 = paybackData[0].cumulativeProfit / investment * 100 || 0;
  const roiYear3 = paybackData[2].cumulativeProfit / investment * 100 || 0;
  const roiYear5 = paybackData[4].cumulativeProfit / investment * 100 || 0;

  // Summary
  document.getElementById("roiSummary").innerHTML = `
    <p><strong>Estimated Payback Period:</strong> ${paybackYear ? paybackYear + " year(s)" : "Not reached within 10 years"}</p>
    <p><strong>ROI Year 1:</strong> ${roiYear1.toFixed(1)}%</p>
    <p><strong>ROI Year 3:</strong> ${roiYear3.toFixed(1)}%</p>
    <p><strong>ROI Year 5:</strong> ${roiYear5.toFixed(1)}%</p>
  `;

  // Payback table
  const tbody = document.querySelector("#paybackTable tbody");
  tbody.innerHTML = "";
  paybackData.forEach(({year, cumulativeProfit, investment}) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${year}</td>
      <td>€${cumulativeProfit.toFixed(2)}</td>
      <td>€${investment.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Draw charts
  drawROICharts(paybackData, investment, profit);
}

function drawROICharts(paybackData, investment, profit) {
  // Destroy old charts
  if (roiLineChart) roiLineChart.destroy();
  if (roiBarChart) roiBarChart.destroy();
  if (roiPieChart) roiPieChart.destroy();
  if (roiBreakEvenChart) roiBreakEvenChart.destroy();

  // Line chart cumulative profit vs investment
  const ctxLine = document.getElementById("roiLineChart").getContext("2d");
  roiLineChart = new Chart(ctxLine, {
    type: "line",
    data: {
      labels: paybackData.map(d => "Year " + d.year),
      datasets: [
        {
          label: "Cumulative Profit",
          data: paybackData.map(d => d.cumulativeProfit),
          borderColor: "#4caf50",
          fill: true,
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.3,
        },
        {
          label: "Investment",
          data: paybackData.map(d => d.investment),
          borderColor: "#f44336",
          borderDash: [5,5],
          fill: false,
          tension: 0.3,
        }
      ]
    },
    options: { responsive: true }
  });

  // Bar chart annual profit
  const ctxBar = document.getElementById("roiBarChart").getContext("2d");
  roiBarChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: paybackData.map(d => "Year " + d.year),
      datasets: [{
        label: "Annual Profit",
        data: Array(paybackData.length).fill(profit),
        backgroundColor: "#2196f3",
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Pie chart investment vs profit year 1
  const ctxPie = document.getElementById("roiPieChart").getContext("2d");
  roiPieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: ["Investment", "Profit Year 1"],
      datasets: [{
        data: [paybackData[0].investment, profit],
        backgroundColor: ["#f44336", "#4caf50"]
      }]
    },
    options: { responsive: true }
  });

  // Break-even area chart
  const ctxBreak = document.getElementById("roiBreakEvenChart").getContext("2d");
  roiBreakEvenChart = new Chart(ctxBreak, {
    type: "line",
    data: {
      labels: paybackData.map(d => "Year " + d.year),
      datasets: [
        {
          label: "Cumulative Profit",
          data: paybackData.map(d => d.cumulativeProfit),
          borderColor: "#4caf50",
          fill: true,
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.3,
        },
        {
          label: "Investment",
          data: paybackData.map(d => d.investment),
          borderColor: "#f44336",
          borderDash: [5,5],
          fill: false,
          tension: 0.3,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Initialization on page load
window.onload = function() {
  showTab("padel");
  calculatePadel();
  calculateGym();
  updatePnL();
  updateROI();
};
