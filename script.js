// Show tab function
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// Calculate Padel Financials
function calculatePadel() {
  const courts = +document.getElementById('padelCourts').value;
  const courtCost = +document.getElementById('padelCourtCost').value;
  const ground = +document.getElementById('padelGround').value;
  const structure = +document.getElementById('padelStructure').value;

  const investment = ground + structure + (courts * courtCost);

  const peakHours = +document.getElementById('padelPeakHours').value;
  const offHours = +document.getElementById('padelOffHours').value;
  const peakRate = +document.getElementById('padelPeakRate').value;
  const offRate = +document.getElementById('padelOffRate').value;
  const peakUtil = +document.getElementById('padelPeakUtil').value / 100;
  const offUtil = +document.getElementById('padelOffUtil').value / 100;
  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;

  const revenue = (
    (peakHours * peakRate * peakUtil + offHours * offRate * offUtil) * courts * days * weeks
  );

  const overheads = [
    'padelUtil', 'padelInsure', 'padelMaint', 'padelMarket',
    'padelAdmin', 'padelClean', 'padelMisc'
  ].reduce((sum, id) => sum + (+document.getElementById(id).value), 0);

  const staffRoles = [
    'FtMgr', 'FtRec', 'FtCoach', 'FtMaint', 'FtClean',
    'PtMgr', 'PtRec', 'PtCoach', 'PtMaint', 'PtClean'
  ];

  const staffCost = staffRoles.reduce((sum, role) => {
    const qty = +document.getElementById(`padel${role}`).value;
    const sal = +document.getElementById(`padel${role}Sal`).value;
    return sum + (qty * sal);
  }, 0);

  const profit = revenue - overheads - staffCost;
  const roi = investment > 0 ? (profit / investment * 100).toFixed(1) : 0;

  document.getElementById("padelSummary").innerHTML = `
    <strong>Investment:</strong> €${investment.toLocaleString()}<br/>
    <strong>Annual Revenue:</strong> €${revenue.toLocaleString()}<br/>
    <strong>Overheads:</strong> €${overheads.toLocaleString()}<br/>
    <strong>Staff:</strong> €${staffCost.toLocaleString()}<br/>
    <strong>Profit:</strong> €${profit.toLocaleString()}<br/>
    <strong>ROI:</strong> ${roi}%
  `;
}

// Calculate Gym Financials
function calculateGym() {
  const investment = [
    'gymEquip', 'gymFloor', 'gymAmen'
  ].reduce((sum, id) => sum + (+document.getElementById(id).value), 0);

  const weekMembers = +document.getElementById('gymWeekMembers').value;
  const weekFee = +document.getElementById('gymWeekFee').value;
  const monthMembers = +document.getElementById('gymMonthMembers').value;
  const monthFee = +document.getElementById('gymMonthFee').value;
  const yearMembers = +document.getElementById('gymAnnualMembers').value;
  const yearFee = +document.getElementById('gymAnnualFee').value;

  let revenue = (weekMembers * weekFee * 52) + (monthMembers * monthFee * 12) + (yearMembers * yearFee);

  if (document.getElementById('gymRamp').checked) {
    revenue *= 0.6; // 60% revenue ramp-up assumption
  }

  const overheads = [
    'gymUtil', 'gymInsure', 'gymMaint', 'gymMarket',
    'gymAdmin', 'gymClean', 'gymMisc'
  ].reduce((sum, id) => sum + (+document.getElementById(id).value), 0);

  const staffRoles = [
    'FtMgr', 'FtRec', 'FtTrainer', 'FtMaint', 'FtClean',
    'PtMgr', 'PtRec', 'PtTrainer', 'PtMaint', 'PtClean'
  ];

  const staffCost = staffRoles.reduce((sum, role) => {
    const qty = +document.getElementById(`gym${role}`).value;
    const sal = +document.getElementById(`gym${role}Sal`).value;
    return sum + (qty * sal);
  }, 0);

  const profit = revenue - overheads - staffCost;
  const roi = investment > 0 ? (profit / investment * 100).toFixed(1) : 0;

  document.getElementById("gymSummary").innerHTML = `
    <strong>Investment:</strong> €${investment.toLocaleString()}<br/>
    <strong>Annual Revenue:</strong> €${revenue.toLocaleString()}<br/>
    <strong>Overheads:</strong> €${overheads.toLocaleString()}<br/>
    <strong>Staff:</strong> €${staffCost.toLocaleString()}<br/>
    <strong>Profit:</strong> €${profit.toLocaleString()}<br/>
    <strong>ROI:</strong> ${roi}%
  `;
}
