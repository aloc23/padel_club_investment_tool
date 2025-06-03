// Global variables for charts
let pnlChart, profitTrendChart, costPieChart;
let roiLineChart, roiBarChart, roiPieChart, roiBreakEvenChart;

function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.disabled = false;
  });
  document.getElementById(id).style.display = 'block';
  document.querySelector(`.tabs button[onclick="showTab('${id}')"]`).disabled = true;
}

// --- Padel Calculations ---
function calculatePadel() {
  const courts = +document.getElementById('padelCourts').value || 0;
  const courtCost = +document.getElementById('padelCourtCost').value || 0;
  const ground = +document.getElementById('padelGround').value || 0;
  const structure = +document.getElementById('padelStructure').value || 0;

  // Revenue Inputs
  const peakHours = +document.getElementById('padelPeakHours').value || 0;
  const peakRate = +document.getElementById('padelPeakRate').value || 0;
  const peakUtil = (+document.getElementById('padelPeakUtil').value || 0) / 100;
  const offHours = +document.getElementById('padelOffHours').value || 0;
  const offRate = +document.getElementById('padelOffRate').value || 0;
  const offUtil = (+document.getElementById('padelOffUtil').value || 0) / 100;
  const days = +document.getElementById('padelDays').value || 0;
  const weeks = +document.getElementById('padelWeeks').value || 0;

  const totalRevenue = courts * days * weeks * (
    (peakHours * peakRate * peakUtil) + (offHours * offRate * offUtil)
  );

  // Operational Costs
  const util = +document.getElementById('padelUtil').value || 0;
  const insure = +document.getElementById('padelInsure').value || 0;
  const maint = +document.getElementById('padelMaint').value || 0;
  const market = +document.getElementById('padelMarket').value || 0;
  const admin = +document.getElementById('padelAdmin').value || 0;
  const clean = +document.getElementById('padelClean').value || 0;
  const misc = +document.getElementById('padelMisc').value || 0;
  const operationalCosts = util + insure + maint + market + admin + clean + misc;

  // Staff costs
  const mgrCost = (+document.getElementById('padelFtMgr').value || 0) * (+document.getElementById('padelFtMgrSal').value || 0);
  const recCost = (+document.getElementById('padelFtRec').value || 0) * (+document.getElementById('padelFtRecSal').value || 0);
  const ftCoachCost = (+document.getElementById('padelFtCoach').value || 0) * (+document.getElementById('padelFtCoachSal').value || 0);
  const ptCoachCost = (+document.getElementById('padelPtCoach').value || 0) * (+document.getElementById('padelPtCoachSal').value || 0);
  const addStaffCost = (+document.getElementById('padelAddStaff').value || 0) * (+document.getElementById('padelAddStaffSal').value || 0);
  const totalStaffCost = mgrCost + recCost + ftCoachCost + ptCoachCost + addStaffCost;

  // Investment costs
  const investment = ground + structure + (courts * courtCost);

  // Summary display
  document.getElementById('padelSummary').innerHTML = `
    <p><strong>Revenue:</strong> €${totalRevenue.toFixed(2)}</p>
    <p><strong>Operational Costs:</strong> €${operationalCosts.toFixed(2)}</p>
    <p><strong>Staff Costs:</strong> €${totalStaffCost.toFixed(2)}</p>
    <p><strong>Investment Cost:</strong> €${investment.toFixed(2)}</p>
  `;

  window.padelData = {
    revenue: totalRevenue,
    costs: operationalCosts + totalStaffCost,
    investment: investment,
  };
}

