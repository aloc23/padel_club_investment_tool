let pnlChart, profitTrendChart, costPieChart;
let roiLineChart, roiBarChart, roiPieChart, roiBreakEvenChart;

function calculatePadel() {
  const peakHours = +document.getElementById('padelPeakHours').value || 0;
  const peakRate = +document.getElementById('padelPeakRate').value || 0;
  const peakUtil = (+document.getElementById('padelPeakUtil').value || 0) / 100;

  const offHours = +document.getElementById('padelOffHours').value || 0;
  const offRate = +document.getElementById('padelOffRate').value || 0;
  const offUtil = (+document.getElementById('padelOffUtil').value || 0) / 100;

  const days = +document.getElementById('padelDays').value || 0;
  const weeks = +document.getElementById('padelWeeks').value || 0;
  const courts = +document.getElementById('padelCourts').value || 1;

  const peakAnnualRevenue = peakHours * peakRate * days * weeks * courts * peakUtil;
  const offAnnualRevenue = offHours * offRate * days * weeks * courts * offUtil;

  const totalAnnualRevenue = peakAnnualRevenue + offAnnualRevenue;

  const utilCost = +document.getElementById('padelUtil').value || 0;
  const insureCost = +document.getElementById('padelInsure').value || 0;
  const maintCost = +document.getElementById('padelMaint').value || 0;
  const marketCost = +document.getElementById('padelMarket').value || 0;
  const adminCost = +document.getElementById('padelAdmin').value || 0;
  const cleanCost = +document.getElementById('padelClean').value || 0;
  const miscCost = +document.getElementById('padelMisc').value || 0;

  const totalOpCosts = utilCost + insureCost + maintCost + marketCost + adminCost + cleanCost + miscCost;

  const ftMgr = +document.getElementById('padelFtMgr').value || 0;
  const ftMgrSal = +document.getElementById('padelFtMgrSal').value || 0;
  const ftRec = +document.getElementById('padelFtRec').value || 0;
  const ftRecSal = +document.getElementById('padelFtRecSal').value || 0;
  const ftCoach = +document.getElementById('padelFtCoach').value || 0;
  const ftCoachSal = +document.getElementById('padelFtCoachSal').value || 0;
  const ptCoach = +document.getElementById('padelPtCoach').value || 0;
  const ptCoachSal = +document.getElementById('padelPtCoachSal').value || 0;
  const addStaff = +document.getElementById('padelAddStaff').value || 0;
  const addStaffSal = +document.getElementById('padelAddStaffSal').value || 0;

  const totalStaffCost =
    ftMgr * ftMgrSal +
    ftRec * ftRecSal +
    ftCoach * ftCoachSal +
    ptCoach * ptCoachSal +
    addStaff * addStaffSal;

  const netProfit = totalAnnualRevenue - totalOpCosts - totalStaffCost;

  const summaryDiv = document.getElementById('padelSummary');
  summaryDiv.innerHTML = `
    <h3>Summary</h3>
    <p><b>Annual Revenue:</b> €${totalAnnualRevenue.toFixed(2)}</p>
    <p><b>Operational Costs:</b> €${totalOpCosts.toFixed(2)}</p>
    <p><b>Staff Costs:</b> €${totalStaffCost.toFixed(2)}</p>
    <p><b>Net Profit:</b> €${netProfit.toFixed(2)}</p>
  `;

  window.padelData = {
    revenue: totalAnnualRevenue,
    costs: totalOpCosts + totalStaffCost,
    profit: netProfit,
    monthlyRevenue: totalAnnualRevenue / 12,
    monthlyCosts: (totalOpCosts + totalStaffCost) / 12,
    monthlyProfit: netProfit / 12,
  };

  updatePnL();
  updateROI();
}

