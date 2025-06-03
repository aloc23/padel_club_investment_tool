function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}

document.getElementById('gymRamp').addEventListener('change', function () {
  document.getElementById('rampUpSettings').style.display = this.checked ? 'block' : 'none';
});

function calculatePadel() {
  const courts = +document.getElementById('padelCourts').value;
  const courtCost = +document.getElementById('padelCourtCost').value;
  const ground = +document.getElementById('padelGround').value;
  const struct = +document.getElementById('padelStructure').value;

  const peakHours = +document.getElementById('padelPeakHours').value;
  const peakRate = +document.getElementById('padelPeakRate').value;
  const peakUtil = +document.getElementById('padelPeakUtil').value / 100;

  const offHours = +document.getElementById('padelOffHours').value;
  const offRate = +document.getElementById('padelOffRate').value;
  const offUtil = +document.getElementById('padelOffUtil').value / 100;

  const days = +document.getElementById('padelDays').value;
  const weeks = +document.getElementById('padelWeeks').value;

  const padelRevenue = courts * (
    peakHours * peakRate * peakUtil +
    offHours * offRate * offUtil
  ) * days * weeks;

  const opCosts = [
    'padelUtil', 'padelInsure', 'padelMaint', 'padelMarket', 'padelAdmin', 'padelClean', 'padelMisc'
  ].reduce((sum, id) => sum + (+document.getElementById(id).value), 0);

  const staffTotal =
    (+document.getElementById('padelFtMgr').value * +document.getElementById('padelFtMgrSal').value) +
    (+document.getElementById('padelFtRec').value * +document.getElementById('padelFtRecSal').value) +
    (+document.getElementById('padelFtCoach').value * +document.getElementById('padelFtCoachSal').value) +
    (+document.getElementById('padelPtCoach').value * +document.getElementById('padelPtCoachSal').value) +
    (+document.getElementById('padelAddStaff').value * +document.getElementById('padelAddStaffSal').value);

  const investment = ground + struct + (courts * courtCost);

  window.padelData = {
    revenue: padelRevenue,
    costs: opCosts + staffTotal,
    investment,
    staff: staffTotal,
    ops: opCosts
  };

  document.getElementById('padelSummary').innerHTML = `
    <p><strong>Annual Revenue:</strong> €${padelRevenue.toFixed(2)}</p>
    <p><strong>Operational Costs:</strong> €${opCosts.toFixed(2)}</p>
    <p><strong>Staff Costs:</strong> €${staffTotal.toFixed(2)}</p>
    <p><strong>Total Investment:</strong> €${investment.toFixed(2)}</p>
  `;
  updatePnL();
  updateROI();
}function calculateGym() {
  const equip = +document.getElementById('gymEquip').value;
  const floor = +document.getElementById('gymFloor').value;
  const amen = +document.getElementById('gymAmen').value;

  const weekMembers = +document.getElementById('gymWeekMembers').value;
  const weekFee = +document.getElementById('gymWeekFee').value;
  const monthMembers = +document.getElementById('gymMonthMembers').value;
  const monthFee = +document.getElementById('gymMonthFee').value;
  const yearMembers = +document.getElementById('gymAnnualMembers').value;
  const yearFee = +document.getElementById('gymAnnualFee').value;

  let rampFactor = 1;
  if (document.getElementById('gymRamp').checked) {
    const rampDuration = +document.getElementById('rampDuration').value;
    const rampEffect = +document.getElementById('rampEffect').value / 100;
    rampFactor = (rampEffect + 1) / 2;
  }

  const revenue = (
    (weekMembers * weekFee * 52) +
    (monthMembers * monthFee * 12) +
    (yearMembers * yearFee)
  ) * rampFactor;

  const opCosts = [
    'gymUtil', 'gymInsure', 'gymMaint', 'gymMarket', 'gymAdmin', 'gymClean', 'gymMisc'
  ].reduce((sum, id) => sum + (+document.getElementById(id).value), 0);

  const staffTotal =
    (+document.getElementById('gymFtTrainer').value * +document.getElementById('gymFtTrainerSal').value) +
    (+document.getElementById('gymPtTrainer').value * +document.getElementById('gymPtTrainerSal').value) +
    (+document.getElementById('gymAddStaff').value * +document.getElementById('gymAddStaffSal').value);

  const investment = equip + floor + amen;

  window.gymData = {
    revenue,
    costs: opCosts + staffTotal,
    investment,
    staff: staffTotal,
    ops: opCosts
  };

  document.getElementById('gymSummary').innerHTML = `
    <p><strong>Annual Revenue:</strong> €${revenue.toFixed(2)}</p>
    <p><strong>Operational Costs:</strong> €${opCosts.toFixed(2)}</p>
    <p><strong>Staff Costs:</strong> €${staffTotal.toFixed(2)}</p>
    <p><strong>Total Investment:</strong> €${investment.toFixed(2)}</p>
  `;
  updatePnL();
  updateROI();
}

