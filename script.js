
function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function calculate() {
  // Padel
  const courts = +document.getElementById('courts').value;
  const hours_day = +document.getElementById('hours_day').value;
  const peak_hours = +document.getElementById('peak_hours_day').value;
  const off_hours = hours_day - peak_hours;
  const peak_rate = +document.getElementById('peak_rate').value;
  const offpeak_rate = +document.getElementById('offpeak_rate').value;
  const peak_util = +document.getElementById('peak_util').value / 100;
  const off_util = +document.getElementById('offpeak_util').value / 100;

  const padel_staff = +document.getElementById('padel_staff').value * 12;
  const padel_oh = +document.getElementById('padel_oh').value * 12;
  const padel_setup = +document.getElementById('padel_setup').value;

  const padel_rev = courts * 7 * 52 * (
    peak_hours * peak_rate * peak_util + off_hours * offpeak_rate * off_util
  );

  // Gym
  const target_members = +document.getElementById('gym_members').value;
  const ramp_months = +document.getElementById('ramp_months').value;
  const gym_fee = +document.getElementById('gym_fee').value;
  const gym_extra = +document.getElementById('gym_extra').value;
  const gym_staff = +document.getElementById('gym_staff').value * 12;
  const gym_oh = +document.getElementById('gym_oh').value * 12;
  const gym_setup = +document.getElementById('gym_setup').value;

  const avg_members = (target_members * (ramp_months + (12 - ramp_months))) / 12;
  const gym_rev = (avg_members * gym_fee + gym_extra) * 12;

  // Combined
  const total_rev = padel_rev + gym_rev;
  const total_cost = padel_staff + padel_oh + gym_staff + gym_oh;
  const total_profit = total_rev - total_cost;
  const total_setup = padel_setup + gym_setup;
  const roi = total_profit > 0 ? (total_setup / total_profit).toFixed(2) : "N/A";

  document.getElementById('results').innerHTML = `
    <h3>Results</h3>
    <strong>Total Revenue:</strong> €${total_rev.toLocaleString()}<br/>
    <strong>Total Costs:</strong> €${total_cost.toLocaleString()}<br/>
    <strong>Annual Profit:</strong> €${total_profit.toLocaleString()}<br/>
    <strong>Total Investment:</strong> €${total_setup.toLocaleString()}<br/>
    <strong>ROI (Years):</strong> ${roi}
  `;

  const ctx = document.getElementById('investmentChart').getContext('2d');
  if (window.investmentChart) window.investmentChart.destroy();
  window.investmentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Padel Setup', 'Gym Setup'],
      datasets: [{
        data: [padel_setup, gym_setup],
        backgroundColor: ['#42a5f5', '#66bb6a']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Investment Breakdown' }
      }
    }
  });
}
