function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

document.getElementById("gymRamp").addEventListener("change", () => {
  document.getElementById("rampUpSettings").style.display =
    document.getElementById("gymRamp").checked ? "block" : "none";
});

let financials = {
  padelRevenue: 0,
  gymRevenue: 0,
  padelCost: 0,
  gymCost: 0,
  padelInvestment: 0,
  gymInvestment: 0,
};

function calculatePadel() {
  const courts = +document.getElementById("padelCourts").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const ground = +document.getElementById("padelGround").value;
  const structure = +document.getElementById("padelStructure").value;
   const Amenities = +document.getElementById("padelAmenities").value;

  const peakHours = +document.getElementById("padelPeakHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;

  const offHours = +document.getElementById("padelOffHours").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;

  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const utilTotal =
    (peakHours * peakRate * peakUtil + offHours * offRate * offUtil) *
    days * weeks * courts;

  const opCosts =
    +document.getElementById("padelUtil").value +
    +document.getElementById("padelInsure").value +
    +document.getElementById("padelMaint").value +
    +document.getElementById("padelMarket").value +
    +document.getElementById("padelAdmin").value +
    +document.getElementById("padelClean").value +
    +document.getElementById("padelMisc").value;

  const staffCosts =
    +document.getElementById("padelMgrs").value * +document.getElementById("padelMgrSal").value +
    +document.getElementById("padelRec").value * +document.getElementById("padelRecSal").value +
    +document.getElementById("padelCoachFT").value * +document.getElementById("padelCoachFTSal").value +
    +document.getElementById("padelCoachPT").value * +document.getElementById("padelCoachPTSal").value +
    +document.getElementById("padelAddStaff").value * +document.getElementById("padelAddStaffSal").value;

  const investment = Amenities + ground + structure + courts * courtCost;

  financials.padelRevenue = utilTotal;
  financials.padelCost = opCosts + staffCosts;
  financials.padelInvestment = investment;

  document.getElementById("padelSummary").innerText =
    `Revenue: €${utilTotal.toFixed(2)}\nCosts: €${(opCosts + staffCosts).toFixed(2)}\nInvestment: €${investment.toFixed(2)}`;
}


function calculateGym() {
  const equip = +document.getElementById("gymEquip").value;
  const floor = +document.getElementById("gymFloor").value;
  const amen = +document.getElementById("gymAmen").value;

  let weekMembers = +document.getElementById("gymWeekMembers").value;
  let weekFee = +document.getElementById("gymWeekFee").value;
  let monthMembers = +document.getElementById("gymMonthMembers").value;
  let monthFee = +document.getElementById("gymMonthFee").value;
  let annualMembers = +document.getElementById("gymAnnualMembers").value;
  let annualFee = +document.getElementById("gymAnnualFee").value;

  if (document.getElementById("gymRamp").checked) {
    const rampDuration = +document.getElementById("rampDuration").value;
    const rampEffect = +document.getElementById("rampEffect").value / 100;
    const remainingMonths = 12 - rampDuration;

    const rampMonthMembers = rampEffect * monthMembers;
    const totalMonthRevenue = (rampMonthMembers * monthFee * rampDuration) +
                               (monthMembers * monthFee * remainingMonths);

    monthMembers = totalMonthRevenue / (12 * monthFee);
  }

  const annualRevenue =
    weekMembers * weekFee * 52 +
    monthMembers * monthFee * 12 +
    annualMembers * annualFee;

  const opCosts =
    +document.getElementById("gymUtil").value +
    +document.getElementById("gymInsure").value +
    +document.getElementById("gymMaint").value +
    +document.getElementById("gymMarket").value +
    +document.getElementById("gymAdmin").value +
    +document.getElementById("gymClean").value +
    +document.getElementById("gymMisc").value;

  const staffCosts =
    +document.getElementById("gymTrainerFT").value * +document.getElementById("gymTrainerFTSal").value +
    +document.getElementById("gymTrainerPT").value * +document.getElementById("gymTrainerPTSal").value +
    +document.getElementById("gymAddStaff").value * +document.getElementById("gymAddStaffSal").value;

  const investment = equip + floor + amen;

  financials.gymRevenue = annualRevenue;
  financials.gymCost = opCosts + staffCosts;
  financials.gymInvestment = investment;

  document.getElementById("gymSummary").innerText =
    `Revenue: €${annualRevenue.toFixed(2)}\nCosts: €${(opCosts + staffCosts).toFixed(2)}\nInvestment: €${investment.toFixed(2)}`;
}

function updatePNL() {
  const revenue = financials.padelRevenue + financials.gymRevenue;
  const costs = financials.padelCost + financials.gymCost;
  const investment = financials.padelInvestment + financials.gymInvestment;
  const profit = revenue - costs;

  const pnlCtx = document.getElementById("pnlChart").getContext("2d");
  new Chart(pnlCtx, {
    type: "bar",
    data: {
      labels: ["Revenue", "Costs", "Profit"],
      datasets: [{
        label: "Annual",
        data: [revenue, costs, profit],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"]
      }]
    }
  });

  const trendCtx = document.getElementById("profitTrendChart").getContext("2d");
  const monthlyProfit = profit / 12;
  new Chart(trendCtx, {
    type: "line",
    data: {
      labels: Array.from({length: 12}, (_, i) => `Month ${i+1}`),
      datasets: [{
        label: "Monthly Profit",
        data: Array(12).fill(monthlyProfit),
        borderColor: "#2196f3",
        fill: false
      }]
    }
  });

  const pieCtx = document.getElementById("costBreakdownChart").getContext("2d");
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Padel Costs", "Gym Costs"],
      datasets: [{
        data: [financials.padelCost, financials.gymCost],
        backgroundColor: ["#ff9800", "#3f51b5"]
      }]
    }
  });

  document.getElementById("pnlSummary").innerText =
    `Annual Revenue: €${revenue.toFixed(2)}\nAnnual Cost: €${costs.toFixed(2)}\nNet Profit: €${profit.toFixed(2)}`;
  updateROI();
}

