// Global Chart instances to update/destroy as needed
let pnlChart, profitTrendChart, costPieChart;
let roiLineChart, roiBarChart, roiPieChart, roiBreakEvenChart;

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(sec => {
    sec.classList.toggle('hidden', sec.id !== tabId);
  });
  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'btn' + capitalize(tabId));
  });
  if (tabId === 'pnl') updatePnL();
  if (tabId === 'roi') updateROI();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// -- Padel Calculations --

function calculatePadel() {
  // Gather Inputs
  const peakHours = +document.getElementById('padelPeakHours').value;
  const peakRate = +document.getElementById('padelPeakRate').value;
  const peakUtil = +document.getElementById('padelPeakUtil').value / 100;

  const offHours = +document.getElementById('padelOffHours').value;
  const offRate = +document.getElementById('padelOffRate').value;
  const offUtil = +document.getElementById('padelOffUtil').value / 100;

  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;

  // Revenue calculation
  const peakRevenue = peakHours * peakRate * peakUtil * days * weeks;
  const offRevenue = offHours * offRate * offUtil * days * weeks;
  const totalRevenue = peakRevenue + offRevenue;

  // Costs
  const utilCost = +document.getElementById('padelUtil').value;
  const insureCost = +document.getElementById('padelInsure').value;
  const maintCost = +document.getElementById('padelMaint').value;
  const marketCost = +document.getElementById('padelMarket').value;
  const adminCost = +document.getElementById('padelAdmin').value;
  const cleanCost = +document.getElementById('padelClean').value;
  const miscCost = +document.getElementById('padelMisc').value;

  const totalOpCosts = utilCost + insureCost + maintCost + marketCost + adminCost + cleanCost + miscCost;

  // Staff costs
  const ftMgr = +document.getElementById('padelFtMgr').value;
  const ftMgrSal = +document.getElementById('padelFtMgrSal').value;

  const ftRec = +document.getElementById('padelFtRec').value;
  const ftRecSal = +document.getElementById('padelFtRecSal').value;

  const ftCoach = +document.getElementById('padelFtCoach').value;
  const ftCoachSal = +document.getElementById('padelFtCoachSal').value;

  const ptCoach = +document.getElementById('padelPtCoach').value;
  const ptCoachSal = +document.getElementById('padelPtCoachSal').value;

  const addStaff = +document.getElementById('padelAddStaff').value;
  const addStaffSal = +document.getElementById('padelAddStaffSal').value;

  const totalStaffCost =
    ftMgr * ftMgrSal +
    ftRec * ftRecSal +
    ftCoach * ftCoachSal +
    ptCoach * ptCoachSal +
    addStaff * addStaffSal;

  // Display Summary
  const summaryDiv = document.getElementById('padelSummary');
  summaryDiv.innerHTML = `
    <h3>Summary</h3>
    <p><b>Total Revenue:</b> €${totalRevenue.toFixed(2)}</p>
    <p><b>Operational Costs:</b> €${totalOpCosts.toFixed(2)}</p>
    <p><b>Staff Costs:</b> €${totalStaffCost.toFixed(2)}</p>
    <p><b>Net Profit:</b> €${(totalRevenue - totalOpCosts - totalStaffCost).toFixed(2)}</p>
  `;

  // Save for PnL & ROI
  window.padelData = {
    revenue: totalRevenue,
    costs: totalOpCosts + totalStaffCost,
    profit: totalRevenue - totalOpCosts - totalStaffCost,
    monthlyProfit: (totalRevenue - totalOpCosts - totalStaffCost) / 12,
  };

  updatePnL();
  updateROI();
}

// -- Gym Calculations --

function toggleRampSettings() {
  const rampSettings = document.getElementById('rampUpSettings');
  rampSettings.classList.toggle('hidden', !document.getElementById('gymRamp').checked);
}

function updateRampDurationLabel(val) {
  document.getElementById('rampDurationLabel').textContent = val;
  calculateGym();
}

function updateRampEffectLabel(val) {
  document.getElementById('rampEffectLabel').textContent = val + '%';
  calculateGym();
}

