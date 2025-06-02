function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

let pnlChart, roiChart;

let totalRevenue = 0;
let totalCosts = 0;
let totalInvestment = 0;

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

  const peakSessions = courts * peakHours * days * weeks * peakUtil;
  const offSessions = courts * offHours * days * weeks * offUtil;
  const revenue = (peakSessions * peakRate) + (offSessions * offRate);
  const investment = structure + ground + (courtCost * courts) + amenities;
  const cost = overheads + staff;
  const profit = revenue - cost;

  totalRevenue = revenue;
  totalCosts = cost;
  totalInvestment = investment;

  document.getElementById("padelSummary").innerHTML = `
    <p><strong>Padel Investment:</strong> €${investment.toLocaleString()}</p>
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
    <p><strong>Gym Investment:</strong> €${investment.toLocaleString()}</p>
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

  const revenueData = Array(12).fill(monthlyRevenue);
  const costData = Array(12).fill(monthlyCosts);
  const profitData = Array(12).fill(monthlyProfit);
  const roiData = Array.from({ length: 12 }, (_, i) =>
    ((monthlyProfit * (i + 1)) / totalInvestment).toFixed(2)
  );

  if (pnlChart) pnlChart.destroy();
  if (roiChart) roiChart.destroy();

  pnlChart = new Chart(document.getElementById("pnlChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: "Revenue", data: revenueData, backgroundColor: "#2ecc71" },
        { label: "Costs", data: costData, backgroundColor: "#e74c3c" },
        { label: "Profit", data: profitData, backgroundColor: "#3498db" }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } }
    }
  });

  roiChart = new Chart(document.getElementById("roiChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "ROI",
          data: roiData,
          borderColor: "#f39c12",
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Return on Investment (Ratio)" } }
      }
    }
  });
}
