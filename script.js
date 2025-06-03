// script.js

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

function calculatePadel() {
  const ground = +document.getElementById('padelGround').value;
  const structure = +document.getElementById('padelStructure').value;
  const amenities = +document.getElementById('padelAmen').value;
  const courts = +document.getElementById('padelCourts').value;
  const courtCost = +document.getElementById('padelCourtCost').value;

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

  const staffTotal =
    (+document.getElementById('padelFtMgr').value * +document.getElementById('padelFtMgrSal').value) +
    (+document.getElementById('padelFtRec').value * +document.getElementById('padelFtRecSal').value) +
    (+document.getElementById('padelFtCoach').value * +document.getElementById('padelFtCoachSal').value) +
    (+document.getElementById('padelPtCoach').value * +document.getElementById('padelPtCoachSal').value) +
    (+document.getElementById('padelAddStaff').value * +document.getElementById('padelAddStaffSal').value);

  const investment = ground + structure + amenities + (courts * courtCost);

  const annualRevenue = courts * weeks * days * (
    (peakHours * peakRate * peakUtil) + (offHours * offRate * offUtil)
  );

  const operationalCost = utilCost + insure + maint + market + admin + clean + misc + staffTotal;

  document.getElementById('padelSummary').innerHTML =
    `<p><strong>Investment:</strong> €${investment.toLocaleString()}</p>` +
    `<p><strong>Annual Revenue:</strong> €${annualRevenue.toLocaleString()}</p>` +
    `<p><strong>Annual Operational Cost:</strong> €${operationalCost.toLocaleString()}</p>`;

  window.padelData = { investment, annualRevenue, operationalCost };
  updatePNL();
}

function calculateGym() {
  const equip = +document.getElementById('gymEquip').value;
  const floor = +document.getElementById('gymFloor').value;
  const amen = +document.getElementById('gymAmen').value;
  const rampChecked = document.getElementById('gymRamp').checked;

  const weekMem = +document.getElementById('gymWeekMembers').value;
  const weekFee = +document.getElementById('gymWeekFee').value;
  const monthMem = +document.getElementById('gymMonthMembers').value;
  const monthFee = +document.getElementById('gymMonthFee').value;
  const yearMem = +document.getElementById('gymAnnualMembers').value;
  const yearFee = +document.getElementById('gymAnnualFee').value;

  const util = +document.getElementById('gymUtil').value;
  const insure = +document.getElementById('gymInsure').value;
  const maint = +document.getElementById('gymMaint').value;
  const market = +document.getElementById('gymMarket').value;
  const admin = +document.getElementById('gymAdmin').value;
  const clean = +document.getElementById('gymClean').value;
  const misc = +document.getElementById('gymMisc').value;

  const staffTotal =
    (+document.getElementById('gymFtTrainer').value * +document.getElementById('gymFtTrainerSal').value) +
    (+document.getElementById('gymPtTrainer').value * +document.getElementById('gymPtTrainerSal').value) +
    (+document.getElementById('gymAddStaff').value * +document.getElementById('gymAddStaffSal').value);

  let revenue = (
    (weekMem * weekFee * 52) +
    (monthMem * monthFee * 12) +
    (yearMem * yearFee)
  );

  if (rampChecked) {
    const rampDuration = +document.getElementById('rampDuration').value;
    const rampEffect = +document.getElementById('rampEffect').value / 100;
    const rampMonths = rampDuration;
    const normalMonths = 12 - rampMonths;
    const avgRampRev = revenue * rampEffect * rampMonths / 12;
    const normalRev = revenue * normalMonths / 12;
    revenue = avgRampRev + normalRev;
  }

  const investment = equip + floor + amen;
  const operationalCost = util + insure + maint + market + admin + clean + misc + staffTotal;

  document.getElementById('gymSummary').innerHTML =
    `<p><strong>Investment:</strong> €${investment.toLocaleString()}</p>` +
    `<p><strong>Annual Revenue:</strong> €${revenue.toLocaleString()}</p>` +
    `<p><strong>Annual Operational Cost:</strong> €${operationalCost.toLocaleString()}</p>`;

  window.gymData = { investment, annualRevenue: revenue, operationalCost };
  updatePNL();
}

function updatePNL() {
  const padel = window.padelData || {};
  const gym = window.gymData || {};

  const totalRev = (padel.annualRevenue || 0) + (gym.annualRevenue || 0);
  const totalCost = (padel.operationalCost || 0) + (gym.operationalCost || 0);
  const profit = totalRev - totalCost;
  const margin = totalRev ? ((profit / totalRev) * 100).toFixed(1) : 0;

  document.getElementById('pnlSummary').innerHTML =
    `<p><strong>Total Revenue:</strong> €${totalRev.toLocaleString()}</p>` +
    `<p><strong>Total Cost:</strong> €${totalCost.toLocaleString()}</p>` +
    `<p><strong>Profit:</strong> €${profit.toLocaleString()} (${margin}%)</p>`;

  drawCharts(totalRev, totalCost, profit);
  updateROI();
}

function drawCharts(rev, cost, profit) {
  const ctx = document.getElementById('pnlChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Revenue', 'Costs', 'Profit'],
      datasets: [{
        label: '€',
        data: [rev, cost, profit],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  const pieCtx = document.getElementById('costPieChart').getContext('2d');
  new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Revenue', 'Costs'],
      datasets: [{
        data: [rev, cost],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      responsive: true
    }
  });
}

function updateROI() {
  const padel = window.padelData || {};
  const gym = window.gymData || {};

  const totalInvestment = (padel.investment || 0) + (gym.investment || 0);
  const totalRevenue = (padel.annualRevenue || 0) + (gym.annualRevenue || 0);
  const totalCost = (padel.operationalCost || 0) + (gym.operationalCost || 0);
  const profit = totalRevenue - totalCost;

  let years = 0, cumulative = 0;
  while (cumulative < totalInvestment && years < 30) {
    cumulative += profit;
    years++;
  }

  document.getElementById('roiSummary').innerHTML =
    `<p><strong>Total Investment:</strong> €${totalInvestment.toLocaleString()}</p>` +
    `<p><strong>Annual Profit:</strong> €${profit.toLocaleString()}</p>` +
    `<p><strong>Years to ROI:</strong> ${years}</p>`;
}