function updatePnL() {
  const totalRevenue = (window.padelData?.revenue || 0) + (window.gymData?.revenue || 0);
  const totalCosts = (window.padelData?.costs || 0) + (window.gymData?.costs || 0);
  const profit = totalRevenue - totalCosts;
  const profitMonthly = profit / 12;

  document.getElementById('pnlSummary').innerHTML = `
    <p><strong>Annual Profit:</strong> €${profit.toFixed(2)}</p>
    <p><strong>Monthly Profit:</strong> €${profitMonthly.toFixed(2)}</p>
  `;

  const mode = document.querySelector('input[name="pl_toggle"]:checked').value;
  const labels = mode === "monthly" ? Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`) : ['Annual'];
  const profits = mode === "monthly" ? Array(12).fill(profitMonthly) : [profit];

  new Chart(document.getElementById("pnlChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Profit", data: profits, backgroundColor: "green" }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  new Chart(document.getElementById("profitTrendChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Cumulative Profit", data: profits.map((v, i) => v * (i + 1)), borderColor: "blue", fill: false }]
    },
    options: { responsive: true }
  });

  new Chart(document.getElementById("costPieChart"), {
    type: "pie",
    data: {
      labels: ["Padel", "Gym"],
      datasets: [{
        data: [(window.padelData?.costs || 0), (window.gymData?.costs || 0)],
        backgroundColor: ["#3498db", "#e67e22"]
      }]
    }
  });
}

function updateROI() {
  const totalInvestment = (window.padelData?.investment || 0) + (window.gymData?.investment || 0);
  const totalProfitAnnual = ((window.padelData?.revenue || 0) + (window.gymData?.revenue || 0)) -
                            ((window.padelData?.costs || 0) + (window.gymData?.costs || 0));

  let cumulative = 0;
  let roiYears = 0;
  for (let i = 1; i <= 10; i++) {
    cumulative += totalProfitAnnual;
    if (roiYears === 0 && cumulative >= totalInvestment) roiYears = i;
  }

  document.getElementById("yearsToROIText").innerText =
    `Estimated Years to ROI: ${roiYears > 0 ? roiYears : "Not within 10 years"}`;

  const labels = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`);
  const cumulativeData = labels.map((_, i) => totalProfitAnnual * (i + 1));

  new Chart(document.getElementById("roiLineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Cumulative Profit", data: cumulativeData, borderColor: "blue", fill: false }]
    },
    options: { responsive: true }
  });

  new Chart(document.getElementById("roiBarChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Annual Profit", data: Array(10).fill(totalProfitAnnual), backgroundColor: "green" }]
    }
  });

  new Chart(document.getElementById("roiPieChart"), {
    type: "pie",
    data: {
      labels: ["Padel", "Gym"],
      datasets: [{
        data: [(window.padelData?.revenue || 0), (window.gymData?.revenue || 0)],
        backgroundColor: ["#2ecc71", "#f39c12"]
      }]
    }
  });

  new Chart(document.getElementById("roiBreakEvenChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Investment vs Return",
        data: labels.map((_, i) => totalProfitAnnual * (i + 1) - totalInvestment),
        borderColor: "red",
        fill: false
      }]
    }
  });
}
