// script.js
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}

document.getElementById('gymRamp').addEventListener('change', () => {
  document.getElementById('rampUpControls').style.display = document.getElementById('gymRamp').checked ? 'block' : 'none';
});

function calcPadelRevenue() {
  const courts = +document.getElementById('padelCourts').value;
  const peakHrs = +document.getElementById('padelPeakHours').value;
  const offHrs = +document.getElementById('padelOffHours').value;
  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;
  const peakRate = +document.getElementById('padelPeakRate').value;
  const offRate = +document.getElementById('padelOffRate').value;
  const peakUtil = +document.getElementById('padelPeakUtil').value / 100;
  const offUtil = +document.getElementById('padelOffUtil').value / 100;

  const peakRev = courts * peakHrs * days * weeks * peakRate * peakUtil;
  const offRev = courts * offHrs * days * weeks * offRate * offUtil;

  return peakRev + offRev;
}

function calcGymRevenue() {
  const weekMem = +document.getElementById('gymWeekMembers').value;
  const weekFee = +document.getElementById('gymWeekFee').value;
  const monthMem = +document.getElementById('gymMonthMembers').value;
  const monthFee = +document.getElementById('gymMonthFee').value;
  const yearMem = +document.getElementById('gymAnnualMembers').value;
  const yearFee = +document.getElementById('gymAnnualFee').value;

  let annual = weekMem * weekFee * 52 + monthMem * monthFee * 12 + yearMem * yearFee;

  if (document.getElementById('gymRamp').checked) {
    const dur = +document.getElementById('rampDuration').value;
    const eff = +document.getElementById('rampEffect').value / 100;
    const rampedMonths = dur;
    const rampedRevenue = (annual / 12) * rampedMonths * eff;
    const steadyRevenue = (annual / 12) * (12 - rampedMonths);
    annual = rampedRevenue + steadyRevenue;
  }

  return annual;
}

function calcPadelCost() {
  const overheads = [
    'padelUtil','padelInsure','padelClean','padelMarket'
  ].reduce((sum, id) => sum + +document.getElementById(id).value, 0);

  const staff = (
    +document.getElementById('padelManagers').value * +document.getElementById('padelManagerSalary').value +
    +document.getElementById('padelReception').value * +document.getElementById('padelReceptionSalary').value +
    +document.getElementById('padelCoachFT').value * +document.getElementById('padelCoachFTSalary').value +
    +document.getElementById('padelCoachPT').value * +document.getElementById('padelCoachPTSalary').value +
    +document.getElementById('padelAddStaff').value * +document.getElementById('padelAddStaffSalary').value
  );

  return overheads + staff;
}

function calcGymCost() {
  const overheads = [
    'gymUtil','gymInsure','gymClean','gymMarket'
  ].reduce((sum, id) => sum + +document.getElementById(id).value, 0);

  const staff = (
    +document.getElementById('gymTrainersFT').value * +document.getElementById('gymTrainerFTSalary').value +
    +document.getElementById('gymTrainersPT').value * +document.getElementById('gymTrainerPTSalary').value +
    +document.getElementById('gymAddStaff').value * +document.getElementById('gymAddStaffSalary').value
  );

  return overheads + staff;
}

function calcInvestment() {
  return (
    +document.getElementById('padelGround').value +
    +document.getElementById('padelStructure').value +
    +document.getElementById('padelCourts').value * +document.getElementById('padelCourtCost').value +
    +document.getElementById('gymEquip').value +
    +document.getElementById('gymFloor').value +
    +document.getElementById('gymAmenities').value
  );
}

function calculatePadel() {
  const revenue = calcPadelRevenue();
  const cost = calcPadelCost();
  const profit = revenue - cost;

  document.getElementById('padelSummary').innerHTML = `
    <p>Annual Revenue: €${revenue.toFixed(2)}</p>
    <p>Annual Costs: €${cost.toFixed(2)}</p>
    <p>Profit: €${profit.toFixed(2)}</p>
  `;
  updatePnL();
  updateROI();
}

function calculateGym() {
  const revenue = calcGymRevenue();
  const cost = calcGymCost();
  const profit = revenue - cost;

  document.getElementById('gymSummary').innerHTML = `
    <p>Annual Revenue: €${revenue.toFixed(2)}</p>
    <p>Annual Costs: €${cost.toFixed(2)}</p>
    <p>Profit: €${profit.toFixed(2)}</p>
  `;
  updatePnL();
  updateROI();
}

function updatePnL() {
  const padelRev = calcPadelRevenue();
  const gymRev = calcGymRevenue();
  const padelCost = calcPadelCost();
  const gymCost = calcGymCost();

  const totalRev = padelRev + gymRev;
  const totalCost = padelCost + gymCost;
  const profit = totalRev - totalCost;

  document.getElementById('pnlSummary').innerHTML = `
    <p>Total Revenue: €${totalRev.toFixed(2)}</p>
    <p>Total Operational Costs: €${totalCost.toFixed(2)}</p>
    <p>Annual Profit: €${profit.toFixed(2)}</p>
  `;

  const ctx = document.getElementById('pnlChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Revenue', 'Costs', 'Profit'],
      datasets: [{
        label: 'Annual Overview',
        data: [totalRev, totalCost, profit],
        backgroundColor: ['#28a745', '#dc3545', '#007bff']
      }]
    }
  });

  const costCtx = document.getElementById('costChart').getContext('2d');
  new Chart(costCtx, {
    type: 'pie',
    data: {
      labels: ['Padel Costs', 'Gym Costs'],
      datasets: [{
        data: [padelCost, gymCost],
        backgroundColor: ['#ffc107', '#17a2b8']
      }]
    }
  });
}

function updateROI() {
  const investment = calcInvestment();
  const annualProfit = calcPadelRevenue() - calcPadelCost() + calcGymRevenue() - calcGymCost();
  let yearsToBreakEven = investment / annualProfit;

  document.getElementById('roiSummary').innerHTML = `
    <p>Total Investment: €${investment.toFixed(2)}</p>
    <p>Estimated Annual Profit: €${annualProfit.toFixed(2)}</p>
    <p>Years to ROI: ${yearsToBreakEven.toFixed(1)}</p>
  `;

  const roiCtx = document.getElementById('roiChart').getContext('2d');
  new Chart(roiCtx, {
    type: 'line',
    data: {
      labels: Array.from({length: 10}, (_, i) => `Year ${i+1}`),
      datasets: [{
        label: 'Cumulative ROI',
        data: Array.from({length: 10}, (_, i) => (annualProfit * (i+1)) - investment),
        borderColor: '#007bff',
        fill: false
      }]
    }
  });

  const breakEvenCtx = document.getElementById('roiBreakEven').getContext('2d');
  new Chart(breakEvenCtx, {
    type: 'bar',
    data: {
      labels: ['Investment', 'Profit After 1 Yr', 'ROI Breakeven Point'],
      datasets: [{
        label: 'ROI Comparison',
        data: [investment, annualProfit, annualProfit * yearsToBreakEven],
        backgroundColor: ['#6c757d', '#28a745', '#17a2b8']
      }]
    }
  });
}
