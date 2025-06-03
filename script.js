function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}

function calculatePadel() {
  const courts = +document.getElementById('padelCourts').value;
  const courtCost = +document.getElementById('padelCourtCost').value;
  const structure = +document.getElementById('padelStructure').value;
  const ground = +document.getElementById('padelGround').value;

  const peakHours = +document.getElementById('padelPeakHours').value;
  const peakRate = +document.getElementById('padelPeakRate').value;
  const peakUtil = +document.getElementById('padelPeakUtil').value / 100;

  const offHours = +document.getElementById('padelOffHours').value;
  const offRate = +document.getElementById('padelOffRate').value;
  const offUtil = +document.getElementById('padelOffUtil').value / 100;

  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;

  const utilCost = +document.getElementById('padelUtil').value;
  const insure = +document.getElementById('padelInsure').value;
  const maint = +document.getElementById('padelMaint').value;
  const market = +document.getElementById('padelMarket').value;
  const admin = +document.getElementById('padelAdmin').value;
  const clean = +document.getElementById('padelClean').value;
  const misc = +document.getElementById('padelMisc').value;

  const staffCost = (
    +document.getElementById('padelFtMgr').value * +document.getElementById('padelFtMgrSal').value +
    +document.getElementById('padelFtRec').value * +document.getElementById('padelFtRecSal').value +
    +document.getElementById('padelFtCoach').value * +document.getElementById('padelFtCoachSal').value +
    +document.getElementById('padelPtCoach').value * +document.getElementById('padelPtCoachSal').value +
    +document.getElementById('padelAddStaff').value * +document.getElementById('padelAddStaffSal').value
  );

  const padelRevenue = courts * (
    (peakHours * peakRate * peakUtil + offHours * offRate * offUtil) * days * weeks
  );

  const padelInvestment = ground + structure + courts * courtCost;
  const padelOperational = utilCost + insure + maint + market + admin + clean + misc + staffCost;

  window.padelData = { padelInvestment, padelRevenue, padelOperational };
  document.getElementById('padelSummary').innerText = `
    Revenue: €${padelRevenue.toFixed(2)} | 
    Operating: €${padelOperational.toFixed(2)} | 
    Investment: €${padelInvestment.toFixed(2)}
  `;
}

function calculateGym() {
  const equip = +document.getElementById('gymEquip').value;
  const floor = +document.getElementById('gymFloor').value;
  const amen = +document.getElementById('gymAmen').value;

  const weekMembers = +document.getElementById('gymWeekMembers').value;
  const weekFee = +document.getElementById('gymWeekFee').value;
  const monthMembers = +document.getElementById('gymMonthMembers').value;
  const monthFee = +document.getElementById('gymMonthFee').value;
  const yearMembers = +document.getElementById('gymAnnualMembers').value;
  const yearFee = +document.getElementById('gymAnnualFee').value;

  const ramp = document.getElementById('gymRamp').checked;
  const rampDuration = +document.getElementById('rampDuration').value;
  const rampEffect = +document.getElementById('rampEffect').value / 100;

  let gymRevenue = (
    weekMembers * weekFee * 52 +
    monthMembers * monthFee * 12 +
    yearMembers * yearFee
  );

  if (ramp) {
    const rampMonths = rampDuration;
    const rampFactor = (rampEffect * rampMonths + (12 - rampMonths) * 1) / 12;
    gymRevenue *= rampFactor;
  }

  const util = +document.getElementById('gymUtil').value;
  const insure = +document.getElementById('gymInsure').value;
  const maint = +document.getElementById('gymMaint').value;
  const market = +document.getElementById('gymMarket').value;
  const admin = +document.getElementById('gymAdmin').value;
  const clean = +document.getElementById('gymClean').value;
  const misc = +document.getElementById('gymMisc').value;

  const staffCost = (
    +document.getElementById('gymFtTrainer').value * +document.getElementById('gymFtTrainerSal').value +
    +document.getElementById('gymPtTrainer').value * +document.getElementById('gymPtTrainerSal').value +
    +document.getElementById('gymAddStaff').value * +document.getElementById('gymAddStaffSal').value
  );

  const gymInvestment = equip + floor + amen;
  const gymOperational = util + insure + maint + market + admin + clean + misc + staffCost;

  window.gymData = { gymInvestment, gymRevenue, gymOperational };
  document.getElementById('gymSummary').innerText = `
    Revenue: €${gymRevenue.toFixed(2)} | 
    Operating: €${gymOperational.toFixed(2)} | 
    Investment: €${gymInvestment.toFixed(2)}
  `;
}

function updateROI() {
  const revAdj = +document.getElementById('revenueAdjust').value / 100;
  const costAdj = +document.getElementById('costAdjust').value / 100;

  const rev = (window.padelData?.padelRevenue || 0) + (window.gymData?.gymRevenue || 0);
  const cost = (window.padelData?.padelOperational || 0) + (window.gymData?.gymOperational || 0);
  const inv = (window.padelData?.padelInvestment || 0) + (window.gymData?.gymInvestment || 0);

  const adjRev = rev * revAdj;
  const adjCost = cost * costAdj;
  const profit = adjRev - adjCost;
  const roi = profit / inv;
  const ebitda = profit;
  const margin = (profit / adjRev) * 100;

  document.getElementById('roiSummary').innerText = `
    Adjusted Revenue: €${adjRev.toFixed(2)} | 
    Adjusted Cost: €${adjCost.toFixed(2)} | 
    Profit: €${profit.toFixed(2)} | 
    ROI: ${(roi * 100).toFixed(1)}% | 
    EBITDA: €${ebitda.toFixed(2)} | 
    Net Margin: ${margin.toFixed(1)}%
  `;

  drawPaybackTable(inv, adjRev, adjCost);
}

function drawPaybackTable(inv, rev, cost) {
  const container = document.getElementById("paybackTableContainer");
  let cumProfit = 0;
  let table = `<table><tr><th>Year</th><th>Cumulative Profit (€)</th></tr>`;
  for (let y = 1; y <= 5; y++) {
    cumProfit += (rev - cost);
    table += `<tr><td>${y}</td><td>${cumProfit.toFixed(2)}</td></tr>`;
  }
  table += "</table>";
  container.innerHTML = table;
}

function toggleMonthlyDetails() {
  const div = document.getElementById("monthlyTableContainer");
  div.style.display = div.style.display === "none" ? "block" : "none";

  const rev = (window.padelData?.padelRevenue || 0) + (window.gymData?.gymRevenue || 0);
  const cost = (window.padelData?.padelOperational || 0) + (window.gymData?.gymOperational || 0);

  let table = `<table><tr><th>Month</th><th>Revenue</th><th>Cost</th><th>Profit</th></tr>`;
  for (let m = 1; m <= 12; m++) {
    const r = (rev / 12).toFixed(2);
    const c = (cost / 12).toFixed(2);
    const p = (r - c).toFixed(2);
    table += `<tr><td>${m}</td><td>€${r}</td><td>€${c}</td><td>€${p}</td></tr>`;
  }
  table += "</table>";
  div.innerHTML = table;
}
