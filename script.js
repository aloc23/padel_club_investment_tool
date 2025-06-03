// Full script.js implementation for Padel Club Investment Planner

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  document.getElementById("padel").classList.add("active");
});

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

document.getElementById("gymRamp").addEventListener("change", function () {
  document.getElementById("rampUpSettings").style.display = this.checked ? "block" : "none";
});

function getValue(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function calculatePadel() {
  const courtTotal = getValue("padelCourts") * getValue("padelCourtCost");
  const investment = getValue("padelGround") + getValue("padelStructure") + courtTotal;

  const peakRevenue = getValue("padelCourts") * getValue("padelPeakHours") * getValue("padelPeakRate") * (getValue("padelPeakUtil") / 100);
  const offRevenue = getValue("padelCourts") * getValue("padelOffHours") * getValue("padelOffRate") * (getValue("padelOffUtil") / 100);
  const annualRevenue = (peakRevenue + offRevenue) * getValue("padelDays") * getValue("padelWeeks");

  const opsCosts = ["padelUtil", "padelInsure", "padelMaint", "padelMarket", "padelAdmin", "padelClean", "padelMisc"].reduce((sum, id) => sum + getValue(id), 0);

  const staffCost = (
    getValue("padelFtMgr") * getValue("padelFtMgrSal") +
    getValue("padelFtRec") * getValue("padelFtRecSal") +
    getValue("padelFtCoach") * getValue("padelFtCoachSal") +
    getValue("padelPtCoach") * getValue("padelPtCoachSal") +
    getValue("padelAddStaff") * getValue("padelAddStaffSal")
  );

  const summary = `
    <strong>Investment:</strong> €${investment.toLocaleString()}<br>
    <strong>Annual Revenue:</strong> €${annualRevenue.toLocaleString()}<br>
    <strong>Operational Costs:</strong> €${opsCosts.toLocaleString()}<br>
    <strong>Staff Costs:</strong> €${staffCost.toLocaleString()}<br>
    <strong>Profit:</strong> €${(annualRevenue - opsCosts - staffCost).toLocaleString()}
  `;
  document.getElementById("padelSummary").innerHTML = summary;
  updatePnl();
  updateROI();
}

function calculateGym() {
  const investment = getValue("gymEquip") + getValue("gymFloor") + getValue("gymAmen");

  let annualMembersRevenue = getValue("gymAnnualMembers") * getValue("gymAnnualFee");
  let monthlyMembersRevenue = getValue("gymMonthMembers") * getValue("gymMonthFee") * 12;
  let weeklyMembersRevenue = getValue("gymWeekMembers") * getValue("gymWeekFee") * 52;

  if (document.getElementById("gymRamp").checked) {
    const rampDuration = getValue("rampDuration");
    const rampEffect = getValue("rampEffect") / 100;
    const scaleFactor = (rampEffect + 1) / 2;
    monthlyMembersRevenue *= scaleFactor;
    weeklyMembersRevenue *= scaleFactor;
  }

  const annualRevenue = annualMembersRevenue + monthlyMembersRevenue + weeklyMembersRevenue;

  const opsCosts = ["gymUtil", "gymInsure", "gymMaint", "gymMarket", "gymAdmin", "gymClean", "gymMisc"].reduce((sum, id) => sum + getValue(id), 0);
  const staffCost = (
    getValue("gymFtTrainer") * getValue("gymFtTrainerSal") +
    getValue("gymPtTrainer") * getValue("gymPtTrainerSal") +
    getValue("gymAddStaff") * getValue("gymAddStaffSal")
  );

  const summary = `
    <strong>Investment:</strong> €${investment.toLocaleString()}<br>
    <strong>Annual Revenue:</strong> €${annualRevenue.toLocaleString()}<br>
    <strong>Operational Costs:</strong> €${opsCosts.toLocaleString()}<br>
    <strong>Staff Costs:</strong> €${staffCost.toLocaleString()}<br>
    <strong>Profit:</strong> €${(annualRevenue - opsCosts - staffCost).toLocaleString()}
  `;
  document.getElementById("gymSummary").innerHTML = summary;
  updatePnl();
  updateROI();
}

function updatePnl() {
  const totalRevenue = getValue("padelCourts") * getValue("padelPeakHours") * getValue("padelPeakRate") * (getValue("padelPeakUtil") / 100)
    + getValue("padelCourts") * getValue("padelOffHours") * getValue("padelOffRate") * (getValue("padelOffUtil") / 100);

  const padelAnnual = (totalRevenue * getValue("padelDays") * getValue("padelWeeks"));
  const gymAnnual = getValue("gymAnnualMembers") * getValue("gymAnnualFee") +
    getValue("gymMonthMembers") * getValue("gymMonthFee") * 12 +
    getValue("gymWeekMembers") * getValue("gymWeekFee") * 52;

  const totalAnnualRevenue = padelAnnual + gymAnnual;
  const padelCosts = ["padelUtil", "padelInsure", "padelMaint", "padelMarket", "padelAdmin", "padelClean", "padelMisc"].reduce((sum, id) => sum + getValue(id), 0)
    + getValue("padelFtMgr") * getValue("padelFtMgrSal") + getValue("padelFtRec") * getValue("padelFtRecSal")
    + getValue("padelFtCoach") * getValue("padelFtCoachSal") + getValue("padelPtCoach") * getValue("padelPtCoachSal") + getValue("padelAddStaff") * getValue("padelAddStaffSal");

  const gymCosts = ["gymUtil", "gymInsure", "gymMaint", "gymMarket", "gymAdmin", "gymClean", "gymMisc"].reduce((sum, id) => sum + getValue(id), 0)
    + getValue("gymFtTrainer") * getValue("gymFtTrainerSal") + getValue("gymPtTrainer") * getValue("gymPtTrainerSal") + getValue("gymAddStaff") * getValue("gymAddStaffSal");

  const totalCosts = padelCosts + gymCosts;
  const profit = totalAnnualRevenue - totalCosts;

  document.getElementById("pnlSummary").innerHTML = `
    <strong>Total Revenue:</strong> €${totalAnnualRevenue.toLocaleString()}<br>
    <strong>Total Costs:</strong> €${totalCosts.toLocaleString()}<br>
    <strong>Net Profit:</strong> €${profit.toLocaleString()}
  `;
}

function updateROI() {
  const totalInvestment = getValue("padelGround") + getValue("padelStructure") + (getValue("padelCourts") * getValue("padelCourtCost"))
    + getValue("gymEquip") + getValue("gymFloor") + getValue("gymAmen");

  const totalRevenue = getValue("padelCourts") * getValue("padelPeakHours") * getValue("padelPeakRate") * (getValue("padelPeakUtil") / 100)
    + getValue("padelCourts") * getValue("padelOffHours") * getValue("padelOffRate") * (getValue("padelOffUtil") / 100);
  const padelAnnual = totalRevenue * getValue("padelDays") * getValue("padelWeeks");

  const gymAnnual = getValue("gymAnnualMembers") * getValue("gymAnnualFee") +
    getValue("gymMonthMembers") * getValue("gymMonthFee") * 12 +
    getValue("gymWeekMembers") * getValue("gymWeekFee") * 52;

  const annualRevenue = padelAnnual + gymAnnual;

  const padelCosts = ["padelUtil", "padelInsure", "padelMaint", "padelMarket", "padelAdmin", "padelClean", "padelMisc"].reduce((sum, id) => sum + getValue(id), 0)
    + getValue("padelFtMgr") * getValue("padelFtMgrSal") + getValue("padelFtRec") * getValue("padelFtRecSal")
    + getValue("padelFtCoach") * getValue("padelFtCoachSal") + getValue("padelPtCoach") * getValue("padelPtCoachSal") + getValue("padelAddStaff") * getValue("padelAddStaffSal");

  const gymCosts = ["gymUtil", "gymInsure", "gymMaint", "gymMarket", "gymAdmin", "gymClean", "gymMisc"].reduce((sum, id) => sum + getValue(id), 0)
    + getValue("gymFtTrainer") * getValue("gymFtTrainerSal") + getValue("gymPtTrainer") * getValue("gymPtTrainerSal") + getValue("gymAddStaff") * getValue("gymAddStaffSal");

  const totalCosts = padelCosts + gymCosts;
  const annualProfit = annualRevenue - totalCosts;

  let years = 0, cumulative = 0;
  while (cumulative < totalInvestment && years < 50) {
    cumulative += annualProfit;
    years++;
  }

  document.getElementById("yearsToROIText").innerText = `Estimated Payback Period: ${years} year(s)`;
}
