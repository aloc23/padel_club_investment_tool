// Full working script.js for Padel Club Investment Tool

// Utility to show selected tab
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// Update ramp-up UI toggle
const rampCheckbox = document.getElementById("gymRamp");
const rampUpSettings = document.getElementById("rampUpSettings");
rampCheckbox.addEventListener("change", () => {
  rampUpSettings.style.display = rampCheckbox.checked ? "block" : "none";
});

// Format number
function fmt(n) {
  return new Intl.NumberFormat().format(n.toFixed(2));
}

// Padel calculation
function calculatePadel() {
  const courts = +document.getElementById("padelCourts").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const ground = +document.getElementById("padelGround").value;
  const structure = +document.getElementById("padelStructure").value;

  const peakH = +document.getElementById("padelPeakHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offH = +document.getElementById("padelOffHours").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const utilCosts = ["padelUtil", "padelInsure", "padelMaint", "padelMarket", "padelAdmin", "padelClean", "padelMisc"].map(id => +document.getElementById(id).value).reduce((a, b) => a + b, 0);

  const staffCosts = [
    ["padelFtMgr", "padelFtMgrSal"],
    ["padelFtRec", "padelFtRecSal"],
    ["padelFtCoach", "padelFtCoachSal"],
    ["padelPtCoach", "padelPtCoachSal"],
    ["padelAddStaff", "padelAddStaffSal"]
  ].map(([qty, sal]) => +document.getElementById(qty).value * +document.getElementById(sal).value).reduce((a, b) => a + b, 0);

  const padelRevenue = courts * ((peakH * peakRate * peakUtil) + (offH * offRate * offUtil)) * days * weeks;
  const padelCosts = utilCosts + staffCosts;
  const padelInvestment = ground + structure + (courts * courtCost);

  document.getElementById("padelSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${fmt(padelRevenue)}<br>
    <strong>Operational Costs:</strong> €${fmt(padelCosts)}<br>
    <strong>Total Investment:</strong> €${fmt(padelInvestment)}
  `;

  window.padelData = { revenue: padelRevenue, costs: padelCosts, investment: padelInvestment };
}

// Gym calculation
function calculateGym() {
  const equip = +document.getElementById("gymEquip").value;
  const floor = +document.getElementById("gymFloor").value;
  const amen = +document.getElementById("gymAmen").value;

  const weekM = +document.getElementById("gymWeekMembers").value * +document.getElementById("gymWeekFee").value * 52;
  const monthM = +document.getElementById("gymMonthMembers").value * +document.getElementById("gymMonthFee").value * 12;
  const yearM = +document.getElementById("gymAnnualMembers").value * +document.getElementById("gymAnnualFee").value;
  let revenue = weekM + monthM + yearM;

  const ramp = document.getElementById("gymRamp").checked;
  if (ramp) {
    const rampDur = +document.getElementById("rampDuration").value;
    const rampEff = +document.getElementById("rampEffect").value / 100;
    const rampFactor = (rampDur / 12 * rampEff) + ((12 - rampDur) / 12);
    revenue *= rampFactor;
  }

  const utilCosts = ["gymUtil", "gymInsure", "gymMaint", "gymMarket", "gymAdmin", "gymClean", "gymMisc"].map(id => +document.getElementById(id).value).reduce((a, b) => a + b, 0);

  const staffCosts = [
    ["gymFtTrainer", "gymFtTrainerSal"],
    ["gymPtTrainer", "gymPtTrainerSal"],
    ["gymAddStaff", "gymAddStaffSal"]
  ].map(([qty, sal]) => +document.getElementById(qty).value * +document.getElementById(sal).value).reduce((a, b) => a + b, 0);

  const costs = utilCosts + staffCosts;
  const investment = equip + floor + amen;

  document.getElementById("gymSummary").innerHTML = `
    <strong>Annual Revenue:</strong> €${fmt(revenue)}<br>
    <strong>Operational Costs:</strong> €${fmt(costs)}<br>
    <strong>Total Investment:</strong> €${fmt(investment)}
  `;

  window.gymData = { revenue, costs, investment };
}

function updateROI() {
  const padel = window.padelData || { revenue: 0, costs: 0, investment: 0 };
  const gym = window.gymData || { revenue: 0, costs: 0, investment: 0 };

  const totalRevenue = padel.revenue + gym.revenue;
  const totalCosts = padel.costs + gym.costs;
  const profit = totalRevenue - totalCosts;
  const investment = padel.investment + gym.investment;

  const yearsToROI = profit > 0 ? (investment / profit).toFixed(1) : "N/A";

  document.getElementById("yearsToROIText").textContent = `Estimated Years to ROI: ${yearsToROI}`;

  // Chart rendering
  const pnlCtx = document.getElementById("pnlChart").getContext("2d");
  new Chart(pnlCtx, {
    type: "bar",
    data: {
      labels: ["Padel Revenue", "Padel Costs", "Gym Revenue", "Gym Costs"],
      datasets: [{
        label: "Annual Figures (€)",
        data: [padel.revenue, padel.costs, gym.revenue, gym.costs],
        backgroundColor: ["#2a9d8f", "#e76f51", "#264653", "#f4a261"]
      }]
    },
    options: { responsive: true }
  });

  const roiCtx = document.getElementById("roiChart").getContext("2d");
  new Chart(roiCtx, {
    type: "pie",
    data: {
      labels: ["Investment", "Profit"],
      datasets: [{
        data: [investment, profit],
        backgroundColor: ["#e9c46a", "#2a9d8f"]
      }]
    }
  });
}
