// script.js

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// Ramp-Up toggle
const rampToggle = document.getElementById('gymRamp');
if (rampToggle) {
  rampToggle.addEventListener('change', function () {
    document.getElementById('rampUpSettings').style.display = this.checked ? 'block' : 'none';
  });
}

function calculatePadel() {
  const courts = +document.getElementById('padelCourts').value;
  const courtCost = +document.getElementById('padelCourtCost').value;
  const ground = +document.getElementById('padelGround').value;
  const structure = +document.getElementById('padelStructure').value;
  const peakH = +document.getElementById('padelPeakHours').value;
  const peakR = +document.getElementById('padelPeakRate').value;
  const peakU = +document.getElementById('padelPeakUtil').value / 100;
  const offH = +document.getElementById('padelOffHours').value;
  const offR = +document.getElementById('padelOffRate').value;
  const offU = +document.getElementById('padelOffUtil').value / 100;
  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;

  const revenue = courts * ((peakH * peakR * peakU) + (offH * offR * offU)) * days * weeks;

  const util = +document.getElementById('padelUtil').value;
  const insure = +document.getElementById('padelInsure').value;
  const maint = +document.getElementById('padelMaint').value;
  const market = +document.getElementById('padelMarket').value;
  const admin = +document.getElementById('padelAdmin').value;
  const clean = +document.getElementById('padelClean').value;
  const misc = +document.getElementById('padelMisc').value;
  const ops = util + insure + maint + market + admin + clean + misc;

  const mgr = +document.getElementById('padelFtMgr').value * +document.getElementById('padelFtMgrSal').value;
  const rec = +document.getElementById('padelFtRec').value * +document.getElementById('padelFtRecSal').value;
  const coachFT = +document.getElementById('padelFtCoach').value * +document.getElementById('padelFtCoachSal').value;
  const coachPT = +document.getElementById('padelPtCoach').value * +document.getElementById('padelPtCoachSal').value;
  const add = +document.getElementById('padelAddStaff').value * +document.getElementById('padelAddStaffSal').value;
  const staff = mgr + rec + coachFT + coachPT + add;

  const invest = ground + structure + (courtCost * courts);
  const profit = revenue - ops - staff;

  document.getElementById('padelSummary').innerHTML = `
    <strong>Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Operational Costs:</strong> €${ops.toFixed(2)}<br>
    <strong>Staff Costs:</strong> €${staff.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}<br>
    <strong>Investment:</strong> €${invest.toFixed(2)}
  `;
  return { invest, revenue, ops, staff };
}

function calculateGym() {
  const equip = +document.getElementById('gymEquip').value;
  const floor = +document.getElementById('gymFloor').value;
  const amen = +document.getElementById('gymAmen').value;
  const invest = equip + floor + amen;

  const wMem = +document.getElementById('gymWeekMembers').value * +document.getElementById('gymWeekFee').value * 52;
  const mMem = +document.getElementById('gymMonthMembers').value * +document.getElementById('gymMonthFee').value * 12;
  const aMem = +document.getElementById('gymAnnualMembers').value * +document.getElementById('gymAnnualFee').value;

  let revenue = wMem + mMem + aMem;

  if (document.getElementById('gymRamp').checked) {
    const months = +document.getElementById('rampDuration').value;
    const effect = +document.getElementById('rampEffect').value / 100;
    const rampFactor = (months / 12) * effect + ((12 - months) / 12);
    revenue *= rampFactor;
  }

  const util = +document.getElementById('gymUtil').value;
  const insure = +document.getElementById('gymInsure').value;
  const maint = +document.getElementById('gymMaint').value;
  const market = +document.getElementById('gymMarket').value;
  const admin = +document.getElementById('gymAdmin').value;
  const clean = +document.getElementById('gymClean').value;
  const misc = +document.getElementById('gymMisc').value;
  const ops = util + insure + maint + market + admin + clean + misc;

  const ft = +document.getElementById('gymFtTrainer').value * +document.getElementById('gymFtTrainerSal').value;
  const pt = +document.getElementById('gymPtTrainer').value * +document.getElementById('gymPtTrainerSal').value;
  const add = +document.getElementById('gymAddStaff').value * +document.getElementById('gymAddStaffSal').value;
  const staff = ft + pt + add;

  const profit = revenue - ops - staff;

  document.getElementById('gymSummary').innerHTML = `
    <strong>Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Operational Costs:</strong> €${ops.toFixed(2)}<br>
    <strong>Staff Costs:</strong> €${staff.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}<br>
    <strong>Investment:</strong> €${invest.toFixed(2)}
  `;
  return { invest, revenue, ops, staff };
}

function updateROI() {
  const padel = calculatePadel();
  const gym = calculateGym();

  const totalInvest = padel.invest + gym.invest;
  const totalProfit = (padel.revenue + gym.revenue) - (padel.ops + gym.ops + padel.staff + gym.staff);
  const yearsToROI = totalProfit > 0 ? (totalInvest / totalProfit).toFixed(2) : 'N/A';

  document.getElementById('yearsToROIText').textContent = `Estimated Years to ROI: ${yearsToROI}`;

  const ctx = document.getElementById('roiLineChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...Array(10).keys()].map(i => `Year ${i + 1}`),
      datasets: [{
        label: 'Cumulative ROI (€)',
        data: [...Array(10).keys()].map(i => (i + 1) * totalProfit - totalInvest),
        borderColor: 'green',
        fill: false
      }]
    },
    options: { responsive: true }
  });
}

showTab('padel');
