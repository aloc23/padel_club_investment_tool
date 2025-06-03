// script.js

// Utility function to get value from input or return 0
function val(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function calculatePadel() {
  const courts = val('padelCourts');
  const courtCost = val('padelCourtCost');
  const ground = val('padelGround');
  const structure = val('padelStructure');
  const amenities = val('padelAmenities');
  const peakHours = val('padelPeakHours');
  const offHours = val('padelOffHours');
  const peakRate = val('padelPeakRate');
  const offRate = val('padelOffRate');
  const peakUtil = val('padelPeakUtil') / 100;
  const offUtil = val('padelOffUtil') / 100;
  const days = val('padelDays');
  const weeks = val('padelWeeks');

  const annualRevenue =
    courts * (
      (peakHours * peakRate * peakUtil + offHours * offRate * offUtil) * days * weeks
    );

  const costs =
    val('padelUtil') + val('padelInsure') + val('padelMaint') + val('padelMarket') +
    val('padelAdmin') + val('padelClean') + val('padelMisc');

  const staff =
    val('padelFtMgr') * val('padelFtMgrSal') +
    val('padelFtRec') * val('padelFtRecSal') +
    val('padelFtCoach') * val('padelFtCoachSal') +
    val('padelPtCoach') * val('padelPtCoachSal') +
    val('padelAddStaff') * val('padelAddStaffSal');

  const totalInvestment = courts * courtCost + ground + structure + amenities;
  const totalCosts = costs + staff;
  const profit = annualRevenue - totalCosts;

  document.getElementById('padelSummary').innerHTML = `
    Annual Revenue: €${annualRevenue.toFixed(2)}<br>
    Annual Costs: €${totalCosts.toFixed(2)}<br>
    Annual Profit: €${profit.toFixed(2)}<br>
    Total Investment: €${totalInvestment.toFixed(2)}
  `;

  window.padelRevenue = annualRevenue;
  window.padelCosts = totalCosts;
  window.padelInvestment = totalInvestment;
  updatePnL();
}

function calculateGym() {
  const equip = val('gymEquip');
  const floor = val('gymFloor');
  const amen = val('gymAmen');
  const weekly = val('gymWeekMembers') * val('gymWeekFee') * 52;
  const monthly = val('gymMonthMembers') * val('gymMonthFee') * 12;
  const annual = val('gymAnnualMembers') * val('gymAnnualFee');
  let revenue = weekly + monthly + annual;

  if (document.getElementById('gymRamp').checked) {
    const duration = val('rampDuration');
    const effect = val('rampEffect') / 100;
    const rampRevenue = revenue * (effect + (12 - duration) / 12 * (1 - effect));
    revenue = rampRevenue;
  }

  const costs =
    val('gymUtil') + val('gymInsure') + val('gymMaint') + val('gymMarket') +
    val('gymAdmin') + val('gymClean') + val('gymMisc');

  const staff =
    val('gymFtTrainer') * val('gymFtTrainerSal') +
    val('gymPtTrainer') * val('gymPtTrainerSal') +
    val('gymAddStaff') * val('gymAddStaffSal');

  const investment = equip + floor + amen;
  const totalCosts = costs + staff;
  const profit = revenue - totalCosts;

  document.getElementById('gymSummary').innerHTML = `
    Annual Revenue: €${revenue.toFixed(2)}<br>
    Annual Costs: €${totalCosts.toFixed(2)}<br>
    Annual Profit: €${profit.toFixed(2)}<br>
    Total Investment: €${investment.toFixed(2)}
  `;

  window.gymRevenue = revenue;
  window.gymCosts = totalCosts;
  window.gymInvestment = investment;
  updatePnL();
}

function updatePnL() {
  const totalRevenue = (window.padelRevenue || 0) + (window.gymRevenue || 0);
  const totalCosts = (window.padelCosts || 0) + (window.gymCosts || 0);
  const profit = totalRevenue - totalCosts;

  const isMonthly = document.querySelector('input[name="pl_toggle"]:checked').value === 'monthly';
  const divisor = isMonthly ? 12 : 1;

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    revenue: totalRevenue / 12,
    costs: totalCosts / 12,
    profit: profit / 12
  }));

  document.getElementById('pnlSummary').innerHTML = `
    ${isMonthly ? 'Monthly' : 'Annual'} Revenue: €${(totalRevenue / divisor).toFixed(2)}<br>
    ${isMonthly ? 'Monthly' : 'Annual'} Costs: €${(totalCosts / divisor).toFixed(2)}<br>
    ${isMonthly ? 'Monthly' : 'Annual'} Profit: €${(profit / divisor).toFixed(2)}
  `;

  drawPnLCharts(monthlyData);
  updateROI();
}

function updateROI() {
  const totalInvestment = (window.padelInvestment || 0) + (window.gymInvestment || 0);
  const annualProfit = ((window.padelRevenue || 0) + (window.gymRevenue || 0)) - ((window.padelCosts || 0) + (window.gymCosts || 0));

  let years = 0;
  let cumulative = 0;
  const cumulativeData = [];
  while (cumulative < totalInvestment && years < 20) {
    cumulative += annualProfit;
    cumulativeData.push(cumulative);
    years++;
  }

  document.getElementById('yearsToROIText').innerText = `Estimated Years to ROI: ${years}`;
  drawROICharts(cumulativeData);
}

function drawPnLCharts(data) {
  const ctx1 = document.getElementById('pnlChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: data.map(x => x.month),
      datasets: [
        { label: 'Revenue', data: data.map(x => x.revenue), backgroundColor: '#4caf50' },
        { label: 'Costs', data: data.map(x => x.costs), backgroundColor: '#f44336' },
        { label: 'Profit', data: data.map(x => x.profit), backgroundColor: '#2196f3' }
      ]
    },
    options: { responsive: true }
  });
}

function drawROICharts(data) {
  const ctx = document.getElementById('roiLineChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => `Year ${i + 1}`),
      datasets: [
        { label: 'Cumulative ROI (€)', data, fill: true, borderColor: '#00a86b', backgroundColor: 'rgba(0,168,107,0.2)' }
      ]
    },
    options: { responsive: true }
  });
}