function calculateGym() {
  const weekMembers = +document.getElementById('gymWeekMembers').value;
  const weekFee = +document.getElementById('gymWeekFee').value;
  const monthMembers = +document.getElementById('gymMonthMembers').value;
  const monthFee = +document.getElementById('gymMonthFee').value;
  const annualMembers = +document.getElementById('gymAnnualMembers').value;
  const annualFee = +document.getElementById('gymAnnualFee').value;

  let totalRevenue = (weekMembers * weekFee * 52 / 12) + (monthMembers * monthFee) + (annualMembers * annualFee / 12);

  if (document.getElementById('gymRamp').checked) {
    const rampDuration = +document.getElementById('rampDuration').value;
    const rampEffect = +document.getElementById('rampEffect').value / 100;
    let rampedRevenue = 0;
    for(let i=1; i <= 12; i++) {
      if(i <= rampDuration) {
        rampedRevenue += totalRevenue * (rampEffect * (i / rampDuration));
      } else {
        rampedRevenue += totalRevenue;
      }
    }
    totalRevenue = rampedRevenue / 12; // average monthly revenue
  }

  const utilCost = +document.getElementById('gymUtil').value;
  const insureCost = +document.getElementById('gymInsure').value;
  const maintCost = +document.getElementById('gymMaint').value;
  const marketCost = +document.getElementById('gymMarket').value;
  const adminCost = +document.getElementById('gymAdmin').value;
  const cleanCost = +document.getElementById('gymClean').value;
  const miscCost = +document.getElementById('gymMisc').value;

  const totalOpCosts = utilCost + insureCost + maintCost + marketCost + adminCost + cleanCost + miscCost;

  const ftTrainer = +document.getElementById('gymFtTrainer').value;
  const ftTrainerSal = +document.getElementById('gymFtTrainerSal').value;
  const ptTrainer = +document.getElementById('gymPtTrainer').value;
  const ptTrainerSal = +document.getElementById('gymPtTrainerSal').value;
  const addStaff = +document.getElementById('gymAddStaff').value;
  const addStaffSal = +document.getElementById('gymAddStaffSal').value;

  const totalStaffCost =
    ftTrainer * ftTrainerSal +
    ptTrainer * ptTrainerSal +
    addStaff * addStaffSal;

  const netProfit = totalRevenue - totalOpCosts - totalStaffCost;

  const summaryDiv = document.getElementById('gymSummary');
  summaryDiv.innerHTML = `
    <h3>Summary</h3>
    <p><b>Total Revenue:</b> €${totalRevenue.toFixed(2)}</p>
    <p><b>Operational Costs:</b> €${totalOpCosts.toFixed(2)}</p>
    <p><b>Staff Costs:</b> €${totalStaffCost.toFixed(2)}</p>
    <p><b>Net Profit:</b> €${netProfit.toFixed(2)}</p>
  `;

  window.gymData = {
    revenue: totalRevenue,
    costs: totalOpCosts + totalStaffCost,
    profit: netProfit,
    monthlyProfit: netProfit / 12,
  };

  updatePnL();
  updateROI();
}

// -- Profit and Loss --