function calculateGym() {
  const weekMembers = +document.getElementById('gymWeekMembers').value || 0;
  const weekFee = +document.getElementById('gymWeekFee').value || 0;
  const monthMembers = +document.getElementById('gymMonthMembers').value || 0;
  const monthFee = +document.getElementById('gymMonthFee').value || 0;
  const annualMembers = +document.getElementById('gymAnnualMembers').value || 0;
  const annualFee = +document.getElementById('gymAnnualFee').value || 0;

  const weeklyRevenueAnnual = weekMembers * weekFee * 52;
  const monthlyRevenueAnnual = monthMembers * monthFee * 12;
  const annualRevenueAnnual = annualMembers * annualFee;

  let totalAnnualRevenue = weeklyRevenueAnnual + monthlyRevenueAnnual + annualRevenueAnnual;

  if (document.getElementById('gymRamp').checked) {
    const rampDuration = +document.getElementById('rampDuration').value;
    const rampEffect = +document.getElementById('rampEffect').value / 100;
    let rampedRevenue = 0;
    for (let i = 1; i <= 12; i++) {
      if (i <= rampDuration) {
        rampedRevenue += totalAnnualRevenue * (rampEffect * (i / rampDuration));
      } else {
        rampedRevenue += totalAnnualRevenue;
      }
    }
    totalAnnualRevenue = rampedRevenue / 12 * 12;
  }

  const utilCost = +document.getElementById('gymUtil').value || 0;
  const insureCost = +document.getElementById('gymInsure').value || 0;
  const maintCost = +document.getElementById('gymMaint').value || 0;
  const marketCost = +document.getElementById('gymMarket').value || 0;
  const adminCost = +document.getElementById('gymAdmin').value || 0;
  const cleanCost = +document.getElementById('gymClean').value || 0;
  const miscCost = +document.getElementById('gymMisc').value || 0;

  const totalOpCosts = utilCost + insureCost + maintCost + marketCost + adminCost + cleanCost + miscCost;

  const ftTrainer = +document.getElementById('gymFtTrainer').value || 0;
  const ftTrainerSal = +document.getElementById('gymFtTrainerSal').value || 0;
  const ptTrainer = +document.getElementById('gymPtTrainer').value || 0;
  const ptTrainerSal = +document.getElementById('gymPtTrainerSal').value || 0;
  const addStaff = +document.getElementById('gymAddStaff').value || 0;
  const addStaffSal = +document.getElementById('gymAddStaffSal').value || 0;

  const totalStaffCost =
    ftTrainer * ftTrainerSal +
    ptTrainer * ptTrainerSal +
    addStaff * addStaffSal;

  const netProfit = totalAnnualRevenue - totalOpCosts - totalStaffCost;

  const summaryDiv = document.getElementById('gymSummary');
  summaryDiv.innerHTML = `
    <h3>Summary</h3>
    <p><b>Annual Revenue:</b> €${totalAnnualRevenue.toFixed(2)}</p>
    <p><b>Operational Costs:</b> €${totalOpCosts.toFixed(2)}</p>
    <p><b>Staff Costs:</b> €${totalStaffCost.toFixed(2)}</p>
    <p><b>Net Profit:</b> €${netProfit.toFixed(2)}</p>
  `;

  window.gymData = {
    revenue: totalAnnualRevenue,
    costs: totalOpCosts + totalStaffCost,
    profit: netProfit,
    monthlyRevenue: totalAnnualRevenue / 12,
    monthlyCosts: (totalOpCosts + totalStaffCost) / 12,
    monthlyProfit: netProfit / 12,
  };

  updatePnL();
  updateROI();
}

function updatePnL() {
  const plType = document.querySelector('input[name="pl_toggle"]:checked')?.value || 'annual';

  const padel = window.padelData || { revenue: 0, costs: 0, profit: 0, monthlyRevenue: 0, monthlyCosts: 0, monthlyProfit: 0 };
  const gym = window.gymData || { revenue: 0, costs: 0, profit: 0, monthlyRevenue: 0, monthlyCosts: 0, monthlyProfit: 0 };

  const totalRevenue = plType === 'annual' ? padel.revenue + gym.revenue : padel.monthlyRevenue + gym.monthlyRevenue;
  const totalCosts = plType === 'annual' ? padel.costs + gym.costs : padel.monthlyCosts + gym.monthlyCosts;
  const totalProfit = plType === 'annual' ? padel.profit + gym.profit : padel.monthlyProfit + gym.monthlyProfit;

  const summaryDiv = document.getElementById('pnlSummary');
  summaryDiv.innerHTML = `
    <p><b>Total Revenue:</b> €${totalRevenue.toFixed(2)}</p>
    <p><b>Total Costs:</b> €${totalCosts.toFixed(2)}</p>
    <p><b>EBITDA (approx.):</b> €${totalProfit.toFixed(2)}</p>
    <p><b>Net Margin:</b> ${(totalProfit / totalRevenue * 100 || 0).toFixed(2)}%</p>
  `;

  updatePnLCharts(plType, totalRevenue, totalCosts, totalProfit);
}

