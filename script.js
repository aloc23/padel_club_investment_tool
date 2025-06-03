// Utility function to show tabs
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}
showTab('padel'); // default tab

// Ramp-up toggle display
document.getElementById("gymRamp").addEventListener("change", () => {
  document.getElementById("rampUpSettings").style.display = document.getElementById("gymRamp").checked ? "block" : "none";
});

// Get Padel Revenue
function getPadelRevenue() {
  const courts = +document.getElementById("padelCourts").value || 0;
  const peakHours = +document.getElementById("padelPeakHours").value || 0;
  const peakRate = +document.getElementById("padelPeakRate").value || 0;
  const peakUtil = (+document.getElementById("padelPeakUtil").value || 0) / 100;
  const offHours = +document.getElementById("padelOffHours").value || 0;
  const offRate = +document.getElementById("padelOffRate").value || 0;
  const offUtil = (+document.getElementById("padelOffUtil").value || 0) / 100;
  const days = +document.getElementById("padelDays").value || 0;
  const weeks = +document.getElementById("padelWeeks").value || 0;

  const peakRev = courts * peakHours * peakRate * peakUtil * days * weeks;
  const offRev = courts * offHours * offRate * offUtil * days * weeks;

  return peakRev + offRev;
}

// Get Padel Costs (Operational + Staff)
function getPadelCosts() {
  const ops = ["padelUtil", "padelInsure", "padelMaint", "padelMarket", "padelAdmin", "padelClean", "padelMisc"];
  let opsCost = ops.reduce((sum, id) => sum + (+document.getElementById(id).value || 0), 0);

  const staffPairs = [
    ["padelFtMgr", "padelFtMgrSal"],
    ["padelFtRec", "padelFtRecSal"],
    ["padelFtCoach", "padelFtCoachSal"],
    ["padelPtCoach", "padelPtCoachSal"],
    ["padelAddStaff", "padelAddStaffSal"]
  ];
  let staffCost = staffPairs.reduce((sum, [countId, salId]) => {
    return sum + ((+document.getElementById(countId).value || 0) * (+document.getElementById(salId).value || 0));
  }, 0);

  return opsCost + staffCost;
}

// Get Padel Investment
function getPadelInvestment() {
  const baseIds = ["padelGround", "padelStructure", "padelAmenities"];
  let baseTotal = baseIds.reduce((sum, id) => sum + (+document.getElementById(id).value || 0), 0);
  const courts = +document.getElementById("padelCourts").value || 0;
  const courtCost = +document.getElementById("padelCourtCost").value || 0;
  return baseTotal + (courts * courtCost);
}

