// Global chart variables to destroy before redraw
let pnlChart, profitTrendChart, costPieChart;
let roiLineChart, roiBarChart, roiPieChart, roiBreakEvenChart;

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab' + capitalize(tabId)).classList.add('active');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getNum(id) {
  const val = parseFloat(document.getElementById(id).value);
  return isNaN(val) ? 0 : val;
}

// Padel calculations
function calculatePadel() {
  const ground = getNum('padelGround');
  const structure = getNum('padelStructure');
  const courts = getNum('padelCourts');
  const courtCost = getNum('padelCourtCost');
  const amenities = getNum('padelAmen');

  const investment = ground + structure + courts * courtCost + amenities;

  const peakHours = getNum('padelPeakHours');
  const peakRate = getNum('padelPeakRate');
  const peakUtil = getNum('padelPeakUtil') / 100;
  const offHours = getNum('padelOffHours');
  const offRate = getNum('padelOffRate');
  const offUtil = getNum('padelOffUtil') / 100;
  const daysPerWeek = getNum('padelDays');
  const weeksPerYear = getNum('padelWeeks');

  const peakRevenue = peakHours * peakRate * peakUtil * daysPerWeek * weeksPerYear * courts;
  const offRevenue = offHours * offRate * offUtil * daysPerWeek * weeksPerYear * courts;
  const revenue = peakRevenue + offRevenue;

  const util = getNum('padelUtil');
  const insure = getNum('padelInsure');
  const maint = getNum('padelMaint');
  const market = getNum('padelMarket');
  const admin = getNum('padelAdmin');
  const clean = getNum('padelClean');
  const misc = getNum('padelMisc');

  const opCosts = util + insure + maint + market + admin + clean + misc;

  const ftMgr = getNum('padelFtMgr');
  const ftMgrSal = getNum('padelFtMgrSal');
  const ftRec = getNum('padelFtRec');
  const ftRecSal = getNum('padelFtRecSal');
  const ftCoach = getNum('padelFtCoach');
  const ftCoachSal = getNum('padelFtCoachSal');
  const ptCoach = getNum('padelPtCoach');
  const ptCoachSal = getNum('padelPtCoachSal');
  const addStaff = getNum('padelAddStaff');
  const addStaffSal = getNum('padelAddStaffSal');

  const staffCost = ftMgr * ftMgrSal + ftRec * ftRecSal + ftCoach * ftCoachSal + ptCoach * ptCoachSal + addStaff * addStaffSal;

  const totalCosts = opCosts + staffCost;
  const netProfit = revenue - totalCosts;

  document.getElementById('padelSummary').innerHTML = `
    <p><strong>Investment:</strong> €${investment.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Estimated Annual Revenue:</strong> €${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Operational Costs:</strong> €${opCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Staff Costs:</strong> €${staffCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Total Costs:</strong> €${totalCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Net Profit:</strong> €${netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
  `;

  window.padel = { investment, revenue, opCosts, staffCost, totalCosts, netProfit };
}

