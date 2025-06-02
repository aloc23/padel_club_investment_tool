// Tab switching
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function getVal(id) {
  return parseFloat(document.getElementById(id)?.value || 0);
}

function calcStaffCost(prefix) {
  let roles = ['FtMgr', 'FtRec', 'FtCoach', 'PtCoach', 'FtTrainer', 'PtTrainer'];
  let total = 0;
  roles.forEach(role => {
    let qty = getVal(`${prefix}${role}`);
    let sal = getVal(`${prefix}${role}Sal`);
    total += qty * sal;
  });
  return total;
}

function calcOpCosts(prefix) {
  return ['Util', 'Insure', 'Maint', 'Market', 'Admin', 'Clean', 'Misc']
    .reduce((sum, id) => sum + getVal(`${prefix}${id}`), 0);
}

function calcPadelRevenue() {
  let courts = getVal('padelCourts');
  let peak = getVal('padelPeakHours') * getVal('padelPeakRate') * (getVal('padelPeakUtil') / 100);
  let off = getVal('padelOffHours') * getVal('padelOffRate') * (getVal('padelOffUtil') / 100);
  let days = getVal('padelDays');
  let weeks = getVal('padelWeeks');
  return courts * (peak + off) * days * weeks;
}

function calcGymRevenue() {
  let week = getVal('gymWeekMembers') * getVal('gymWeekFee') * 52;
  let month = getVal('gymMonthMembers') * getVal('gymMonthFee') * 12;
  let annual = getVal('gymAnnualMembers') * getVal('gymAnnualFee');
  let total = week + month + annual;
  return document.getElementById('gymRamp').checked ? total * 0.6 : total;
}

function calculatePadel() {
  let invest = getVal('padelGround') + getVal('padelStructure') + (getVal('padelCourts') * getVal('padelCourtCost'));
  let revenue = calcPadelRevenue();
  let ops = calcOpCosts('padel');
  let staff = calcStaffCost('padel');
  let profit = revenue - (ops + staff);
  document.getElementById('padelSummary').innerHTML = `
    <h3>Padel Summary</h3>
    <p><strong>Investment:</strong> €${invest.toLocaleString()}</p>
    <p><strong>Revenue:</strong> €${revenue.toLocaleString()}</p>
    <p><strong>Operational Costs:</strong> €${ops.toLocaleString()}</p>
    <p><strong>Staff Costs:</strong> €${staff.toLocaleString()}</p>
    <p><strong>Profit:</strong> €${profit.toLocaleString()}</p>
  `;
  updatePNL();
  updateROI();
}

function calculateGym() {
  let invest = getVal('gymEquip') + getVal('gymFloor') + getVal('gymAmen');
  let revenue = calcGymRevenue();
  let ops = calcOpCosts('gym');
  let staff = calcStaffCost('gym');
  let profit = revenue - (ops + staff);
  document.getElementById('gymSummary').innerHTML = `
    <h3>Gym Summary</h3>
    <p><strong>Investment:</strong> €${invest.toLocaleString()}</p>
    <p><strong>Revenue:</strong> €${revenue.toLocaleString()}</p>
    <p><strong>Operational Costs:</strong> €${ops.toLocaleString()}</p>
    <p><strong>Staff Costs:</strong> €${staff.toLocaleString()}</p>
    <p><strong>Profit:</strong> €${profit.toLocaleString()}</p>
  `;
  updatePNL();
  updateROI();
}

function updatePNL() {
  let revenue = calcPadelRevenue() + calcGymRevenue();
  let costs = calcOpCosts('padel') + calcOpCosts('gym') + calcStaffCost('padel') + calcStaffCost('gym');
  let profit = revenue - costs;
  let monthly = (val) => document.querySelector('input[name="pl_toggle"]:checked').value === 'monthly' ? val / 12 : val;

  new Chart(document.getElementById('pnlChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Revenue', 'Costs', 'Profit'],
      datasets: [{
        label: 'P&L Summary',
        data: [monthly(revenue), monthly(costs), monthly(profit)],
        backgroundColor: ['green', 'orange', 'blue']
      }]
    },
    options: { responsive: true }
  });

  new Chart(document.getElementById('profitTrendChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
      datasets: [{
        label: 'Monthly Profit Trend',
        data: Array.from({ length: 12 }, () => monthly(profit)),
        borderColor: 'blue',
        fill: false
      }]
    }
  });

  new Chart(document.getElementById('costPieChart').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Operational Costs', 'Staff Costs'],
      datasets: [{
        data: [calcOpCosts('padel') + calcOpCosts('gym'), calcStaffCost('padel') + calcStaffCost('gym')],
        backgroundColor: ['#FFA500', '#FF6347']
      }]
    }
  });
}

function updateROI() {
  let invest = getVal('padelGround') + getVal('padelStructure') + (getVal('padelCourts') * getVal('padelCourtCost')) + getVal('gymEquip') + getVal('gymFloor') + getVal('gymAmen');
  let revenue = calcPadelRevenue() + calcGymRevenue();
  let costs = calcOpCosts('padel') + calcOpCosts('gym') + calcStaffCost('padel') + calcStaffCost('gym');
  let profit = revenue - costs;
  let roi = (profit / invest) * 100;

  new Chart(document.getElementById('roiLineChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3'],
      datasets: [{
        label: 'ROI Over Time',
        data: [roi, roi * 1.5, roi * 2],
        borderColor: 'green',
        fill: false
      }]
    }
  });

  new Chart(document.getElementById('roiBarChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Year 1 ROI'],
      datasets: [{
        label: 'ROI (%)',
        data: [roi],
        backgroundColor: ['#00BFFF']
      }]
    }
  });

  new Chart(document.getElementById('roiPieChart').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Investment Return', 'Remaining Investment'],
      datasets: [{
        data: [profit, invest - profit],
        backgroundColor: ['#90EE90', '#d3d3d3']
      }]
    }
  });
}

window.onload = () => showTab('padel');