function updateROI() {
  const padel = window.padelData || { revenue: 0, costs: 0, profit: 0, monthlyRevenue: 0, monthlyCosts: 0, monthlyProfit: 0 };
  const gym = window.gymData || { revenue: 0, costs: 0, profit: 0, monthlyRevenue: 0, monthlyCosts: 0, monthlyProfit: 0 };

  const investmentPadel = (+document.getElementById('padelGround').value || 0) +
                          (+document.getElementById('padelStructure').value || 0) +
                          (+document.getElementById('padelCourts').value || 0) * (+document.getElementById('padelCourtCost').value || 0);

  const investmentGym = (+document.getElementById('gymEquip').value || 0) +
                        (+document.getElementById('gymFloor').value || 0) +
                        (+document.getElementById('gymAmen').value || 0);

  const totalInvestment = investmentPadel + investmentGym;

  let cumulativeProfit = 0;
  const years = 10;
  const monthlyProfit = (padel.monthlyProfit + gym.monthlyProfit);

  const roiData = [];
  for (let year = 1; year <= years; year++) {
    cumulativeProfit += monthlyProfit * 12;
    roiData.push({ year, cumulativeProfit, roiPercent: (cumulativeProfit / totalInvestment) * 100 });
  }

  const yearsToROI = roiData.find(d => d.cumulativeProfit >= totalInvestment)?.year || `More than ${years}`;

  document.getElementById('yearsToROIText').innerText = `Estimated payback period: ${yearsToROI} year(s)`;

  updateROICharts(roiData, totalInvestment);
}

function updatePnLCharts(plType, revenue, costs, profit) {
  const ctxPnl = document.getElementById('pnlChart').getContext('2d');
  const ctxProfitTrend = document.getElementById('profitTrendChart').getContext('2d');
  const ctxCostPie = document.getElementById('costPieChart').getContext('2d');

  if (pnlChart) pnlChart.destroy();
  if (profitTrendChart) profitTrendChart.destroy();
  if (costPieChart) costPieChart.destroy();

  pnlChart = new Chart(ctxPnl, {
    type: 'bar',
    data: {
      labels: ['Revenue', 'Costs', 'Profit'],
      datasets: [{
        label: plType === 'annual' ? 'Annual (€)' : 'Monthly (€)',
        data: [revenue, costs, profit],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      }]
    },
    options: { responsive: true }
  });

  profitTrendChart = new Chart(ctxProfitTrend, {
    type: 'line',
    data: {
      labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
      datasets: [{
        label: 'Profit Trend',
        data: Array(12).fill(profit / (plType === 'annual' ? 12 : 1)),
        borderColor: '#2196f3',
        fill: false,
      }]
    },
    options: { responsive: true }
  });

  costPieChart = new Chart(ctxCostPie, {
    type: 'pie',
    data: {
      labels: ['Costs', 'Profit'],
      datasets: [{
        data: [costs, profit],
        backgroundColor: ['#f44336', '#2196f3']
      }]
    },
    options: { responsive: true }
  });
}

function updateROICharts(roiData, totalInvestment) {
  const ctxLine = document.getElementById('roiLineChart').getContext('2d');
  const ctxBar = document.getElementById('roiBarChart').getContext('2d');
  const ctxPie = document.getElementById('roiPieChart').getContext('2d');
  const ctxBreakEven = document.getElementById('roiBreakEvenChart').getContext('2d');

  if (roiLineChart) roiLineChart.destroy();
  if (roiBarChart) roiBarChart.destroy();
  if (roiPieChart) roiPieChart.destroy();
  if (roiBreakEvenChart) roiBreakEvenChart.destroy();

  roiLineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: roiData.map(d => `Year ${d.year}`),
      datasets: [{
        label: 'Cumulative Profit',
        data: roiData.map(d => d.cumulativeProfit),
        borderColor: '#4caf50',
        fill: false,
      }]
    },
    options: { responsive: true }
  });

  roiBarChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: roiData.map(d => `Year ${d.year}`),
      datasets: [{
        label: 'ROI %',
        data: roiData.map(d => d.roiPercent),
        backgroundColor: '#2196f3',
      }]
    },
    options: { responsive: true }
  });

  roiPieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['Investment', 'Cumulative Profit over Investment'],
      datasets: [{
        data: [totalInvestment, Math.max(0, roiData[roiData.length - 1].cumulativeProfit - totalInvestment)],
        backgroundColor: ['#ff9800', '#9e9e9e']
      }]
    },
    options: { responsive: true }
  });

  roiBreakEvenChart = new Chart(ctxBreakEven, {
    type: 'line',
    data: {
      labels: roiData.map(d => `Year ${d.year}`),
      datasets: [{
        label: 'Break-Even',
        data: roiData.map(d => d.cumulativeProfit - totalInvestment),
        borderColor: '#f44336',
        fill: false,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value < 0 ? `-${Math.abs(value)}` : value;
            }
          }
        }
      }
    }
  });
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  showTab('padel');
  document.querySelectorAll('input[name="pl_toggle"]').forEach(radio => {
    radio.addEventListener('change', updatePnL);
  });
});