// Gym calculations
function calculateGym() {
  const equip = getNum('gymEquip');
  const floor = getNum('gymFloor');
  const amenities = getNum('gymAmen');
  const investment = equip + floor + amenities;

  let weeklyMembers = getNum('gymWeekMembers');
  let weeklyFee = getNum('gymWeekFee');
  let monthlyMembers = getNum('gymMonthMembers');
  let monthlyFee = getNum('gymMonthFee');
  let annualMembers = getNum('gymAnnualMembers');
  let annualFee = getNum('gymAnnualFee');

  let baseRevenue = weeklyMembers * weeklyFee * 52 + monthlyMembers * monthlyFee * 12 + annualMembers * annualFee;

  const rampChecked = document.getElementById('gymRamp').checked;
  let revenue = baseRevenue;

  if (rampChecked) {
    const rampDuration = getNum('rampDuration');
    const rampEffect = getNum('rampEffect') / 100;
    revenue = 0;
    for (let month = 1; month <= 12; month++) {
      let monthFactor = month <= rampDuration ? (month / rampDuration) * rampEffect : 1;
      revenue += (baseRevenue / 12) * monthFactor;
    }
  }

  const util = getNum('gymUtil');
  const insure = getNum('gymInsure');
  const maint = getNum('gymMaint');
  const market = getNum('gymMarket');
  const admin = getNum('gymAdmin');
  const clean = getNum('gymClean');
  const misc = getNum('gymMisc');

  const opCosts = util + insure + maint + market + admin + clean + misc;

  const ftTrainer = getNum('gymFtTrainer');
  const ftTrainerSal = getNum('gymFtTrainerSal');
  const ptTrainer = getNum('gymPtTrainer');
  const ptTrainerSal = getNum('gymPtTrainerSal');
  const addStaff = getNum('gymAddStaff');
  const addStaffSal = getNum('gymAddStaffSal');

  const staffCost = ftTrainer * ftTrainerSal + ptTrainer * ptTrainerSal + addStaff * addStaffSal;

  const totalCosts = opCosts + staffCost;
  const netProfit = revenue - totalCosts;

  document.getElementById('gymSummary').innerHTML = `
    <p><strong>Investment:</strong> €${investment.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Estimated Annual Revenue:</strong> €${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Operational Costs:</strong> €${opCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Staff Costs:</strong> €${staffCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Total Costs:</strong> €${totalCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
    <p><strong>Net Profit:</strong> €${netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
  `;

  window.gym = { investment, revenue, opCosts, staffCost, totalCosts, netProfit };
}

function updatePnL() {
  const plToggle = document.querySelector('input[name="pl_toggle"]:checked').value;
  const isMonthly = plToggle === 'monthly';

  const padel = window.padel || {};
  const gym = window.gym || {};

  let totalRevenue = (padel.revenue || 0) + (gym.revenue || 0);
  let totalCosts = (padel.totalCosts || 0) + (gym.totalCosts || 0);
  let netProfit = totalRevenue - totalCosts;

  if (isMonthly) {
    totalRevenue /= 12;
    totalCosts /= 12;
    netProfit /= 12;
  }

  document.getElementById('pnlSummary').innerHTML = `
    <p><strong>Total Revenue:</strong> €${totalRevenue.toFixed(2)}</p>
    <p><strong>Total Costs:</strong> €${totalCosts.toFixed(2)}</p>
    <p><strong>Net Profit:</strong> €${netProfit.toFixed(2)}</p>
  `;

  drawPnLCharts(totalRevenue, totalCosts, netProfit);
}