function calculatePadel() {
  const revenue = getPadelRevenue();
  const costs = getPadelCosts();
  const investment = getPadelInvestment();
  const profit = revenue - costs;

  document.getElementById("padelSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toLocaleString()}<br>
    <strong>Annual Costs:</strong> €${costs.toLocaleString()}<br>
    <strong>Investment:</strong> €${investment.toLocaleString()}<br>
    <strong>Profit:</strong> €${profit.toLocaleString()}
  `;

  window.padelData = { revenue, costs, investment, profit };
}

// Get Gym Revenue (with Ramp-Up)
function getGymRevenue() {
  let weeklyRev = (+document.getElementById("gymWeekMembers").value || 0) * (+document.getElementById("gymWeekFee").value || 0) * 52;
  let monthlyRev = (+document.getElementById("gymMonthMembers").value || 0) * (+document.getElementById("gymMonthFee").value || 0) * 12;
  let annualRev = (+document.getElementById("gymAnnualMembers").value || 0) * (+document.getElementById("gymAnnualFee").value || 0);

  let totalRev = weeklyRev + monthlyRev + annualRev;

  if (document.getElementById("gymRamp").checked) {
    const rampDuration = +document.getElementById("rampDuration").value || 6;
    const rampEffect = (+document.getElementById("rampEffect").value || 70) / 100;
    // Simple linear ramp-up calculation (weighted average)
    totalRev = totalRev * ((rampDuration / 12) * rampEffect + ((12 - rampDuration) / 12));
  }
  return totalRev;
}

// Get Gym Costs
function getGymCosts() {
  const ops = ["gymUtil", "gymInsure", "gymMaint", "gymMarket", "gymAdmin", "gymClean", "gymMisc"];
  let opsCost = ops.reduce((sum, id) => sum + (+document.getElementById(id).value || 0), 0);

  const staffPairs = [
    ["gymFtTrainer", "gymFtTrainerSal"],
    ["gymPtTrainer", "gymPtTrainerSal"],
    ["gymAddStaff", "gymAddStaffSal"]
  ];
  let staffCost = staffPairs.reduce((sum, [countId, salId]) => {
    return sum + ((+document.getElementById(countId).value || 0) * (+document.getElementById(salId).value || 0));
  }, 0);

  return opsCost + staffCost;
}

// Get Gym Investment
function getGymInvestment() {
  const ids = ["gymEquip", "gymFloor", "gymAmen"];
  return ids.reduce((sum, id) => sum + (+document.getElementById(id).value || 0), 0);
}

function calculateGym() {
  const revenue = getGymRevenue();
  const costs = getGymCosts();
  const investment = getGymInvestment();
  const profit = revenue - costs;

  document.getElementById("gymSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toLocaleString()}<br>
    <strong>Annual Costs:</strong> €${costs.toLocaleString()}<br>
    <strong>Investment:</strong> €${investment.toLocaleString()}<br>
    <strong>Profit:</strong> €${profit.toLocaleString()}
  `;

  window.gymData = { revenue, costs, investment, profit };
}

// Update P&L Summary and Charts
function updatePnl() {
  const padelRev = window.padelData?.revenue || 0;
  const gymRev = window.gymData?.revenue || 0;
  const padelCost = window.padelData?.costs || 0;
  const gymCost = window.gymData?.costs || 0;
  const totalRev = padelRev + gymRev;
  const totalCost = padelCost + gymCost;
  const profit = totalRev - totalCost;
  const ebitdaMargin = totalRev ? ((profit / totalRev) * 100).toFixed(1) : 0;

  document.getElementById("pnlSummary").innerHTML = `
    <strong>Total Revenue:</strong> €${totalRev.toLocaleString()}<br>
    <strong>Total Costs:</strong> €${totalCost.toLocaleString()}<br>
    <strong>Profit:</strong> €${profit.toLocaleString()}<br>
    <strong>EBITDA Margin:</strong> ${ebitdaMargin}%
  `;

  drawChart("pnlChart", ["Revenue", "Costs", "Profit"], [totalRev, totalCost, profit], "bar");
  drawChart("profitTrendChart", Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`), Array(12).fill(profit / 12), "line");
  drawChart("costPieChart", ["Padel", "Gym"], [padelCost, gymCost], "pie");
}

// Update ROI Summary and Charts
function updateROI() {
  const invest = (window.padelData?.investment || 0) + (window.gymData?.investment || 0);
  const annualProfit = (window.padelData?.profit || 0) + (window.gymData?.profit || 0);

  if (annualProfit <= 0 || invest <= 0) {
    document.getElementById("yearsToROIText").innerText = "Enter valid data to calculate ROI.";
    return;
  }

  const yearsToROI = Math.ceil(invest / annualProfit);
  document.getElementById("yearsToROIText").innerText = `Estimated Payback Period: ${yearsToROI} years`;

  // ROI cumulative profits over 6 years
  const cumulativeProfits = Array.from({ length: 6 }, (_, i) => annualProfit * i - invest);

  drawChart("roiLineChart", ["Year 0", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], cumulativeProfits, "line");

  drawChart("roiBarChart",
    ["Investment", "Year 1 ROI", "Year 3 ROI", "Year 5 ROI"],
    [invest, annualProfit, annualProfit * 3, annualProfit * 5], "bar");

  drawChart("roiPieChart",
    ["Padel Investment", "Gym Investment"],
    [window.padelData?.investment || 0, window.gymData?.investment || 0], "pie");

  drawChart("roiBreakEvenChart",
    ["Break-Even Point", "Post ROI"],
    [invest, annualProfit * 5 - invest], "bar");
}

// General function to draw Chart.js charts
function drawChart(canvasId, labels, data, type) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (window[canvasId]) window[canvasId].destroy(); // destroy previous chart instance

  window[canvasId] = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        label: canvasId,
        data,
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#f44336', '#9C27B0', '#00BCD4'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: type === "pie" },
        tooltip: { enabled: true }
      }
    }
  });
}

// Update all Padel and Gym info, summaries, charts, ROI
function updateAll() {
  calculatePadel();
  calculateGym();
  updatePnl();
  updateROI();
}
