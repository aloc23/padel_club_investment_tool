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
}

window.onload = () => showTab('padel');
