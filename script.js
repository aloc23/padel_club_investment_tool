function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function calculatePadel() {
  const courts = +document.getElementById('courts').value;
  const structure = +document.getElementById('structure').value;
  const ground = +document.getElementById('ground').value;
  const court = +document.getElementById('court').value;
  const amenities = +document.getElementById('amenities').value;
  const peak = +document.getElementById('peak').value;
  const offpeak = +document.getElementById('offpeak').value;
  const peakUtil = +document.getElementById('peakUtil').value / 100;
  const offUtil = +document.getElementById('offUtil').value / 100;
  const hours = +document.getElementById('hours').value;
  const days = +document.getElementById('days').value;
  const weeks = +document.getElementById('weeks').value;
  const padelStaff = +document.getElementById('padelStaff').value;
  const padelOver = +document.getElementById('padelOverheads').value;

  const totalCost = structure + ground + (court * courts) + amenities;
  const sessionsPerCourt = hours * days * weeks;
  const peakSessions = sessionsPerCourt * 0.5 * peakUtil;
  const offSessions = sessionsPerCourt * 0.5 * offUtil;
  const revenue = courts * ((peakSessions * peak) + (offSessions * offpeak));
  const annualCost = padelStaff + padelOver;
  const profit = revenue - annualCost;

  document.getElementById('padelSummary').innerHTML = `
    <p>Total Investment: €${totalCost.toLocaleString()}</p>
    <p>Annual Revenue: €${Math.round(revenue).toLocaleString()}</p>
    <p>Annual Costs: €${annualCost.toLocaleString()}</p>
    <p><strong>Profit: €${Math.round(profit).toLocaleString()}</strong></p>
  `;
  drawCharts(revenue, annualCost, totalCost);
}

function calculateGym() {
  const equip = +document.getElementById('equip').value;
  const gymAmenities = +document.getElementById('gymAmenities').value;
  const floor = +document.getElementById('floor').value;
  const members = +document.getElementById('members').value;
  const fee = +document.getElementById('fee').value;
  const gymStaff = +document.getElementById('gymStaff').value;
  const gymOver = +document.getElementById('gymOverheads').value;
  const ramp = document.getElementById('ramp').checked;

  const investment = equip + gymAmenities + floor;
  const rampFactor = ramp ? 0.6 : 1;
  const revenue = members * fee * rampFactor;
  const cost = gymStaff + gymOver;
  const profit = revenue - cost;

  document.getElementById('gymSummary').innerHTML = `
    <p>Total Investment: €${investment.toLocaleString()}</p>
    <p>Annual Revenue: €${Math.round(revenue).toLocaleString()}</p>
    <p>Annual Costs: €${cost.toLocaleString()}</p>
    <p><strong>Profit: €${Math.round(profit).toLocaleString()}</strong></p>
  `;
  drawCharts(revenue, cost, investment);
}

let pnlChart, roiChart;
function drawCharts(revenue, costs, investment) {
  const months = [...Array(12).keys()].map(m => `Month ${m + 1}`);
  const monthlyRevenue = revenue / 12;
  const monthlyCost = costs / 12;
  const profit = monthlyRevenue - monthlyCost;

  if (pnlChart) pnlChart.destroy();
  pnlChart = new Chart(document.getElementById('pnlChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Revenue', data: Array(12).fill(monthlyRevenue), backgroundColor: 'green' },
        { label: 'Costs', data: Array(12).fill(monthlyCost), backgroundColor: 'red' },
        { label: 'Profit', data: Array(12).fill(profit), backgroundColor: 'blue' }
      ]
    }
  });

  const roi = revenue / investment;
  if (roiChart) roiChart.destroy();
  roiChart = new Chart(document.getElementById('roiChart'), {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'ROI Progression',
        data: months.map((_, i) => (profit * (i + 1)) / investment),
        borderColor: 'orange'
      }]
    }
  });
}