function updateROI() {
  const revenue = financials.padelRevenue + financials.gymRevenue;
  const cost = financials.padelCost + financials.gymCost;
  const investment = financials.padelInvestment + financials.gymInvestment;
  const annualProfit = revenue - cost;

  let cumulative = 0;
  let monthsToBreakEven = 0;
  const roiData = [];

  for (let m = 1; m <= 60; m++) {
    cumulative += annualProfit / 12;
    roiData.push(cumulative);
    if (cumulative >= investment && monthsToBreakEven === 0) {
      monthsToBreakEven = m;
    }
  }

  document.getElementById("yearsToROIText").innerText =
    monthsToBreakEven
      ? `Break-even in ${monthsToBreakEven} months (~${(monthsToBreakEven/12).toFixed(1)} years)`
      : `Investment not recovered in 5 years`;

  const roiCtx = document.getElementById("roiLineChart").getContext("2d");
  new Chart(roiCtx, {
    type: "line",
    data: {
      labels: Array.from({length: 60}, (_, i) => `Month ${i+1}`),
      datasets: [{
        label: "Cumulative Profit",
        data: roiData,
        borderColor: "#4caf50",
        fill: false
      }]
    }
  });

  const roiBar = document.getElementById("roiBarChart").getContext("2d");
  new Chart(roiBar, {
    type: "bar",
    data: {
      labels: ["Investment", "Profit (Yr1)"],
      datasets: [{
        label: "Value (€)",
        data: [investment, annualProfit],
        backgroundColor: ["#f44336", "#4caf50"]
      }]
    }
  });

  const roiPie = document.getElementById("roiPieChart").getContext("2d");
  new Chart(roiPie, {
    type: "pie",
    data: {
      labels: ["Investment", "Profit"],
      datasets: [{
        data: [investment, annualProfit],
        backgroundColor: ["#e91e63", "#8bc34a"]
      }]
    }
  });
}