function drawPnLCharts(revenue, costs, profit) {
  if (pnlChart) pnlChart.destroy();

  const ctx = document.getElementById('pnlChart').getContext('2d');
  pnlChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Revenue', 'Costs', 'Profit'],
      datasets: [{
        label: 'Amount (€)',
        data: [revenue, costs, profit],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

function updateROI() {
  const padel = window.padel || {};
  const gym = window.gym || {};

  const investment = (padel.investment || 0) + (gym.investment || 0);
  const baseRevenue = (padel.revenue || 0) + (gym.revenue || 0);
  const baseCosts = (padel.totalCosts || 0) + (gym.totalCosts || 0);

  const revAdjustPct = parseFloat(document.getElementById('revAdjust').value) / 100;
  const costAdjustPct = parseFloat(document.getElementById('costAdjust').value) / 100;

  document.getElementById('revAdjustVal').textContent = (revAdjustPct * 100).toFixed(0) + '%';
  document.getElementById('costAdjustVal').textContent = (costAdjustPct * 100).toFixed(0) + '%';

  const adjustedRevenue = baseRevenue * (1 + revAdjustPct);
  const adjustedCosts = baseCosts * (1 + costAdjustPct);
  const profit = adjustedRevenue - adjustedCosts;

  let cumulativeProfit = 0;
  let paybackYear = null;
  let paybackData = [];

  for (let year = 1; year <= 10; year++) {
    cumulativeProfit += profit;
    paybackData.push({ year, cumulativeProfit, investment });
    if (!paybackYear && cumulativeProfit >= investment) paybackYear = year;
  }

  const roiYear1 = paybackData[0].cumulativeProfit / investment * 100 || 0;
  const roiYear3 = paybackData[2].cumulativeProfit / investment * 100 || 0;
  const roiYear5 = paybackData[4].cumulativeProfit / investment * 100 || 0;

  document.getElementById('roiSummary').innerHTML = `
    <p><strong>Estimated Payback Period:</strong> ${paybackYear ? paybackYear + ' year(s)' : 'Not reached within 10 years'}</p>
    <p><strong>ROI Year 1:</strong> ${roiYear1.toFixed(1)}%</p>
    <p><strong>ROI Year 3:</strong> ${roiYear3.toFixed(1)}%</p>
    <p><strong>ROI Year 5:</strong> ${roiYear5.toFixed(1)}%</p>
  `;

  const tbody = document.querySelector('#paybackTable tbody');
  tbody.innerHTML = '';
  paybackData.forEach(({ year, cumulativeProfit, investment }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${year}</td>
      <td>€${cumulativeProfit.toFixed(2)}</td>
      <td>€${investment.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  drawROICharts(paybackData, investment, profit);
}

function drawROICharts(paybackData, investment, profit) {
  if (roiLineChart) roiLineChart.destroy();
  if (roiBarChart) roiBarChart.destroy();
  if (roiPieChart) roiPieChart.destroy();
  if (roiBreakEvenChart) roiBreakEvenChart.destroy();

  const ctxLine = document.getElementById('roiLineChart').getContext('2d');
  roiLineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: paybackData.map(d => 'Year ' + d.year),
      datasets: [
        {
          label: 'Cumulative Profit',
          data: paybackData.map(d => d.cumulativeProfit),
          borderColor: '#4caf50',
          fill: true,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.3,
        },
        {
          label: 'Investment',
          data: paybackData.map(d => d.investment),
          borderColor: '#f44336',
          borderDash: [5, 5],
          fill: false,
          tension: 0.3,
        }
      ]
    },
    options: { responsive: true }
  });

  const ctxBar = document.getElementById('roiBarChart').getContext('2d');
  roiBarChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: paybackData.map(d => 'Year ' + d.year),
      datasets: [{
        label: 'Annual Profit',
        data: Array(paybackData.length).fill(profit),
        backgroundColor: '#2196f3',
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  const ctxPie = document.getElementById('roiPieChart').getContext('2d');
  roiPieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['Investment', 'Profit Year 1'],
      datasets: [{
        data: [paybackData[0].investment, profit],
        backgroundColor: ['#f44336', '#4caf50']
      }]
    },
    options: { responsive: true }
  });

  const ctxBreak = document.getElementById('roiBreakEvenChart').getContext('2d');
  roiBreakEvenChart = new Chart(ctxBreak, {
    type: 'line',
    data: {
      labels: paybackData.map(d => 'Year ' + d.year),
      datasets: [
        {
          label: 'Cumulative Profit',
          data: paybackData.map(d => d.cumulativeProfit),
          borderColor: '#4caf50',
          fill: true,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.3,
        },
        {
          label: 'Investment',
          data: paybackData.map(d => d.investment),
          borderColor: '#f44336',
          borderDash: [5, 5],
          fill: false,
          tension: 0.3,
        }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

function toggleRampUp() {
  const rampSettings = document.getElementById('rampUpSettings');
  rampSettings.classList.toggle('hidden');
  calculateGym();
  updateROI();
  updatePnL();
}

function updateRampLabels() {
  document.getElementById('rampDurationVal').textContent = document.getElementById('rampDuration').value;
  document.getElementById('rampEffectVal').textContent = document.getElementById('rampEffect').value;
}

window.onload = function () {
  showTab('padel');
  calculatePadel();
  calculateGym();
  updatePnL();
  updateROI();
};
