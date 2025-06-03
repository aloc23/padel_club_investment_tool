<script>
// Utility Functions
const getVal = id => parseFloat(document.getElementById(id)?.value) || 0;
const formatEuro = val => `€${val.toLocaleString()}`;

// Padel Calculation
function calculatePadel() {
  const courts = getVal("padelCourts");
  const courtCost = getVal("padelCourtCost");
  const ground = getVal("padelGround");
  const structure = getVal("padelStructure");
  const amenities = getVal("padelAmen") || 0;
  const totalInvestment = courts * courtCost + ground + structure + amenities;

  const peakHrs = getVal("padelPeakHours");
  const offHrs = getVal("padelOffHours");
  const days = getVal("padelDays");
  const weeks = getVal("padelWeeks");
  const peakRev = peakHrs * courts * getVal("padelPeakRate") * (getVal("padelPeakUtil") / 100);
  const offRev = offHrs * courts * getVal("padelOffRate") * (getVal("padelOffUtil") / 100);
  const annualRevenue = (peakRev + offRev) * days * weeks;

  const overheads = getVal("padelUtil") + getVal("padelInsure") + getVal("padelMaint") + getVal("padelMarket") + getVal("padelAdmin") + getVal("padelClean") + getVal("padelMisc");
  const staff = (getVal("padelFtMgr") * getVal("padelFtMgrSal")) + (getVal("padelFtRec") * getVal("padelFtRecSal")) +
                (getVal("padelFtCoach") * getVal("padelFtCoachSal")) + (getVal("padelPtCoach") * getVal("padelPtCoachSal")) +
                (getVal("padelAddStaff") * getVal("padelAddStaffSal"));

  const costs = overheads + staff;
  const profit = annualRevenue - costs;

  document.getElementById("padelSummary").innerHTML = `
    <p><strong>Total Investment:</strong> ${formatEuro(totalInvestment)}</p>
    <p><strong>Annual Revenue:</strong> ${formatEuro(annualRevenue)}</p>
    <p><strong>Annual Costs:</strong> ${formatEuro(costs)}</p>
    <p><strong>Annual Profit:</strong> ${formatEuro(profit)}</p>
  `;

  window.padelData = { investment: totalInvestment, revenue: annualRevenue, cost: costs };
  updatePNL();
}

// Gym Calculation
function calculateGym() {
  const equip = getVal("gymEquip");
  const floor = getVal("gymFloor");
  const amen = getVal("gymAmen");
  const investment = equip + floor + amen;

  const weekRev = getVal("gymWeekMembers") * getVal("gymWeekFee") * 52;
  const monthRev = getVal("gymMonthMembers") * getVal("gymMonthFee") * 12;
  const annualRev = getVal("gymAnnualMembers") * getVal("gymAnnualFee");

  let revenue = weekRev + monthRev + annualRev;

  if (document.getElementById("gymRamp").checked) {
    const duration = getVal("rampDuration");
    const effect = getVal("rampEffect") / 100;
    const ramped = revenue * (duration / 12) * effect;
    const remaining = revenue * ((12 - duration) / 12);
    revenue = ramped + remaining;
  }

  const overheads = getVal("gymUtil") + getVal("gymInsure") + getVal("gymMaint") + getVal("gymMarket") + getVal("gymAdmin") + getVal("gymClean") + getVal("gymMisc");
  const staff = (getVal("gymFtTrainer") * getVal("gymFtTrainerSal")) + (getVal("gymPtTrainer") * getVal("gymPtTrainerSal")) +
                (getVal("gymAddStaff") * getVal("gymAddStaffSal"));
  const costs = overheads + staff;
  const profit = revenue - costs;

  document.getElementById("gymSummary").innerHTML = `
    <p><strong>Total Investment:</strong> ${formatEuro(investment)}</p>
    <p><strong>Annual Revenue:</strong> ${formatEuro(revenue)}</p>
    <p><strong>Annual Costs:</strong> ${formatEuro(costs)}</p>
    <p><strong>Annual Profit:</strong> ${formatEuro(profit)}</p>
  `;

  window.gymData = { investment, revenue, cost: costs };
  updatePNL();
}

function updatePNL() {
  const rev = (window.padelData?.revenue || 0) + (window.gymData?.revenue || 0);
  const cost = (window.padelData?.cost || 0) + (window.gymData?.cost || 0);
  const profit = rev - cost;
  const ebitda = profit; // assuming no interest, tax, dep
  const margin = ((profit / rev) * 100).toFixed(1);

  document.getElementById("pnlSummary").innerHTML = `
    <p><strong>Total Revenue:</strong> ${formatEuro(rev)}</p>
    <p><strong>Total Costs:</strong> ${formatEuro(cost)}</p>
    <p><strong>Profit:</strong> ${formatEuro(profit)}</p>
    <p><strong>EBITDA:</strong> ${formatEuro(ebitda)}</p>
    <p><strong>Net Margin:</strong> ${margin}%</p>
  `;

  drawPNLCharts(rev, cost, profit);
  updateROI(rev, cost);
}

function drawPNLCharts(rev, cost, profit) {
  const ctx = document.getElementById("pnlChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Revenue', 'Cost', 'Profit'],
      datasets: [{ label: 'Amount', data: [rev, cost, profit], backgroundColor: ['#4caf50', '#f44336', '#2196f3'] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

function updateROI(rev = 0, cost = 0) {
  const investment = (window.padelData?.investment || 0) + (window.gymData?.investment || 0);
  if (!rev || !investment) return;

  const annualProfit = rev - cost;
  const roiYear = (investment / annualProfit).toFixed(1);
  document.getElementById("yearsToROIText").innerText = `Estimated Payback Period: ${roiYear} years`;

  const ctx = document.getElementById("roiLineChart").getContext("2d");
  const cumulative = Array.from({length: 10}, (_, i) => annualProfit * (i + 1));
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: 10}, (_, i) => `Year ${i+1}`),
      datasets: [{ label: 'Cumulative Profit', data: cumulative, borderColor: '#2196f3' }]
    },
    options: { responsive: true }
  });
}

function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

document.getElementById("gymRamp").addEventListener("change", function() {
  document.getElementById("rampUpSettings").style.display = this.checked ? "block" : "none";
});
</script>
