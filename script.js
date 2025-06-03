// script.js

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

document.getElementById("gymRamp").addEventListener("change", function() {
  document.getElementById("rampUpSettings").style.display = this.checked ? "block" : "none";
});

function calculatePadel() {
  const courts = +document.getElementById("padelCourts").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const ground = +document.getElementById("padelGround").value;
  const structure = +document.getElementById("padelStructure").value;
  const amenities = +document.getElementById("padelAmen")?.value || 0;
  const peakHours = +document.getElementById("padelPeakHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offHours = +document.getElementById("padelOffHours").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;
  const util = +document.getElementById("padelUtil").value;
  const insure = +document.getElementById("padelInsure").value;
  const maint = +document.getElementById("padelMaint").value;
  const market = +document.getElementById("padelMarket").value;
  const admin = +document.getElementById("padelAdmin").value;
  const clean = +document.getElementById("padelClean").value;
  const misc = +document.getElementById("padelMisc").value;

  const staff = (
    +document.getElementById("padelFtMgr").value * +document.getElementById("padelFtMgrSal").value +
    +document.getElementById("padelFtRec").value * +document.getElementById("padelFtRecSal").value +
    +document.getElementById("padelFtCoach").value * +document.getElementById("padelFtCoachSal").value +
    +document.getElementById("padelPtCoach").value * +document.getElementById("padelPtCoachSal").value +
    +document.getElementById("padelAddStaff").value * +document.getElementById("padelAddStaffSal").value
  );

  const invest = ground + structure + (courts * courtCost) + amenities;
  const revenue = courts * (
    (peakHours * peakRate * peakUtil + offHours * offRate * offUtil) * days * weeks
  );
  const operations = util + insure + maint + market + admin + clean + misc + staff;

  document.getElementById("padelSummary").innerHTML =
    `<strong>Investment:</strong> €${invest.toFixed(2)}<br>
     <strong>Annual Revenue:</strong> €${revenue.toFixed(2)}<br>
     <strong>Annual Operational Costs:</strong> €${operations.toFixed(2)}`;
}

function calculateGym() {
  const equip = +document.getElementById("gymEquip").value;
  const floor = +document.getElementById("gymFloor").value;
  const amen = +document.getElementById("gymAmen").value;
  const weekMembers = +document.getElementById("gymWeekMembers").value;
  const weekFee = +document.getElementById("gymWeekFee").value;
  const monthMembers = +document.getElementById("gymMonthMembers").value;
  const monthFee = +document.getElementById("gymMonthFee").value;
  const annualMembers = +document.getElementById("gymAnnualMembers").value;
  const annualFee = +document.getElementById("gymAnnualFee").value;
  const ramp = document.getElementById("gymRamp").checked;
  const duration = +document.getElementById("rampDuration").value;
  const effect = +document.getElementById("rampEffect").value / 100;

  let revenue = (
    (weekMembers * weekFee * 52) +
    (monthMembers * monthFee * 12) +
    (annualMembers * annualFee)
  );

  if (ramp) {
    const ramped = ((duration / 12) * effect + ((12 - duration) / 12)) * revenue;
    revenue = ramped;
  }

  const util = +document.getElementById("gymUtil").value;
  const insure = +document.getElementById("gymInsure").value;
  const maint = +document.getElementById("gymMaint").value;
  const market = +document.getElementById("gymMarket").value;
  const admin = +document.getElementById("gymAdmin").value;
  const clean = +document.getElementById("gymClean").value;
  const misc = +document.getElementById("gymMisc").value;

  const staff = (
    +document.getElementById("gymFtTrainer").value * +document.getElementById("gymFtTrainerSal").value +
    +document.getElementById("gymPtTrainer").value * +document.getElementById("gymPtTrainerSal").value +
    +document.getElementById("gymAddStaff").value * +document.getElementById("gymAddStaffSal").value
  );

  const invest = equip + floor + amen;
  const operations = util + insure + maint + market + admin + clean + misc + staff;

  document.getElementById("gymSummary").innerHTML =
    `<strong>Investment:</strong> €${invest.toFixed(2)}<br>
     <strong>Annual Revenue:</strong> €${revenue.toFixed(2)}<br>
     <strong>Annual Operational Costs:</strong> €${operations.toFixed(2)}`;
}

function updateROI() {
  // Placeholder for ROI and P&L chart updates
  const roiText = document.getElementById("yearsToROIText");
  roiText.textContent = "Charts and ROI calculations loading...";
  // Further development will plug in charts and financial logic.
}
