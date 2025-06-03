function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// === Padel Calculator ===
function calculatePadel() {
  const peakHours = +document.getElementById("padelPeakHours").value || 0;
  const offHours = +document.getElementById("padelOffHours").value || 0;
  const peakRate = +document.getElementById("padelPeakRate").value || 0;
  const offRate = +document.getElementById("padelOffRate").value || 0;
  const utilization = (+document.getElementById("padelUtil").value || 0) / 100;
  const days = +document.getElementById("padelDays").value || 0;
  const weeks = +document.getElementById("padelWeeks").value || 0;

  const revenue = ((peakHours * peakRate + offHours * offRate) * utilization) * days * weeks;

  const utilCost = +document.getElementById("padelUtilCost").value || 0;
  const insurance = +document.getElementById("padelInsurance").value || 0;
  const cleaning = +document.getElementById("padelCleaning").value || 0;
  const overheads = utilCost + insurance + cleaning;

  const coachCount = +document.getElementById("padelCoaches").value || 0;
  const coachSalary = +document.getElementById("padelCoachSalary").value || 0;
  const addStaff = +document.getElementById("padelAddStaff").value || 0;
  const addSalary = +document.getElementById("padelAddSalary").value || 0;
  const staffCost = (coachCount * coachSalary) + (addStaff * addSalary);

  const profit = revenue - overheads - staffCost;

  document.getElementById("padelResult").innerHTML = `
    <p><strong>Annual Revenue:</strong> €${revenue.toFixed(2)}</p>
    <p><strong>Overheads:</strong> €${overheads.toFixed(2)}</p>
    <p><strong>Staff Costs:</strong> €${staffCost.toFixed(2)}</p>
    <p><strong>Profit:</strong> €${profit.toFixed(2)}</p>
  `;
}

// === Gym Calculator ===
function calculateGym() {
  const weekMembers = +document.getElementById("gymWeeklyMembers").value || 0;
  const weekFee = +document.getElementById("gymWeeklyFee").value || 0;
  const monthMembers = +document.getElementById("gymMonthlyMembers").value || 0;
  const monthFee = +document.getElementById("gymMonthlyFee").value || 0;
  const annualMembers = +document.getElementById("gymAnnualMembers").value || 0;
  const annualFee = +document.getElementById("gymAnnualFee").value || 0;

  const revenue = (weekMembers * weekFee * 52) +
                  (monthMembers * monthFee * 12) +
                  (annualMembers * annualFee);

  const utilCost = +document.getElementById("gymUtilCost").value || 0;
  const insurance = +document.getElementById("gymInsurance").value || 0;
  const cleaning = +document.getElementById("gymCleaning").value || 0;
  const overheads = utilCost + insurance + cleaning;

  const trainers = +document.getElementById("gymTrainers").value || 0;
  const trainerSalary = +document.getElementById("gymTrainerSalary").value || 0;
  const addStaff = +document.getElementById("gymAddStaff").value || 0;
  const addSalary = +document.getElementById("gymAddSalary").value || 0;
  const staffCost = (trainers * trainerSalary) + (addStaff * addSalary);

  const profit = revenue - overheads - staffCost;

  document.getElementById("gymResult").innerHTML = `
    <p><strong>Annual Revenue:</strong> €${revenue.toFixed(2)}</p>
    <p><strong>Overheads:</strong> €${overheads.toFixed(2)}</p>
    <p><strong>Staff Costs:</strong> €${staffCost.toFixed(2)}</p>
    <p><strong>Profit:</strong> €${profit.toFixed(2)}</p>
  `;
}