// --- Gym Calculations ---
function calculateGym() {
  // Investment
  const equip = +document.getElementById('gymEquip').value || 0;
  const floor = +document.getElementById('gymFloor').value || 0;
  const amen = +document.getElementById('gymAmen').value || 0;
  const investment = equip + floor + amen;

  // Revenue Inputs
  const weeklyMembers = +document.getElementById('gymWeekMembers').value || 0;
  const weeklyFee = +document.getElementById('gymWeekFee').value || 0;
  const monthlyMembers = +document.getElementById('gymMonthMembers').value || 0;
  const monthlyFee = +document.getElementById('gymMonthFee').value || 0;
  const annualMembers = +document.getElementById('gymAnnualMembers').value || 0;
  const annualFee = +document.getElementById('gymAnnualFee').value || 0;

  // Ramp-up
  const rampChecked = document.getElementById('gymRamp').checked;
  let rampDuration = +document.getElementById('rampDuration').value || 6;
  let rampEffect = (+document.getElementById('rampEffect').value || 70) / 100;

  let totalRevenue = 0;
  if (rampChecked) {
    // Simple ramp-up over months, average ramp percentage applied to annual revenue
    const annualFromWeekly = weeklyMembers * weeklyFee * 52;
    const annualFromMonthly = monthlyMembers * monthlyFee * 12;
    const annualFromAnnual = annualMembers * annualFee;
    const annualRevenue = annualFromWeekly + annualFromMonthly + annualFromAnnual;

    // Average ramp factor over duration (linear ramp)
    const rampFactor = (rampDuration / 12) * rampEffect + ((12 - rampDuration) / 12) * 1;
    totalRevenue = annualRevenue * rampFactor;
  } else {
    totalRevenue = (weeklyMembers * weeklyFee * 52) + (monthlyMembers * monthlyFee * 12) + (annualMembers * annualFee);
  }

  // Operational Costs
  const util = +document.getElementById('gymUtil').value || 0;
  const insure = +document.getElementById('gymInsure').value || 0;
  const maint = +document.getElementById('gymMaint').value || 0;
  const market = +document.getElementById('gymMarket').value || 0;
  const admin = +document.getElementById('gymAdmin').value || 0;
  const clean = +document.getElementById('gymClean').value || 0;
  const misc = +document.getElementById('gymMisc').value || 0;
  const operationalCosts = util + insure + maint + market + admin + clean + misc;

  // Staff costs
  const ftTrainerCost = (+document.getElementById('gymFtTrainer').value || 0) * (+document.getElementById('gymFtTrainerSal').value || 0);
  const ptTrainerCost = (+document.getElementById('gymPtTrainer').value || 0) * (+document.getElementById('gymPtTrainerSal').value || 0);
  const addStaffCost = (+document.getElementById('gymAddStaff').value || 0) * (+document.getElementById('gymAddStaffSal').value || 0);
  const totalStaffCost = ftTrainerCost + ptTrainerCost + addStaffCost;

  // Summary display
  document.getElementById('gymSummary').innerHTML = `
    <p><strong>Revenue:</strong> €${totalRevenue.toFixed(2)}</p>
    <p><strong>Operational Costs:</strong> €${operationalCosts.toFixed(2)}</p>
    <p><strong>Staff Costs:</strong> €${totalStaffCost.toFixed(2)}</p>
    <p><strong>Investment Cost:</strong> €${investment.toFixed(2)}</p>
  `;

  window.gymData = {
    revenue: totalRevenue,
    costs: operationalCosts + totalStaffCost,
    investment: investment,
  };
}

// --- Profit and Loss Chart Updates ---
function updatePnl() {
  const mode = document.querySelector('input[name="pl_toggle"]:checked').value;
  if (!window.padelData || !window.gymData) return;

  const totalRevenue = window.padelData.revenue + window.gymData.revenue;
  const totalCosts = window.padelData.costs + window.gymData.costs;
  const totalInvestment = window.padelData.investment + window.gymData.investment;
  const totalProfit = totalRevenue - totalCosts;

  let displayRevenue = totalRevenue;
  let displayCosts = totalCosts;
  let displayProfit = totalProfit;

  if (mode === 'monthly') {
    displayRevenue /= 12;
    displayCosts /= 12;
    displayProfit /= 12;
  }

  // Chart data
  const labels = mode === 'annual' ? ['Revenue', 'Costs', 'Profit'] : ['Revenue (Monthly)', 'Costs (Monthly)', 'Profit (Monthly)'];
  const data = [displayRevenue, displayCosts, displayProfit];

  if (pnlChart) pnlChart.destroy();

  const ctx = document.getElementById('pnlChart').getContext('2d');
  pnlChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: mode === 'annual' ? 'Annual Amount (€)' : 'Monthly Amount (€)',
        data,
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });

  // Summary text
  document.getElementById('pnlSummary').innerHTML = `
    <p>Total Revenue: €${displayRevenue.toFixed(2)}</p>
    <p>Total Costs: €${displayCosts.toFixed(2)}</p>
    <p>Net Profit: €${displayProfit.toFixed(2)}</p>
  `;
}

