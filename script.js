function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

document.getElementById("gymRamp").addEventListener("change", () => {
  document.getElementById("rampUpSettings").style.display = 
    document.getElementById("gymRamp").checked ? "block" : "none";
});

let financials = {
  padelRevenue: 0,
  gymRevenue: 0,
  padelCosts: 0,
  gymCosts: 0,
  totalInvestment: 0
};

function calculatePadel() {
  const ground = +document.getElementById("padelGround").value;
  const structure = +document.getElementById("padelStructure").value;
  const amenities = +document.getElementById("padelAmen").value;
  const courts = +document.getElementById("padelCourts").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const peakHours = +document.getElementById("padelPeakHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offHours = +document.getElementById("padelOffHours").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const util = (peakHours * peakRate * peakUtil + offHours * offRate * offUtil) * days * weeks * courts;

  const ops = ["Util", "Insure", "Maint", "Market", "Admin", "Clean", "Misc"]
    .map(id => +document.getElementById("padel" + id).value)
    .reduce((a, b) => a + b, 0);

  const staff = (
    +document.getElementById("padelFtMgr").value * +document.getElementById("padelFtMgrSal").value +
    +document.getElementById("padelFtRec").value * +document.getElementById("padelFtRecSal").value +
    +document.getElementById("padelFtCoach").value * +document.getElementById("padelFtCoachSal").value +
    +document.getElementById("padelPtCoach").value * +document.getElementById("padelPtCoachSal").value +
    +document.getElementById("padelAddStaff").value * +document.getElementById("padelAddStaffSal").value
  );

  const investment = ground + structure + amenities + courts * courtCost;
  financials.padelRevenue = util;
  financials.padelCosts = ops + staff;
  financials.totalInvestment += investment;

  document.getElementById("padelSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${util.toFixed(2)}<br>
    <strong>Annual Operational Costs:</strong> €${(ops + staff).toFixed(2)}<br>
    <strong>Total Investment:</strong> €${investment.toFixed(2)}
  `;
}

function calculateGym() {
  const equip = +document.getElementById("gymEquip").value;
  const floor = +document.getElementById("gymFloor").value;
  const amen = +document.getElementById("gymAmen").value;
  const weekMem = +document.getElementById("gymWeekMembers").value;
  const weekFee = +document.getElementById("gymWeekFee").value;
  const monthMem = +document.getElementById("gymMonthMembers").value;
  const monthFee = +document.getElementById("gymMonthFee").value;
  const yearMem = +document.getElementById("gymAnnualMembers").value;
  const yearFee = +document.getElementById("gymAnnualFee").value;

  let rev = (weekMem * weekFee * 52) + (monthMem * monthFee * 12) + (yearMem * yearFee);
  if (document.getElementById("gymRamp").checked) {
    const duration = +document.getElementById("rampDuration").value;
    const effect = +document.getElementById("rampEffect").value / 100;
    const ramped = (rev / 12 * duration * effect) + (rev / 12 * (12 - duration));
    rev = ramped;
  }

  const ops = ["Util", "Insure", "Maint", "Market", "Admin", "Clean", "Misc"]
    .map(id => +document.getElementById("gym" + id).value)
    .reduce((a, b) => a + b, 0);

  const staff = (
    +document.getElementById("gymFtTrainer").value * +document.getElementById("gymFtTrainerSal").value +
    +document.getElementById("gymPtTrainer").value * +document.getElementById("gymPtTrainerSal").value +
    +document.getElementById("gymAddStaff").value * +document.getElementById("gymAddStaffSal").value
  );

  const investment = equip + floor + amen;
  financials.gymRevenue = rev;
  financials.gymCosts = ops + staff;
  financials.totalInvestment += investment;

  document.getElementById("gymSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${rev.toFixed(2)}<br>
    <strong>Annual Operational Costs:</strong> €${(ops + staff).toFixed(2)}<br>
    <strong>Total Investment:</strong> €${investment.toFixed(2)}
  `;
  updatePnL();
  updateROI();
}

function updatePnL() {
  const rev = financials.padelRevenue + financials.gymRevenue;
  const cost = financials.padelCosts + financials.gymCosts;
  const profit = rev - cost;
  const ebitda = profit;
  const margin = (profit / rev) * 100;

  document.getElementById("pnlSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${rev.toFixed(2)}<br>
    <strong>Annual Costs:</strong> €${cost.toFixed(2)}<br>
    <strong>EBITDA:</strong> €${ebitda.toFixed(2)}<br>
    <strong>Net Margin:</strong> ${margin.toFixed(1)}%
  `;

  const ctx = document.getElementById("pnlChart").getContext("2d");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Revenue", "Costs", "Profit"],
      datasets: [{
        label: "Annual €",
        data: [rev, cost, profit],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3']
      }]
    }
  });
}

function updateROI() {
  const revAdj = +document.getElementById("revenueAdjust").value / 100;
  const costAdj = +document.getElementById("costAdjust").value / 100;

  const rev = (financials.padelRevenue + financials.gymRevenue) * revAdj;
  const cost = (financials.padelCosts + financials.gymCosts) * costAdj;
  const profit = rev - cost;
  const investment = financials.totalInvestment;

  let cum = 0, paybackYear = "N/A";
  const roiData = [];
  for (let i = 1; i <= 10; i++) {
    cum += profit;
    roiData.push(cum);
    if (cum >= investment && paybackYear === "N/A") paybackYear = i;
  }

  document.getElementById("roiSummary").innerHTML = `
    <strong>Total Investment:</strong> €${investment.toFixed(2)}<br>
    <strong>Annual Profit (adjusted):</strong> €${profit.toFixed(2)}<br>
    <strong>Estimated Payback Year:</strong> ${paybackYear}
  `;

  new Chart(document.getElementById("roiLineChart"), {
    type: "line",
    data: {
      labels: Array.from({length: 10}, (_, i) => `Year ${i+1}`),
      datasets: [{ label: "Cumulative Profit", data: roiData, borderColor: "#4caf50" }]
    }
  });
}
