function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}
showTab('padel');

document.getElementById('gymRamp').addEventListener('change', () => {
  document.getElementById('rampSettings').style.display = document.getElementById('gymRamp').checked ? 'block' : 'none';
});

function calculatePadel() {
  const peakHours = +document.getElementById('padelPeakHours').value;
  const peakRate = +document.getElementById('padelPeakRate').value;
  const offHours = +document.getElementById('padelOffHours').value;
  const offRate = +document.getElementById('padelOffRate').value;
  const util = +document.getElementById('padelUtil').value / 100;
  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;

  const revenue = ((peakHours * peakRate) + (offHours * offRate)) * util * days * weeks;

  const utilCost = +document.getElementById('padelUtilCost').value;
  const insure = +document.getElementById('padelInsure').value;
  const market = +document.getElementById('padelMarket').value;
  const overheads = utilCost + insure + market;

  const mgr = +document.getElementById('padelMgr') * +document.getElementById('padelMgrSal').value;
  const coach = +document.getElementById('padelCoach') * +document.getElementById('padelCoachSal').value;
  const addStaff = +document.getElementById('padelAddStaff') * +document.getElementById('padelAddStaffSal').value;
  const staff = mgr + coach + addStaff;

  const totalCost = overheads + staff;
  const profit = revenue - totalCost;

  document.getElementById('padelSummary').innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Overheads:</strong> €${overheads.toFixed(2)}<br>
    - Utilities: €${utilCost}<br>
    - Insurance: €${insure}<br>
    - Marketing: €${market}<br>
    <strong>Staff:</strong> €${staff.toFixed(2)}<br>
    - Managers: €${mgr}<br>
    - Coaches: €${coach}<br>
    - Additional Staff: €${addStaff}<br>
    <strong>Annual Profit:</strong> €${profit.toFixed(2)}
  `;
}

function calculateGym() {
  const weekly = +document.getElementById('gymWeekly') * +document.getElementById('gymWeeklyFee').value * 52;
  const monthly = +document.getElementById('gymMonthly') * +document.getElementById('gymMonthlyFee').value * 12;
  const annual = +document.getElementById('gymAnnual') * +document.getElementById('gymAnnualFee').value;
  let revenue = weekly + monthly + annual;

  if (document.getElementById('gymRamp').checked) {
    const rampPercent = +document.getElementById('rampEffect').value / 100;
    revenue *= rampPercent;
  }

  const utilCost = +document.getElementById('gymUtilCost').value;
  const overheads = utilCost;

  const trainer = +document.getElementById('gymTrainer') * +document.getElementById('gymTrainerSal').value;
  const addStaff = +document.getElementById('gymAddStaff') * +document.getElementById('gymAddStaffSal').value;
  const staff = trainer + addStaff;

  const totalCost = overheads + staff;
  const profit = revenue - totalCost;

  document.getElementById('gymSummary').innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Overheads:</strong> €${overheads.toFixed(2)}<br>
    - Utilities: €${utilCost}<br>
    <strong>Staff:</strong> €${staff.toFixed(2)}<br>
    - Trainers: €${trainer}<br>
    - Additional Staff: €${addStaff}<br>
    <strong>Annual Profit:</strong> €${profit.toFixed(2)}
  `;
}
