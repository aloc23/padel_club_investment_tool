// Tab navigation
function showTab(tab) {
  const tabs = ['padel', 'gym', 'pnl', 'roi'];
  tabs.forEach(t => {
    document.getElementById(t).classList.toggle('hidden', t !== tab);
    document.getElementById('tab' + capitalize(t)).classList.toggle('active', t === tab);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate Padel revenue
function calculatePadelRevenue() {
  const peakHours = Number(document.getElementById('padelPeakHours').value) || 0;
  const peakRate = Number(document.getElementById('padelPeakRate').value) || 0;
  const peakUtil = Number(document.getElementById('padelPeakUtil').value) / 100 || 0;

  const offHours = Number(document.getElementById('padelOffHours').value) || 0;
  const offRate = Number(document.getElementById('padelOffRate').value) || 0;
  const offUtil = Number(document.getElementById('padelOffUtil').value) / 100 || 0;

  const days = Number(document.getElementById('padelDays').value) || 0;
  const weeks = Number(document.getElementById('padelWeeks').value) || 0;

  const peakRev = peakHours * peakRate * peakUtil * days * weeks;
  const offRev = offHours * offRate * offUtil * days * weeks;

  return peakRev + offRev;
}

// Calculate Gym revenue (weekly, monthly, annual memberships)
function calculateGymRevenue() {
  const wMembers = Number(document.getElementById('gymWeekMembers').value) || 0;
  const wFee = Number(document.getElementById('gymWeekFee').value) || 0;
  const mMembers = Number(document.getElementById('gymMonthMembers').value) || 0;
  const mFee = Number(document.getElementById('gymMonthFee').value) || 0;
  const aMembers = Number(document.getElementById('gymAnnualMembers').value) || 0;
  const aFee = Number(document.getElementById('gymAnnualFee').value) || 0;

  // Annual fee divided by 12 to get monthly, multiply by 12 for yearly revenue
  const weeklyRev = wMembers * wFee * 52; // 52 weeks
  const monthlyRev = mMembers * mFee * 12; // 12 months
  const annualRev = aMembers * aFee;

  return weeklyRev + monthlyRev + annualRev;
}

// Calculate Padel Costs (Overhead + Staff)
function calculatePadelCosts() {
  const overheads = ['padelUtil', 'padelInsure', 'padelMaint', 'padelMarket', 'padelAdmin', 'padelClean', 'padelMisc', 'padelAmen'];
  let totalOverhead = 0;
  overheads.forEach(id => {
    totalOverhead += Number(document.getElementById(id).value) || 0;
  });

  let staffCost = 0;
  staffCost += (Number(document.getElementById('padelFtMgr').value) || 0) * (Number(document.getElementById('padelFtMgrSal').value) || 0);
  staffCost += (Number(document.getElementById('padelFtRec').value) || 0) * (Number(document.getElementById('padelFtRecSal').value) || 0);
  staffCost += (Number(document.getElementById('padelFtCoach').value) || 0) * (Number(document.getElementById('padelFtCoachSal').value) || 0);
  staffCost += (Number(document.getElementById('padelPtCoach').value) || 0) * (Number(document.getElementById('padelPtCoachSal').value) || 0);
  staffCost += (Number(document.getElementById('padelAddStaff').value) || 0) * (Number(document.getElementById('padelAddStaffSal').value) || 0);

  return totalOverhead + staffCost;
}

// Calculate Gym Costs (Overhead + Staff)
function calculateGymCosts() {
  const overheads = ['gymUtil', 'gymInsure', 'gymMaint', 'gymMarket', 'gymAdmin', 'gymClean', 'gymMisc', 'gymAmen'];
  let totalOverhead = 0;
  overheads.forEach(id => {
    totalOverhead += Number(document.getElementById(id).value) || 0;
  });

  let staffCost = 0;
  staffCost += (Number(document.getElementById('gymFtTrainer').value) || 0) * (Number(document.getElementById('gymFtTrainerSal').value) || 0);
  staffCost += (Number(document.getElementById('gymPtTrainer').value) || 0) * (Number(document.getElementById('gymPtTrainerSal').value) || 0);
  staffCost += (Number(document.getElementById('gymAddStaff').value) || 0) * (Number(document.getElementById('gymAddStaffSal').value) || 0);

  return totalOverhead + staffCost;
}

// Calculate and update Padel summary
function calculatePadel() {
  const revenue = calculatePadelRevenue();
  const costs = calculatePadelCosts();
  const profit = revenue - costs;
  document.getElementById('padelSummary').innerHTML = `
    <p>Revenue: €${revenue.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p>Costs: €${costs.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p>Profit: €${profit.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
  `;
}

// Calculate and update Gym summary
function calculateGym() {
  const revenue = calculateGymRevenue();
  const costs = calculateGymCosts();
  const profit = revenue - costs;
  document.getElementById('gymSummary').innerHTML = `
    <p>Revenue: €${revenue.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p>Costs: €${costs.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p>Profit: €${profit.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
  `;
}

// P&L update with charts and monthly breakdown
function updatePnL() {
  const plMode = document.querySelector('input[name="pl_toggle"]:checked').value;

  const padelRevenue = calculatePadelRevenue();
  const gymRevenue = calculateGymRevenue();
  const totalRevenue = padelRevenue + gymRevenue;

  const padelCosts = calculatePadelCosts();
  const gymCosts = calculateGymCosts();
  const totalCosts = padelCosts + gymCosts;

  const ebitda = totalRevenue - totalCosts;
  const netMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;

  // Update summary box
  const summaryDiv = document.getElementById('pnlSummary');
  summaryDiv.innerHTML = `
    <p><strong>Total Revenue:</strong> €${totalRevenue.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p><strong>Total Costs:</strong> €${totalCosts.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p><strong>EBITDA:</strong> €${ebitda.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
    <p><strong>Net Margin:</strong> ${netMargin.toFixed(2)}%</p>
  `;

  // Prepare data for charts
  let revenueData, costsData, profitData;
  if (plMode === 'annual') {
    revenueData = [totalRevenue];
    costsData = [totalCosts];
    profitData = [ebitda];
  } else {
    revenueData = new Array(12).fill(totalRevenue / 12);
    costsData = new Array(12).fill(totalCosts / 12);
    profitData = new Array(12).fill(ebitda / 12);
  }

  drawPnLCharts(revenueData, costsData, profitData);
  populateMonthlyBreakdownTable(revenueData, costsData, profitData);
}

// Draw P&L charts
function drawPnLCharts(revenueData, costsData, profitData) {
  if (window.pnlChart) window.pnlChart.destroy();
  if (window.profitTrendChart) window.profitTrendChart.destroy();
  if (window.costPieChart) window.costPieChart.destroy();

  const labels = revenueData.length === 1
    ? ['Year']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Line chart: Revenue, Costs, Profit
  const ctx1 = document.getElementById('pnlChart').getContext('2d');
  window.pnlChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Revenue', data: revenueData, borderColor: 'green', fill: false, tension: 0.3 },
        { label: 'Costs', data: costsData, borderColor: 'red', fill: false, tension: 0.3 },
        { label: 'Profit', data: profitData, borderColor: 'blue', fill: false, tension: 0.3 }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  });

  // Bar chart: Profit trend
  const ctx2 = document.getElementById('profitTrendChart').getContext('2d');
  window.profitTrendChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{ label: 'Profit', data: profitData, backgroundColor: 'blue' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Pie chart: Revenue vs Costs vs Profit
  const ctx3 = document.getElementById('costPieChart').getContext('2d');
  window.costPieChart = new Chart(ctx3, {
    type: 'pie',
    data: {
      labels: ['Revenue', 'Costs', 'Profit'],
      datasets: [{
        data: [
          revenueData.reduce((a,b) => a+b, 0),
          costsData.reduce((a,b) => a+b, 0),
          profitData.reduce((a,b) => a+b, 0)
        ],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3']
      }]
    },
    options: { responsive: true }
  });
}

// Populate monthly breakdown table
function populateMonthlyBreakdownTable(revenueData, costsData, profitData) {
  const tbody = document.querySelector('#monthlyBreakdown tbody');
  tbody.innerHTML = '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for(let i=0; i<revenueData.length; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${months[i] || 'Year'}</td>
      <td>€${revenueData[i].toFixed(2)}</td>
      <td>€${costsData[i].toFixed(2)}</td>
      <td>€${profitData[i].toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  }
}

// ROI Calculation & update with monthly ramp-up
function updateROI() {
  const padelInvestment = (Number(document.getElementById('padelGround').value) || 0) +
    (Number(document.getElementById('padelStructure').value) || 0) +
    ((Number(document.getElementById('padelCourts').value) || 0) * (Number(document.getElementById('padelCourtCost').value) || 0)) +
    (Number(document.getElementById('padelAmen').value) || 0);

  const gymInvestment = (Number(document.getElementById('gymEquip').value) || 0) +
    (Number(document.getElementById('gymFloor').value) || 0) +
    (Number(document.getElementById('gymAmen').value) || 0);

  const totalInvestment = padelInvestment + gymInvestment;

  // Monthly padel profit (annual / 12)
  const padelProfitMonthly = (calculatePadelRevenue() - calculatePadelCosts()) / 12;

  // Gym monthly revenue and costs with ramp-up
  const wMembers = Number(document.getElementById('gymWeekMembers').value) || 0;
  const wFee = Number(document.getElementById('gymWeekFee').value) || 0;
  const mMembers = Number(document.getElementById('gymMonthMembers').value) || 0;
  const mFee = Number(document.getElementById('gymMonthFee').value) || 0;
  const aMembers = Number(document.getElementById('gymAnnualMembers').value) || 0;
  const aFee = Number(document.getElementById('gymAnnualFee').value) || 0;

  const overheads = calculateGymCosts();

  const applyRamp = document.getElementById('gymRamp').checked;
  const rampDuration = Number(document.getElementById('rampDuration').value) || 6;
  const rampEffectiveness = (Number(document.getElementById('rampEffect').value) || 70) / 100;

  // Monthly gym revenue without ramp-up
  const monthlyWeeklyRev = wMembers * wFee * (52/12);
  const monthlyMonthlyRev = mMembers * mFee;
  const monthlyAnnualRev = aMembers * aFee / 12;
  const monthlyTotalRev = monthlyWeeklyRev + monthlyMonthlyRev + monthlyAnnualRev;

  // Monthly gym costs (assumed monthly as overhead + staff / 12)
  const monthlyGymCosts = overheads / 12;

  // Monthly gym profit array with ramp-up
  let monthlyGymProfits = [];
  for (let month = 1; month <= 12; month++) {
    let rampFactor = 1;
    if (applyRamp && month <= rampDuration) {
      rampFactor = (rampEffectiveness * (month / rampDuration)) + (1 - rampEffectiveness);
    }
    const profit = (monthlyTotalRev * rampFactor) - monthlyGymCosts;
    monthlyGymProfits.push(profit);
  }

  // Monthly padel profit array (constant)
  let monthlyPadelProfits = new Array(12).fill(padelProfitMonthly);

  // Total monthly profit combined
  let totalMonthlyProfits = monthlyGymProfits.map((gProfit, i) => gProfit + monthlyPadelProfits[i]);

  // Calculate cumulative ROI monthly
  let cumulativeROI = [];
  let cumProfit = 0;
  let breakevenMonth = null;
  for (let i = 0; i < 12; i++) {
    cumProfit += totalMonthlyProfits[i];
    cumulativeROI.push((cumProfit / totalInvestment) * 100);
    if (breakevenMonth === null && cumProfit >= totalInvestment) {
      breakevenMonth = i + 1;
    }
  }

  // Update ROI summary text
  let breakevenText = breakevenMonth ? `${breakevenMonth} month(s)` : 'Not within 12 months';
  document.getElementById('roiSummary').innerText =
    `Total Investment: €${totalInvestment.toLocaleString(undefined, {minimumFractionDigits:2})}\n` +
    `Breakeven (Payback) Time: ${breakevenText}`;

  drawROICharts(cumulativeROI);
}

// Draw ROI chart
function drawROICharts(cumulativeROI) {
  if (window.roiLineChart) window.roiLineChart.destroy();

  const ctx = document.getElementById('roiLineChart').getContext('2d');
  window.roiLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cumulativeROI.length ? Array.from({length: cumulativeROI.length}, (_, i) => `Month ${i+1}`) : ['N/A'],
      datasets: [{
        label: 'Cumulative ROI (%)',
        data: cumulativeROI.length ? cumulativeROI : [0],
        borderColor: 'orange',
        fill: false,
        tension: 0.3,
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
  });
}

// Show/hide ramp settings
function toggleRampSettings() {
  const rampCheckbox = document.getElementById('gymRamp');
  document.getElementById('rampUpSettings').style.display = rampCheckbox.checked ? 'block' : 'none';
}

// Update ramp sliders display
function updateRampSliders() {
  document.getElementById('rampDurationVal').textContent = document.getElementById('rampDuration').value;
  document.getElementById('rampEffectVal').textContent = document.getElementById('rampEffect').value;
}

// Hook inputs and buttons for events
function hookInputEvents() {
  document.getElementById('btnCalculatePadel').addEventListener('click', () => {
    calculatePadel();
    updatePnL();
    updateROI();
  });
  document.getElementById('btnCalculateGym').addEventListener('click', () => {
    calculateGym();
    updatePnL();
    updateROI();
  });

  document.getElementById('gymRamp').addEventListener('change', toggleRampSettings);
  document.getElementById('rampDuration').addEventListener('input', updateRampSliders);
  document.getElementById('rampEffect').addEventListener('input', updateRampSliders);

  document.querySelectorAll('input[name="pl_toggle"]').forEach(radio => {
    radio.addEventListener('change', updatePnL);
  });

  document.getElementById('tabPadel').addEventListener('click', () => showTab('padel'));
  document.getElementById('tabGym').addEventListener('click', () => showTab('gym'));
  document.getElementById('tabPnL').addEventListener('click', () => showTab('pnl'));
  document.getElementById('tabROI').addEventListener('click', () => showTab('roi'));
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  hookInputEvents();
  showTab('padel');
  toggleRampSettings();
  updateRampSliders();
  calculatePadel();
  calculateGym();
  updatePnL();
  updateROI();
});
