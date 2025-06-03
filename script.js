function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// Toggle Ramp-Up Settings
document.getElementById("gymRamp").addEventListener("change", () => {
  document.getElementById("rampUpSettings").style.display =
    document.getElementById("gymRamp").checked ? "block" : "none";
});

function getPadelRevenue() {
  const courts = +document.getElementById("padelCourts").value;
  const peakHours = +document.getElementById("padelPeakHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offHours = +document.getElementById("padelOffHours").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const peakRev = courts * peakHours * peakRate * peakUtil * days * weeks;
  const offRev = courts * offHours * offRate * offUtil * days * weeks;

  return peakRev + offRev;
}

function getPadelCosts() {
  const ops = ["padelUtil", "padelInsure", "padelMaint", "padelMarket", "padelAdmin", "padelClean", "padelMisc"];
  let opsCost = ops.reduce((sum, id) => sum + (+document.getElementById(id).value), 0);

  const staff = [
    ["padelFtMgr", "padelFtMgrSal"],
    ["padelFtRec", "padelFtRecSal"],
    ["padelFtCoach", "padelFtCoachSal"],
    ["padelPtCoach", "padelPtCoachSal"],
    ["padelAddStaff", "padelAddStaffSal"]
  ];

  let staffCost = staff.reduce((sum, [n, s]) => sum + (+document.getElementById(n).value * +document.getElementById(s).value), 0);
  return opsCost + staffCost;
}

function getPadelInvestment() {
  const base = ["padelGround", "padelStructure", "padelAmenities"];
  let total = base.reduce((sum, id) => sum + (+document.getElementById(id).value), 0);
  total += +document.getElementById("padelCourts").value * +document.getElementById("padelCourtCost").value;
  return total;
}

function calculatePadel() {
  const revenue = getPadelRevenue();
  const costs = getPadelCosts();
  const invest = getPadelInvestment();
  document.getElementById("padelSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toLocaleString()}<br>
    <strong>Annual Costs:</strong> €${costs.toLocaleString()}<br>
    <strong>Investment:</strong> €${invest.toLocaleString()}<br>
    <strong>Profit:</strong> €${(revenue - costs).toLocaleString()}
  `;
}

function getGymRevenue() {
  let weekly = +document.getElementById("gymWeekMembers").value * +document.getElementById("gymWeekFee").value * 52;
  let monthly = +document.getElementById("gymMonthMembers").value * +document.getElementById("gymMonthFee").value * 12;
  let annual = +document.getElementById("gymAnnualMembers").value * +document.getElementById("gymAnnualFee").value;

  if (document.getElementById("gymRamp").checked) {
    const rampDur = +document.getElementById("rampDuration").value;
    const rampEff = +document.getElementById("rampEffect").value / 100;
    const scale = (rampDur / 12) * (1 + rampEff) / 2;
    return (weekly + monthly + annual) * scale;
  }

  return weekly + monthly + annual;
}

function getGymCosts() {
  const ops = ["gymUtil", "gymInsure", "gymMaint", "gymMarket", "gymAdmin", "gymClean", "gymMisc"];
  let opsCost = ops.reduce((sum, id) => sum + (+document.getElementById(id).value), 0);

  const staff = [
    ["gymFtTrainer", "gymFtTrainerSal"],
    ["gymPtTrainer", "gymPtTrainerSal"],
    ["gymAddStaff", "gymAddStaffSal"]
  ];

  let staffCost = staff.reduce((sum, [n, s]) => sum + (+document.getElementById(n).value * +document.getElementById(s).value), 0);
  return opsCost + staffCost;
}

function getGymInvestment() {
  return ["gymEquip", "gymFloor", "gymAmen"].reduce((sum, id) => sum + (+document.getElementById(id).value), 0);
}

function calculateGym() {
  const revenue = getGymRevenue();
  const costs = getGymCosts();
  const invest = getGymInvestment();
  document.getElementById("gymSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toLocaleString()}<br>
    <strong>Annual Costs:</strong> €${costs.toLocaleString()}<br>
    <strong>Investment:</strong> €${invest.toLocaleString()}<br>
    <strong>Profit:</strong> €${(revenue - costs).toLocaleString()}
  `;
}

function updateAll() {
  updatePnl();
  updateROI();
}

function updatePnl() {
  const padelRev = getPadelRevenue();
  const gymRev = getGymRevenue();
  const padelCost = getPadelCosts();
  const gymCost = getGymCosts();
  const totalRev = padelRev + gymRev;
  const totalCost = padelCost + gymCost;
  const profit = totalRev - totalCost;

  document.getElementById("pnlSummary").innerHTML = `
    <strong>Total Revenue:</strong> €${totalRev.toLocaleString()}<br>
    <strong>Total Costs:</strong> €${totalCost.toLocaleString()}<br>
    <strong>Profit:</strong> €${profit.toLocaleString()}<br>
    <strong>EBITDA Margin:</strong> ${(profit / totalRev * 100).toFixed(1)}%
  `;

  drawChart("pnlChart", ["Revenue", "Costs", "Profit"], [totalRev, totalCost, profit], "bar");
  drawChart("profitTrendChart", Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`), Array(12).fill(profit / 12), "line");
  drawChart("costPieChart", ["Padel", "Gym"], [padelCost, gymCost], "pie");
}

function updateROI() {
  const invest = getPadelInvestment() + getGymInvestment();
  const annualProfit = (getPadelRevenue() + getGymRevenue()) - (getPadelCosts() + getGymCosts());

  let yearsToROI = Math.ceil(invest / annualProfit);
  document.getElementById("yearsToROIText").innerText = `Estimated Payback Period: ${yearsToROI} years`;

  const data = Array.from({ length: 6 }, (_, i) => annualProfit * i - invest);
  drawChart("roiLineChart", ["Y0", "Y1", "Y2", "Y3", "Y4", "Y5"], data, "line");
  drawChart("roiBarChart", ["Investment", "Year 1 ROI", "Year 3 ROI", "Year 5 ROI"], [
    invest,
    annualProfit,
    annualProfit * 3,
    annualProfit * 5
  ], "bar");
  drawChart("roiPieChart", ["Padel Investment", "Gym Investment"], [getPadelInvestment(), getGymInvestment()], "pie");
  drawChart("roiBreakEvenChart", ["Break-Even Point", "Post ROI"], [invest, annualProfit * 5 - invest], "bar");
}

function drawChart(id, labels, data, type) {
  const ctx = document.getElementById(id).getContext("2d");
  if (window[id]) window[id].destroy();
  window[id] = new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [{
        label: id,
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
