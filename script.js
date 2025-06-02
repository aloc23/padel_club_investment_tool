
function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function calculate() {
  // Padel Revenue
  const courtCount = +document.getElementById('padel_court_count').value;
  const hours = +document.getElementById('padel_hours').value;
  const peak = +document.getElementById('padel_peak').value;
  const off = hours - peak;
  const peakRate = +document.getElementById('padel_peak_rate').value;
  const peakUtil = +document.getElementById('padel_peak_util').value / 100;
  const offRate = +document.getElementById('padel_off_rate').value;
  const offUtil = +document.getElementById('padel_off_util').value / 100;

  const padelRev = courtCount * 7 * 52 * (
    peak * peakRate * peakUtil + off * offRate * offUtil
  );

  // Gym Revenue
  const members = +document.getElementById('gym_members').value;
  const ramp = +document.getElementById('gym_ramp').value;
  const fee = +document.getElementById('gym_fee').value;
  const extra = +document.getElementById('gym_extra').value;

  const avgMembers = (members * (ramp + (12 - ramp))) / 12;
  const gymRev = (avgMembers * fee + extra) * 12;

  // Investment Costs
  const padelSetup = [
    +document.getElementById('padel_structure').value,
    +document.getElementById('padel_ground').value,
    +document.getElementById('padel_courts').value,
    +document.getElementById('padel_amenities').value
  ].reduce((a,b) => a+b, 0);

  const gymSetup = [
    +document.getElementById('gym_equip').value,
    +document.getElementById('gym_floor').value,
    +document.getElementById('gym_amen').value,
    +document.getElementById('gym_fit').value
  ].reduce((a,b) => a+b, 0);

  // Operational Costs
  const padelOps = (
    +document.getElementById('padel_oh').value +
    +document.getElementById('padel_maint').value +
    +document.getElementById('padel_staff').value
  ) * 12;

  const gymOps = (
    +document.getElementById('gym_oh').value +
    +document.getElementById('gym_maint').value +
    +document.getElementById('gym_staff').value
  ) * 12;

  const totalRevenue = padelRev + gymRev;
  const totalCosts = padelOps + gymOps;
  const netProfit = totalRevenue - totalCosts;
  const totalSetup = padelSetup + gymSetup;
  const roi = netProfit > 0 ? (totalSetup / netProfit).toFixed(2) : "N/A";

  document.getElementById('pl_output').innerHTML = `
    <h3>Annual Profit & Loss</h3>
    <strong>Total Revenue:</strong> €${totalRevenue.toLocaleString()}<br/>
    <strong>Total Operating Costs:</strong> €${totalCosts.toLocaleString()}<br/>
    <strong>Annual Net Profit:</strong> €${netProfit.toLocaleString()}
  `;

  document.getElementById('roi_output').innerHTML = `
    <h3>ROI Summary</h3>
    <strong>Total Investment:</strong> €${totalSetup.toLocaleString()}<br/>
    <strong>Annual Net Profit:</strong> €${netProfit.toLocaleString()}<br/>
    <strong>ROI (Years):</strong> ${roi}
  `;

  const ctx = document.getElementById('investmentChart').getContext('2d');
  if (window.investmentChart) window.investmentChart.destroy();
  window.investmentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Padel Setup', 'Gym Setup'],
      datasets: [{
        data: [padelSetup, gymSetup],
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