function updatePnL() {
  const plType = document.querySelector('input[name="pl_toggle"]:checked').value;

  // Combine revenues & costs from padel and gym
  const padel = window.padelData || { revenue: 0, costs: 0, profit: 0, monthlyProfit: 0 };
  const gym = window.gymData || { revenue: 0, costs: 0, profit: 0, monthlyProfit: 0 };

  const totalRevenue = padel.revenue + gym.revenue;
  const totalCosts = padel.costs + gym.costs;
  const totalProfit = padel.profit + gym.profit;

  const summaryDiv = document.getElementById('pnlSummary');
  summaryDiv.innerHTML = `
    <p><b>Total Revenue:</b> €${totalRevenue.toFixed(2)}</p>
    <p><b>Total Costs:</b> €${totalCosts.toFixed(2)}</p>
    <p><b>Net Profit:</b> €${totalProfit.toFixed(2)}</p>
  `;

  // Monthly Breakdown Table
  const tbody = document.querySelector('#monthlyBreakdown tbody');
  tbody.innerHTML = '';

  if (plType === 'monthly') {
    for(let i=1; i<=12; i++) {
      const rev = totalRevenue / 12;
      const costs = totalCosts / 12;
      const profit = totalProfit / 12;
      const row = `<tr><td>${i}</td><td>€${rev.toFixed(2)}</td><td>€${costs.toFixed(2)}</td><td>€${profit.toFixed(2)}</td></tr>`;
      tbody.insertAdjacentHTML('beforeend', row);
    }
  } else {
    tbody.innerHTML = '<tr><td colspan="4">Switch to monthly view to see breakdown</td></tr>';
  }

  // Destroy old charts if exist
  if(pnlChart) pnlChart.destroy();
  if(profitTrendChart) profitTrendChart.destroy();
  if(costPieChart) costPieChart.destroy();

  // PnL Chart: Revenue, Costs, Profit (bar chart)
  const ctxPnl = document.getElementById('pnlChart').getContext('2d');
  pnlChart = new Chart(ctxPnl, {
    type: 'bar',
    data: {
      labels: ['Revenue', 'Costs', 'Profit'],
      datasets: [{
        label: 'Annual Amount (€)',
        data: [totalRevenue, totalCosts, totalProfit],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3']
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });

  // Profit Trend Line Chart - monthly or annual profit trend
  const ctxProfitTrend = document.getElementById('profitTrendChart').getContext('2d');
  const monthlyProfits = new Array(12).fill(totalProfit/12);
  const annualProfits = new Array(10).fill(totalProfit);

  profitTrendChart = new Chart(ctxProfitTrend, {
    type: 'line',
    data: {
      labels: plType === 'monthly' ? [...Array(12).keys()].map(m=>`Month ${m+1}`) : [...Array(10).keys()].map(y=>`Year ${y+1}`),
      datasets: [{
        label: 'Profit',
        data: plType === 'monthly' ? monthlyProfits : annualProfits,
        fill: true,
        backgroundColor: 'rgba(33,150,243,0.2)',
        borderColor: 'rgba(33,150,243,1)',
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });

  // Cost Pie Chart
  const ctxCostPie = document.getElementById('costPieChart').getContext('2d');
  costPieChart = new Chart(ctxCostPie, {
    type: 'pie',
    data: {
      labels: ['Padel Costs', 'Gym Costs'],
      datasets: [{
        data: [padel.costs, gym.costs],
        backgroundColor: ['#f39c12', '#3498db']
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });
}

// -- ROI --

function updateROI() {
  const padel = window.padelData || { revenue: 0, costs: 0, profit: 0 };
  const gym = window.gymData || { revenue: 0, costs: 0, profit: 0 };

  // Calculate total investment - from inputs
  const padelInvestment =
    +document.getElementById('padelGround').value +
    +document.getElementById('padelStructure').value +
    (+document.getElementById('padelCourts').value * +document.getElementById('padelCourtCost').value) +
    +document.getElementById('padelAmenities').value;

  const gymInvestment =
    +document.getElementById('gymEquip').value +
    +document.getElementById('gymFloor').value +
    +document.getElementById('gymAmen').value;

  const totalInvestment = padelInvestment + gymInvestment;

  // Calculate payback period
  const annualProfit = padel.profit + gym.profit;
  const paybackYears = annualProfit > 0 ? Math.ceil(totalInvestment / annualProfit) : '∞';

  // Update text summary
  document.getElementById('yearsToROIText').innerHTML = `<div class="roi-summary-box">Estimated Payback Period: <b>${paybackYears} year(s)</b></div>`;

  // Prepare data arrays for charts
  let cumulativeProfit = 0;
  const years = [...Array(10).keys()].map(i => i + 1);
  const cumulativeProfits = years.map(year => {
    cumulativeProfit += annualProfit;
    return cumulativeProfit;
  });

  // Destroy old charts if exist
  if (roiLineChart) roiLineChart.destroy();
  if (roiBarChart) roiBarChart.destroy();
  if (roiPieChart) roiPieChart.destroy();
  if (roiBreakEvenChart) roiBreakEvenChart.destroy();

  // Line Chart: Cumulative Profit Over Time
  const ctxRoiLine = document.getElementById('roiLineChart').getContext('2d');
  roiLineChart = new Chart(ctxRoiLine, {
    type: 'line',
    data: {
      labels: years.map(y => `Year ${y}`),
      datasets: [{
        label: 'Cumulative Profit (€)',
        data: cumulativeProfits,
        fill: true,
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.3)',
        tension: 0.3
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });

  // Bar Chart: Annual Profit
  const ctxRoiBar = document.getElementById('roiBarChart').getContext('2d');
  roiBarChart = new Chart(ctxRoiBar, {
    type: 'bar',
    data: {
      labels: years.map(y => `Year ${y}`),
      datasets: [{
        label: 'Annual Profit (€)',
        data: new Array(10).fill(annualProfit),
        backgroundColor: '#2980b9'
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });

  // Pie Chart: Profit vs Investment Year 1
  const ctxRoiPie = document.getElementById('roiPieChart').getContext('2d');
  roiPieChart = new Chart(ctxRoiPie, {
    type: 'pie',
    data: {
      labels: ['Investment', 'Profit Year 1'],
      datasets: [{
        data: [totalInvestment, annualProfit],
        backgroundColor: ['#c0392b', '#27ae60']
      }]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });

  // Break-Even Chart (line + investment threshold)
  const ctxBreakEven = document.getElementById('roiBreakEvenChart').getContext('2d');
  roiBreakEvenChart = new Chart(ctxBreakEven, {
    type: 'line',
    data: {
      labels: years.map(y => `Year ${y}`),
      datasets: [
        {
          label: 'Cumulative Profit (€)',
          data: cumulativeProfits,
          borderColor: '#27ae60',
          fill: true,
          backgroundColor: 'rgba(39, 174, 96, 0.3)',
          tension: 0.3,
        },
        {
          label: 'Investment',
          data: new Array(10).fill(totalInvestment),
          borderColor: '#c0392b',
          borderDash: [10,5],
          fill: false,
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: { responsive:true, maintainAspectRatio:false }
  });
}

// -- On page load --

window.onload = () => {
  showTab('padel');
  calculatePadel();
  calculateGym();
};
