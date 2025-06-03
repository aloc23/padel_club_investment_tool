function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function calculatePadel() {
  const courts = +document.getElementById("padelCourts").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const ground = +document.getElementById("padelGround").value;
  const structure = +document.getElementById("padelStructure").value;
  const amenities = +document.getElementById("padelAmenities")?.value || 0;

  const investment = ground + structure + (courts * courtCost) + amenities;

  const peakH = +document.getElementById("padelPeakHours").value;
  const peakR = +document.getElementById("padelPeakRate").value;
  const peakU = +document.getElementById("padelPeakUtil").value / 100;
  const offH = +document.getElementById("padelOffHours").value;
  const offR = +document.getElementById("padelOffRate").value;
  const offU = +document.getElementById("padelOffUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const revenue = courts * ((peakH * peakR * peakU) + (offH * offR * offU)) * days * weeks;

  const util = +document.getElementById("padelUtil").value;
  const insure = +document.getElementById("padelInsure").value;
  const maint = +document.getElementById("padelMaint").value;
  const market = +document.getElementById("padelMarket").value;
  const admin = +document.getElementById("padelAdmin").value;
  const clean = +document.getElementById("padelClean").value;
  const misc = +document.getElementById("padelMisc").value;

  const staffCost = (
    +document.getElementById("padelFtMgr").value * +document.getElementById("padelFtMgrSal").value +
    +document.getElementById("padelFtRec").value * +document.getElementById("padelFtRecSal").value +
    +document.getElementById("padelFtCoach").value * +document.getElementById("padelFtCoachSal").value +
    +document.getElementById("padelPtCoach").value * +document.getElementById("padelPtCoachSal").value +
    +document.getElementById("padelAddStaff").value * +document.getElementById("padelAddStaffSal").value
  );

  const opCost = util + insure + maint + market + admin + clean + misc + staffCost;

  document.getElementById("padelSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Annual Costs:</strong> €${opCost.toFixed(2)}<br>
    <strong>Total Investment:</strong> €${investment.toFixed(2)}<br>
  `;

  window.padel = { revenue, opCost, investment };
}

function calculateGym() {
  const equip = +document.getElementById("gymEquip").value;
  const floor = +document.getElementById("gymFloor").value;
  const amen = +document.getElementById("gymAmen").value;

  const investment = equip + floor + amen;

  let weekM = +document.getElementById("gymWeekMembers").value;
  const weekF = +document.getElementById("gymWeekFee").value;
  let monthM = +document.getElementById("gymMonthMembers").value;
  const monthF = +document.getElementById("gymMonthFee").value;
  let yearM = +document.getElementById("gymAnnualMembers").value;
  const yearF = +document.getElementById("gymAnnualFee").value;

  const ramp = document.getElementById("gymRamp").checked;
  let rampMult = 1;
  if (ramp) {
    const duration = +document.getElementById("rampDuration").value;
    const effect = +document.getElementById("rampEffect").value / 100;
    rampMult = (duration / 12 * effect + (12 - duration) / 12 * 1);
  }

  const revenue = (weekM * weekF * 52 + monthM * monthF * 12 + yearM * yearF) * rampMult;

  const util = +document.getElementById("gymUtil").value;
  const insure = +document.getElementById("gymInsure").value;
  const maint = +document.getElementById("gymMaint").value;
  const market = +document.getElementById("gymMarket").value;
  const admin = +document.getElementById("gymAdmin").value;
  const clean = +document.getElementById("gymClean").value;
  const misc = +document.getElementById("gymMisc").value;

  const staffCost = (
    +document.getElementById("gymFtTrainer").value * +document.getElementById("gymFtTrainerSal").value +
    +document.getElementById("gymPtTrainer").value * +document.getElementById("gymPtTrainerSal").value +
    +document.getElementById("gymAddStaff").value * +document.getElementById("gymAddStaffSal").value
  );

  const opCost = util + insure + maint + market + admin + clean + misc + staffCost;

  document.getElementById("gymSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${revenue.toFixed(2)}<br>
    <strong>Annual Costs:</strong> €${opCost.toFixed(2)}<br>
    <strong>Total Investment:</strong> €${investment.toFixed(2)}<br>
  `;

  window.gym = { revenue, opCost, investment };
}

function updateROI() {
  const roiText = document.getElementById("yearsToROIText");
  const totalInvestment = (window.padel?.investment || 0) + (window.gym?.investment || 0);
  const totalRevenue = (window.padel?.revenue || 0) + (window.gym?.revenue || 0);
  const totalCosts = (window.padel?.opCost || 0) + (window.gym?.opCost || 0);

  let cumulative = 0, years = 0;
  const trend = [];
  while (cumulative < totalInvestment && years < 50) {
    let profit = totalRevenue - totalCosts;
    cumulative += profit;
    trend.push(cumulative);
    years++;
  }

  roiText.innerHTML = years < 50 ? `ROI in ${years} year(s)` : "ROI not reached within 50 years";

  new Chart(document.getElementById("roiLineChart"), {
    type: "line",
    data: {
      labels: [...Array(years).keys()].map(i => `Year ${i + 1}`),
      datasets: [{
        label: "Cumulative Profit",
        data: trend,
        borderColor: "green",
        fill: false
      }]
    }
  });

  new Chart(document.getElementById("roiBarChart"), {
    type: "bar",
    data: {
      labels: ["Investment", "Revenue", "Costs"],
      datasets: [{
        label: "Total",
        data: [totalInvestment, totalRevenue, totalCosts],
        backgroundColor: ["red", "blue", "gray"]
      }]
    }
  });
}

function updatePnl() {
  const mode = document.querySelector('input[name="pl_toggle"]:checked').value;
  const totalRevenue = (window.padel?.revenue || 0) + (window.gym?.revenue || 0);
  const totalCosts = (window.padel?.opCost || 0) + (window.gym?.opCost || 0);
  const profit = totalRevenue - totalCosts;

  document.getElementById("pnlSummary").innerHTML = `
    <strong>${mode === "monthly" ? "Monthly" : "Annual"} Revenue:</strong> €${(totalRevenue / (mode === "monthly" ? 12 : 1)).toFixed(2)}<br>
    <strong>${mode === "monthly" ? "Monthly" : "Annual"} Costs:</strong> €${(totalCosts / (mode === "monthly" ? 12 : 1)).toFixed(2)}<br>
    <strong>Net Profit:</strong> €${(profit / (mode === "monthly" ? 12 : 1)).toFixed(2)}<br>
  `;

  new Chart(document.getElementById("pnlChart"), {
    type: "bar",
    data: {
      labels: ["Revenue", "Costs", "Profit"],
      datasets: [{
        label: "P&L Overview",
        data: [totalRevenue, totalCosts, profit],
        backgroundColor: ["blue", "gray", "green"]
      }]
    }
  });

  new Chart(document.getElementById("costPieChart"), {
    type: "pie",
    data: {
      labels: ["Padel", "Gym"],
      datasets: [{
        data: [window.padel?.opCost || 0, window.gym?.opCost || 0],
        backgroundColor: ["#f39c12", "#8e44ad"]
      }]
    }
  });
}

document.getElementById("gymRamp").addEventListener("change", function () {
  document.getElementById("rampUpSettings").style.display = this.checked ? "block" : "none";
});

document.querySelectorAll('input[name="pl_toggle"]').forEach(r => r.addEventListener("change", updatePnl));