// --- ROI Chart Updates ---
function updateROI() {
  if (!window.padelData || !window.gymData) return;

  const totalInvestment = window.padelData.investment + window.gymData.investment;
  const totalProfitYearly = (window.padelData.revenue + window.gymData.revenue) - (window.padelData.costs + window.gymData.costs);

  let cumulativeProfit = 0;
  const years = 10;
  const cumulativeProfits = [];
  for (let i = 1; i <= years; i++) {
    cumulativeProfit += totalProfitYearly;
    cumulativeProfits.push(cumulativeProfit);
  }

  // Calculate payback year
  let paybackYear = 'Not achieved within 10 years';
  for (let i = 0; i < cumulativeProfits.length; i++) {
    if (cumulativeProfits[i] >= totalInvestment) {
      paybackYear = i + 1;
      break;
    }
  }
  document.getElementById('yearsToROIText').innerHTML = `Estimated Payback Period: ${paybackYear} year(s)`;

  // Destroy old charts if exist
  [roiLineChart, roiBarChart, roiPieChart, roiBreakEvenChart].forEach(chart => {
    if (chart) chart.destroy();
  });

  // ROI Line Chart - Cumulative Profit Over Time
  const ctxLine = document.getElementById('roiLineChart').getContext('2d');
  roiLineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: Array.from({length: years}, (_, i) => `Year ${i+1}`),
      datasets: [{
        label: 'Cumulative Profit (€)',
        data: cumulativeProfits,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76,175,80,0.2)',
        fill: true,
        tension: 0.3,
      }]
    },
    options: { responsive: true }
  });

  // ROI Bar Chart - Annual Profit
  const ctxBar = document.getElementById('roiBarChart').getContext('2d');
  roiBarChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: Array.from({length: years}, (_, i) => `Year ${i+1}`),
      datasets: [{
        label: 'Annual Profit (€)',
        data: Array(years).fill(totalProfitYearly),
        backgroundColor: '#2196f3',
      }]
    },
    options: { responsive: true }
  });

  // ROI Pie Chart - Investment vs Profit Year 1
  const ctxPie = document.getElementById('roiPieChart').getContext('2d');
  roiPieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['Investment', 'Profit Year 1'],
      datasets: [{
        data: [totalInvestment, totalProfitYearly],
        backgroundColor: ['#f44336', '#4caf50'],
      }]
    },
    options: { responsive: true }
  });

  // Break-even Chart - Cumulative profit vs investment
  const ctxBreakEven = document.getElementById('roiBreakEvenChart').getContext('2d');
  roiBreakEvenChart = new Chart(ctxBreakEven, {
    type: 'line',
    data: {
      labels: Array.from({length: years}, (_, i) => `Year ${i+1}`),
      datasets: [
        {
          label: 'Cumulative Profit',
          data: cumulativeProfits,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76,175,80,0.2)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Investment',
          data: Array(years).fill(totalInvestment),
          borderColor: '#f44336',
          borderDash: [10,5],
          fill: false,
          tension: 0.3,
        }
      ]
    },
    options: { responsive: true }
  });
}

// --- Ramp-Up UI ---
function toggleRampSettings() {
  const checked = document.getElementById('gymRamp').checked;
  document.getElementById('rampUpSettings').style.display = checked ? 'block' : 'none';
  calculateGym();
}

function updateRampValue() {
  document.getElementById('rampDurationVal').innerText = document.getElementById('rampDuration').value;
  document.getElementById('rampEffectVal').innerText = document.getElementById('rampEffect').value;
  calculateGym();
}

// Event Listeners for dynamic updates if needed
document.querySelectorAll('#padel input, #gym input').forEach(input => {
  input.addEventListener('input', () => {
    calculatePadel();
    calculateGym();
    updatePnl();
    updateROI();
  });
});

// Initialize
showTab('padel');
calculatePadel();
calculateGym();
updatePnl();
updateROI();
