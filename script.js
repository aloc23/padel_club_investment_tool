function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
showTab('padel');

document.getElementById('gymRamp').addEventListener('change', () => {
  document.getElementById('rampSettings').style.display = document.getElementById('gymRamp').checked ? 'block' : 'none';
});

let padelRevenue = 0, padelCost = 0;
let gymRevenue = 0, gymCost = 0;

function calculatePadel() {
  const peak = +document.getElementById('padelPeakHours').value;
  const peakRate = +document.getElementById('padelPeakRate').value;
  const off = +document.getElementById('padelOffHours').value;
  const offRate = +document.getElementById('padelOffRate').value;
  const util = +document.getElementById('padelUtil').value / 100;
  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;

  padelRevenue = ((peak * peakRate) + (off * offRate)) * util * days * weeks;

  const utilCost = +document.getElementById('padelUtilCost').value;
  const insure = +document.getElementById('padelInsure').value;
  const market = +document.getElementById('padelMarket').value;
  const mgr = +document.getElementById('padelMgr') * +document.getElementById('padelMgrSal').value;
  const coach = +document.getElementById('padelCoach') * +document.getElementById('padelCoachSal').value;
  const add = +document.getElementById('padelAddStaff') * +document.getElementById('padelAddStaffSal').value;

  padelCost = utilCost + insure + market + mgr + coach + add;

  const profit = padelRevenue - padelCost;

  document.getElementById('padelSummary').innerHTML = `
    <strong>Annual Revenue:</strong> €${padelRevenue.toFixed(2)}<br>
    <strong>Annual Cost:</strong> €${padelCost.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}
  `;

  updatePnL();
  updateROI();
}

function calculateGym() {
  const w = +document.getElementById('gymWeekly') * +document.getElementById('gymWeeklyFee').value * 52;
  const m = +document.getElementById('gymMonthly') * +document.getElementById('gymMonthlyFee').value * 12;
  const a = +document.getElementById('gymAnnual') * +document.getElementById('gymAnnualFee').value;

  gymRevenue = w + m + a;

  if (document.getElementById('gymRamp').checked) {
    gymRevenue *= +document.getElementById('rampEffect').value / 100;
  }

  const util = +document.getElementById('gymUtilCost').value;
  const trainer = +document.getElementById('gymTrainer') * +document.getElementById('gymTrainerSal').value;
  const add = +document.getElementById('gymAddStaff') * +document.getElementById('gymAddStaffSal').value;

  gymCost = util + trainer + add;

  const profit = gymRevenue - gymCost;

  document.getElementById('gymSummary').innerHTML = `
    <strong>Annual Revenue:</strong> €${gymRevenue.toFixed(2)}<br>
    <strong>Annual Cost:</strong> €${gymCost.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}
  `;

  updatePnL();
  updateROI();
}

function updatePnL() {
  const ctx = document.getElementById('pnlChart').getContext('2d');
  if (window.pnlChart) window.pnlChart.destroy();
  window.pnlChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Padel', 'Gym'],
      datasets: [
        {
          label: 'Revenue (€)',
          data: [padelRevenue, gymRevenue],
          backgroundColor: '#66bb6a'
        },
        {
          label: 'Cost (€)',
          data: [padelCost, gymCost],
          backgroundColor: '#ef5350'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  document.getElementById('pnlSummary').innerHTML = `
    <strong>Total Revenue:</strong> €${(padelRevenue + gymRevenue).toFixed(2)}<br>
    <strong>Total Cost:</strong> €${(padelCost + gymCost).toFixed(2)}<br>
    <strong>Annual Profit:</strong> €${(padelRevenue + gymRevenue - padelCost - gymCost).toFixed(2)}
  `;
}

function updateROI() {
  const roi = padelRevenue + gymRevenue - padelCost - gymCost;
  const ctx = document.getElementById('roiChart').getContext('2d');
  if (window.roiChart) window.roiChart.destroy();

  window.roiChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      datasets: [{
        label: 'Cumulative Profit (€)',
        data: [roi, roi * 2, roi * 3, roi * 4, roi * 5],
        fill: false,
        borderColor: '#42a5f5',
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  document.getElementById('roiSummary').innerHTML = `
    <strong>Projected ROI over 5 years:</strong> €${(roi * 5).toFixed(2)}
  `;
}
