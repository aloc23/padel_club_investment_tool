// script.js

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

function calculatePadel() {
  const courts = +document.getElementById('padelCourts').value;
  const courtCost = +document.getElementById('padelCourtCost').value;
  const ground = +document.getElementById('padelGround').value;
  const struct = +document.getElementById('padelStructure').value;

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

  const ftMgr = +document.getElementById('padelFtMgr').value * +document.getElementById('padelFtMgrSal').value;
  const ftRec = +document.getElementById('padelFtRec').value * +document.getElementById('padelFtRecSal').value;
  const ftCoach = +document.getElementById('padelFtCoach').value * +document.getElementById('padelFtCoachSal').value;
  const ptCoach = +document.getElementById('padelPtCoach').value * +document.getElementById('padelPtCoachSal').value;

  const staff = ftMgr + ftRec + ftCoach + ptCoach;
  const ops = util + insure + maint + market + admin + clean + misc;

  const invest = ground + struct + (courts * courtCost);
  const profit = revenue - ops - staff;

  document.getElementById('padelSummary').innerHTML = `
    <strong>Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Operational Costs:</strong> €${ops.toFixed(2)}<br>
    <strong>Staff Costs:</strong> €${staff.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}<br>
    <strong>Investment:</strong> €${invest.toFixed(2)}
  `;
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
  if (document.getElementById('gymRamp').checked) revenue *= 0.7;

  const util = +document.getElementById('gymUtil').value;
  const insure = +document.getElementById('gymInsure').value;
  const maint = +document.getElementById('gymMaint').value;
  const market = +document.getElementById('gymMarket').value;
  const admin = +document.getElementById('gymAdmin').value;
  const clean = +document.getElementById('gymClean').value;
  const misc = +document.getElementById('gymMisc').value;

  const ft = +document.getElementById('gymFtTrainer').value * +document.getElementById('gymFtTrainerSal').value;
  const pt = +document.getElementById('gymPtTrainer').value * +document.getElementById('gymPtTrainerSal').value;
  const staff = ft + pt;

  const ops = util + insure + maint + market + admin + clean + misc;
  const profit = revenue - ops - staff;

  document.getElementById('gymSummary').innerHTML = `
    <strong>Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Operational Costs:</strong> €${ops.toFixed(2)}<br>
    <strong>Staff Costs:</strong> €${staff.toFixed(2)}<br>
    <strong>Profit:</strong> €${profit.toFixed(2)}<br>
    <strong>Investment:</strong> €${invest.toFixed(2)}
  `;
}

function updateROI() {
  const padelRev = parseFloat(document.getElementById('padelSummary').textContent.match(/Revenue:\s€([\d.]+)/)?.[1] || 0);
  const padelOps = parseFloat(document.getElementById('padelSummary').textContent.match(/Operational Costs:\s€([\d.]+)/)?.[1] || 0);
  const padelStaff = parseFloat(document.getElementById('padelSummary').textContent.match(/Staff Costs:\s€([\d.]+)/)?.[1] || 0);
  const padelInv = parseFloat(document.getElementById('padelSummary').textContent.match(/Investment:\s€([\d.]+)/)?.[1] || 0);

  const gymRev = parseFloat(document.getElementById('gymSummary').textContent.match(/Revenue:\s€([\d.]+)/)?.[1] || 0);
  const gymOps = parseFloat(document.getElementById('gymSummary').textContent.match(/Operational Costs:\s€([\d.]+)/)?.[1] || 0);
  const gymStaff = parseFloat(document.getElementById('gymSummary').textContent.match(/Staff Costs:\s€([\d.]+)/)?.[1] || 0);
  const gymInv = parseFloat(document.getElementById('gymSummary').textContent.match(/Investment:\s€([\d.]+)/)?.[1] || 0);

  const invest = padelInv + gymInv;
  const profit = (padelRev + gymRev) - (padelOps + gymOps + padelStaff + gymStaff);
  const roi = invest > 0 ? (profit / invest) * 100 : 0;
  const yearsToROI = profit > 0 ? (invest / profit).toFixed(1) : 'N/A';

  document.getElementById('yearsToROIText').innerHTML = `<strong>💡 Estimated Years to Break Even:</strong> ${yearsToROI} years`;

  new Chart(document.getElementById('roiLineChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3'],
      datasets: [{ label: 'ROI %', data: [roi, roi * 1.5, roi * 2] }]
    }
  });

  new Chart(document.getElementById('roiBarChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Year 1'],
      datasets: [{ label: 'ROI %', data: [roi], backgroundColor: 'blue' }]
    }
  });

  new Chart(document.getElementById('roiPieChart').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Profit', 'Remaining'],
      datasets: [{ data: [profit, invest - profit], backgroundColor: ['green', 'red'] }]
    }
  });

  new Chart(document.getElementById('roiBreakEvenChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      datasets: [
        {
          label: 'Cumulative ROI (%)',
          data: Array.from({ length: 5 }, (_, i) => ((profit * (i + 1)) / invest) * 100),
          borderColor: 'green',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Break-even (100%)',
          data: Array(5).fill(100),
          borderColor: 'red',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index' }
      },
      scales: {
        y: {
          title: { display: true, text: 'ROI (%)' },
          beginAtZero: true
        }
      }
    }
  });
}
