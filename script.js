function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

// Revenue Calculations

function calculatePadel() {
  const peakHours = +document.getElementById("padelPeakHours").value;
  const offHours = +document.getElementById("padelOffHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const util = +document.getElementById("padelUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const revenue = (
    (peakHours * peakRate + offHours * offRate) *
    util * days * weeks
  );

  const overheads = +document.getElementById("padelUtilCost").value +
                    +document.getElementById("padelInsurance").value +
                    +document.getElementById("padelCleaning").value;

  const staff = (+document.getElementById("padelCoaches").value * +document.getElementById("padelCoachSalary").value) +
                (+document.getElementById("padelAddStaff").value * +document.getElementById("padelAddSalary").value);

  const totalCost = overheads + staff;
  const profit = revenue - totalCost;

  document.getElementById("padelResult").innerHTML = `
    <p><strong>Padel Revenue:</strong> €${revenue.toFixed(2)}</p>
    <p><strong>Padel Costs:</strong> €${totalCost.toFixed(2)}</p>
    <p><strong>Padel Profit:</strong> €${profit.toFixed(2)}</p>
  `;

  updatePNL();
  updateROI();
}

function calculateGym() {
  const weekly = +document.getElementById("gymWeeklyMembers").value * +document.getElementById("gymWeeklyFee").value * 52;
  const monthly = +document.getElementById("gymMonthlyMembers").value * +document.getElementById("gymMonthlyFee").value * 12;
  const annual = +document.getElementById("gymAnnualMembers").value * +document.getElementById("gymAnnualFee").value;

  let revenue = weekly + monthly + annual;

  if (document.getElementById("gymRamp").checked) {
    const months = +document.getElementById("rampMonths").value;
    const rampPercent = +document.getElementById("rampPercent").value / 100;
    revenue = revenue * (rampPercent + ((1 - rampPercent) * (months / 12)));
  }

  const overheads = +document.getElementById("gymUtilCost").value +
                    +document.getElementById("gymInsurance").value +
                    +document.getElementById("gymCleaning").value;

  const staff = (+document.getElementById("gymTrainers").value * +document.getElementById("gymTrainerSalary").value) +
                (+document.getElementById("gymAddStaff").value * +document.getElementById("gymAddSalary").value);

  const totalCost = overheads + staff;
  const profit = revenue - totalCost;

  document.getElementById("gymResult").innerHTML = `
    <p><strong>Gym Revenue:</strong> €${revenue.toFixed(2)}</p>
    <p><strong>Gym Costs:</strong> €${totalCost.toFixed(2)}</p>
    <p><strong>Gym Profit:</strong> €${profit.toFixed(2)}</p>
  `;

  updatePNL();
  updateROI();
}

// Toggle ramp settings
document.getElementById("gymRamp").addEventListener("change", () => {
  document.getElementById("rampSettings").style.display = document.getElementById("gymRamp").checked ? "block" : "none";
});

// Charts and P&L
function updatePNL() {
  const padelProfit = getValueFromSummary("padelResult", "Padel Profit");
  const gymProfit = getValueFromSummary("gymResult", "Gym Profit");

  const total = padelProfit + gymProfit;

  document.getElementById("pnlSummary").innerHTML = `
    <p><strong>Total Annual Profit:</strong> €${total.toFixed(2)}</p>
  `;

  if (window.pnlChart) window.pnlChart.destroy();

  const ctx = document.getElementById("pnlChart").getContext("2d");
  window.pnlChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Padel", "Gym"],
      datasets: [{
        label: "Annual Profit (€)",
        data: [padelProfit, gymProfit],
        backgroundColor: ["#3498db", "#2ecc71"]
      }]
    }
  });
}

function updateROI() {
  const padelProfit = getValueFromSummary("padelResult", "Padel Profit");
  const gymProfit = getValueFromSummary("gymResult", "Gym Profit");

  const investment = 200000; // Example static investment
  let cumulative = 0;
  const roiData = [];

  for (let i = 1; i <= 10; i++) {
    cumulative += (padelProfit + gymProfit);
    roiData.push(cumulative);
  }

  document.getElementById("roiSummary").innerHTML = `
    <p><strong>Total Return in 10 Years:</strong> €${cumulative.toFixed(2)}</p>
    <p><strong>Break-even in:</strong> ~${Math.ceil(investment / (padelProfit + gymProfit))} years</p>
  `;

  if (window.roiChart) window.roiChart.destroy();

  const ctx = document.getElementById("roiChart").getContext("2d");
  window.roiChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`),
      datasets: [{
        label: "Cumulative ROI (€)",
        data: roiData,
        borderColor: "#e67e22",
        fill: false
      }]
    }
  });
}

// Helper
function getValueFromSummary(id, keyword) {
  const html = document.getElementById(id).innerHTML;
  const regex = new RegExp(`${keyword}:.*?€([0-9,.]+)`);
  const match = html.match(regex);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
}
