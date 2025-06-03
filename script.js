// script.js

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// Utility function to calculate total staff costsunction calcStaffTotal(ids) {
  return ids.reduce((sum, [countId, salaryId]) => {
    const count = Number(document.getElementById(countId).value) || 0;
    const salary = Number(document.getElementById(salaryId).value) || 0;
    return sum + (count * salary);
  }, 0);
}

function calculatePadel() {
  const courts = Number(document.getElementById('padelCourts').value) || 0;
  const courtCost = Number(document.getElementById('padelCourtCost').value) || 0;
  const ground = Number(document.getElementById('padelGround').value) || 0;
  const structure = Number(document.getElementById('padelStructure').value) || 0;
  const amenities = Number(document.getElementById('padelAmenities').value) || 0;

  const peakHours = Number(document.getElementById('padelPeakHours').value) || 0;
  const peakRate = Number(document.getElementById('padelPeakRate').value) || 0;
  const peakUtil = (Number(document.getElementById('padelPeakUtil').value) || 0) / 100;

  const offHours = Number(document.getElementById('padelOffHours').value) || 0;
  const offRate = Number(document.getElementById('padelOffRate').value) || 0;
  const offUtil = (Number(document.getElementById('padelOffUtil').value) || 0) / 100;

  const days = Number(document.getElementById('padelDays').value) || 0;
  const weeks = Number(document.getElementById('padelWeeks').value) || 0;

  const padelRevenue = courts * (
    (peakHours * peakRate * peakUtil + offHours * offRate * offUtil) * days * weeks
  );

  const overheads = [
    'padelUtil', 'padelInsure', 'padelMaint', 'padelMarket',
    'padelAdmin', 'padelClean', 'padelMisc'
  ].reduce((sum, id) => sum + (Number(document.getElementById(id).value) || 0), 0);

  const staffTotal = calcStaffTotal([
    ['padelFtMgr', 'padelFtMgrSal'],
    ['padelFtRec', 'padelFtRecSal'],
    ['padelFtCoach', 'padelFtCoachSal'],
    ['padelPtCoach', 'padelPtCoachSal'],
    ['padelAddStaff', 'padelAddStaffSal']
  ]);

  const investment = ground + structure + (courts * courtCost) + amenities;
  const totalCost = overheads + staffTotal;
  const profit = padelRevenue - totalCost;

  window.PADEL_DATA = { revenue: padelRevenue, cost: totalCost, profit, investment };

  document.getElementById("padelSummary").innerHTML = `
    <strong>Revenue:</strong> €${padelRevenue.toFixed(2)}<br>
    <strong>Total Cost:</strong> €${totalCost.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}<br>
    <strong>Investment:</strong> €${investment.toFixed(2)}
  `;
}

function calculateGym() {
  const equip = Number(document.getElementById("gymEquip").value) || 0;
  const floor = Number(document.getElementById("gymFloor").value) || 0;
  const amen = Number(document.getElementById("gymAmen").value) || 0;
  const ramp = document.getElementById("gymRamp").checked;

  let weekM = Number(document.getElementById("gymWeekMembers").value) || 0;
  let weekF = Number(document.getElementById("gymWeekFee").value) || 0;
  let monthM = Number(document.getElementById("gymMonthMembers").value) || 0;
  let monthF = Number(document.getElementById("gymMonthFee").value) || 0;
  let yearM = Number(document.getElementById("gymAnnualMembers").value) || 0;
  let yearF = Number(document.getElementById("gymAnnualFee").value) || 0;

  if (ramp) {
    const rampDur = Number(document.getElementById("rampDuration").value) || 6;
    const rampEff = (Number(document.getElementById("rampEffect").value) || 70) / 100;
    const rampFactor = (rampEff + 1) / 2;
    weekM *= rampFactor;
    monthM *= rampFactor;
    yearM *= rampFactor;
  }

  const gymRevenue = (weekM * weekF * 52) + (monthM * monthF * 12) + (yearM * yearF);
  const overheads = [
    'gymUtil', 'gymInsure', 'gymMaint', 'gymMarket',
    'gymAdmin', 'gymClean', 'gymMisc'
  ].reduce((sum, id) => sum + (Number(document.getElementById(id).value) || 0), 0);

  const staffTotal = calcStaffTotal([
    ['gymFtTrainer', 'gymFtTrainerSal'],
    ['gymPtTrainer', 'gymPtTrainerSal'],
    ['gymAddStaff', 'gymAddStaffSal']
  ]);

  const investment = equip + floor + amen;
  const totalCost = overheads + staffTotal;
  const profit = gymRevenue - totalCost;

  window.GYM_DATA = { revenue: gymRevenue, cost: totalCost, profit, investment };

  document.getElementById("gymSummary").innerHTML = `
    <strong>Revenue:</strong> €${gymRevenue.toFixed(2)}<br>
    <strong>Total Cost:</strong> €${totalCost.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}<br>
    <strong>Investment:</strong> €${investment.toFixed(2)}
  `;
}

function updateROI() {
  const totalRevenue = (window.PADEL_DATA?.revenue || 0) + (window.GYM_DATA?.revenue || 0);
  const totalCost = (window.PADEL_DATA?.cost || 0) + (window.GYM_DATA?.cost || 0);
  const investment = (window.PADEL_DATA?.investment || 0) + (window.GYM_DATA?.investment || 0);

  const annualProfit = totalRevenue - totalCost;
  const yearsToROI = investment / (annualProfit || 1);

  document.getElementById("yearsToROIText").innerText = `Estimated ROI: ${yearsToROI.toFixed(1)} years`;

  const roiData = [];
  let cumulative = -investment;
  for (let year = 1; year <= 5; year++) {
    cumulative += annualProfit;
    roiData.push(cumulative);
  }

  renderROICharts(roiData);
  updatePnL();
}

function updatePnL() {
  const toggle = document.querySelector('input[name="pl_toggle"]:checked').value;
  const rev = (window.PADEL_DATA?.revenue || 0) + (window.GYM_DATA?.revenue || 0);
  const cost = (window.PADEL_DATA?.cost || 0) + (window.GYM_DATA?.cost || 0);
  const profit = rev - cost;

  document.getElementById("pnlSummary").innerHTML = `
    <strong>Revenue:</strong> €${rev.toFixed(2)}<br>
    <strong>Costs:</strong> €${cost.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}<br>
    <strong>EBITDA Margin:</strong> ${(profit / rev * 100).toFixed(1)}%
  `;

  renderPnLCharts(rev, cost, profit, toggle);
}

function renderROICharts(data) {
  new Chart(document.getElementById("roiLineChart"), {
    type: "line",
    data: { labels: ["Y1", "Y2", "Y3", "Y4", "Y5"], datasets: [{ label: "Cumulative ROI", data, fill: true, borderColor: "green" }] },
    options: { responsive: true }
  });
}

function renderPnLCharts(rev, cost, profit, mode) {
  new Chart(document.getElementById("pnlChart"), {
    type: "bar",
    data: {
      labels: ["Revenue", "Cost", "Profit"],
      datasets: [{
        label: mode === "monthly" ? "Monthly P&L" : "Annual P&L",
        data: [rev, cost, profit].map(v => mode === "monthly" ? v / 12 : v),
        backgroundColor: ["#36a2eb", "#ff6384", "#4caf50"]
      }]
    },
    options: { responsive: true }
  });
}
