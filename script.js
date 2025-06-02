function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

let pnlChart, roiChart;
let totalRevenue = 0, totalCosts = 0, totalInvestment = 0;

function calculatePadel() {
  const structure = +document.getElementById("padelStructure").value;
  const ground = +document.getElementById("padelGroundworks").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const courts = +document.getElementById("padelCourts").value;
  const amenities = +document.getElementById("padelAmenities").value;

  const peakHours = +document.getElementById("padelPeakHours").value;
  const offHours = +document.getElementById("padelOffHours").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const overheads =
    +document.getElementById("padelUtil").value +
    +document.getElementById("padelInsure").value +
    +document.getElementById("padelMaint").value +
    +document.getElementById("padelMarket").value;

  const staff =
    +document.getElementById("padelManager").value +
    +document.getElementById("padelCoach").value +
    +document.getElementById("padelReception").value;

  const totalSessions = weeks * days;
  const peakSessions = courts * peakHours * totalSessions * peakUtil;
  const offSessions = courts * offHours * totalSessions * offUtil;
  const revenue = (peakSessions * peakRate) + (offSessions * offRate);
  const investment = structure + ground + courtCost * courts + amenities;
  const cost = overheads + staff;
  const profit = revenue - cost;

  totalRevenue = revenue;
  totalCosts = cost;
  totalInvestment = investment;

  document.getElementById("padelSummary").innerHTML = `
    <p><strong>Total Investment:</strong> €${investment.toLocaleString()}</p>
    <p><strong>Annual Revenue:</strong> €${Math.round(revenue).toLocaleString()}</p>
    <p><strong>Annual Costs:</strong> €${cost.toLocaleString()}</p>
    <p><strong>Annual Profit:</strong> €${Math.round(profit).toLocaleString()}</p>
  `;

  drawCharts();
}

function calculateGym() {
  const equip = +document.getElementById("gymEquip").value;
  const amenities = +document.getElementById("gymAmenities").value;
  const floor = +document.getElementById("gymFlooring").value;

  const weeklyMembers = +document.getElementById("gymWeekly").value;
  const weeklyFee = +document.getElementById("gymWeekFee").value;
  const monthlyMembers = +document.getElementById("gymMonthly").value;
  const monthlyFee = +document.getElementById("gymMonthFee").value;
  const annualMembers = +document.getElementById("gymAnnual").value;
  const annualFee = +document.getElementById("gymAnnualFee").value;
  const ramp = document.getElementById("gymRamp").checked;

  const overheads =
    +document.getElementById("gymUtil").value +
    +document.getElementById("gymInsure").value +
    +document.getElementById("gymMaint").value +
    +document.getElementById("gymMarket").value;

  const staff =
    +document.getElementById("gymTrainer").value +
    +document.getElementById("gymReception").value +
    +document.getElementById("gymManager").value;

  let revenue =
    (weeklyMembers * weeklyFee * 52) +
    (monthlyMembers * monthlyFee * 12) +
    (annualMembers * annualFee);

  if (ramp) revenue *= 0.6;

  const investment = equip + amenities + floor;
  const cost = overheads + staff;
  const profit = revenue - cost;

  totalRevenue = revenue;
  totalCosts = cost;
  totalInvestment = investment;

  document.getElementById("gymSummary").innerHTML = `
    <p><strong>Total Investment:</strong> €${investment.toLocaleString()}</p>
    <p><strong>Annual Revenue:</strong> €${Math.round(revenue).toLocaleString()}</p>
    <p><strong>Annual Costs:</strong> €${cost.toLocaleString()}</p>
    <p><strong>Annual Profit:</strong> €${Math.round(profit).toLocaleString()}</p>
  `;

  drawCharts();
}

function drawCharts() {
  const months = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
  const monthlyRevenue = totalRevenue / 12;
  const monthlyCosts = totalCosts / 12;
  const monthlyProfit = monthlyRevenue - monthlyCosts;

  // Destroy previous charts
  if (pnlChart) pnlChart.destroy();
  if (roiChart) roiChart.destroy();

  // P&L Chart
  pnlChart = new Chart(document.getElementById("pnlChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Revenue",
          data: Array(12).fill(monthlyRevenue),
          backgroundColor: "#2ecc71"
        },
        {
          label: "Costs",
          data: Array(12).fill(monthlyCosts),
          backgroundColor: "#e74c3c"
        },
        {
          label: "Profit",
          data: Array(12).fill(monthlyProfit),
          backgroundColor: "#3498db"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } }
    }
  });

  // ROI Chart
  const roiSeries = Array.from({ length: 12 }, (_, i) =>
    ((monthlyProfit * (i + 1)) / totalInvestment).toFixed(2)
  );

  roiChart = new Chart(document.getElementById("roiChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "ROI Over Time",
          data: roiSeries,
          borderColor: "#f39c12",
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}
