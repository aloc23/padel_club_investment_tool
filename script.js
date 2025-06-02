function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.style.display = "none";
  });
  document.getElementById(tabId).style.display = "block";
}

let pnlChart, roiChart;

function calculatePadel() {
  const structure = +document.getElementById("padelStructure").value;
  const ground = +document.getElementById("padelGroundworks").value;
  const courtCost = +document.getElementById("padelCourtCost").value;
  const courts = +document.getElementById("padelCourts").value;
  const amenities = +document.getElementById("padelAmenities").value;

  const peakRate = +document.getElementById("padelPeakRate").value;
  const offRate = +document.getElementById("padelOffPeakRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const hours = +document.getElementById("padelHours").value;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;

  const staff = +document.getElementById("padelStaff").value;
  const overheads = +document.getElementById("padelOverheads").value;

  const investment = structure + ground + courtCost * courts + amenities;
  const sessions = hours * days * weeks;
  const totalRevenue =
    courts *
    ((sessions / 2) * peakUtil * peakRate + (sessions / 2) * offUtil * offRate);
  const totalCosts = staff + overheads;
  const profit = totalRevenue - totalCosts;

  document.getElementById("padelSummary").innerHTML = `
    <p><strong>Investment:</strong> €${investment.toLocaleString()}</p>
    <p><strong>Annual Revenue:</strong> €${Math.round(totalRevenue).toLocaleString()}</p>
    <p><strong>Annual Costs:</strong> €${totalCosts.toLocaleString()}</p>
    <p><strong>Annual Profit:</strong> €${Math.round(profit).toLocaleString()}</p>
  `;

  drawCharts(totalRevenue, totalCosts, investment);
}

function calculateGym() {
  const equip = +document.getElementById("gymEquip").value;
  const amenities = +document.getElementById("gymAmenities").value;
  const floor = +document.getElementById("gymFlooring").value;
  const members = +document.getElementById("gymMembers").value;
  const fee = +document.getElementById("gymFee").value;
  const ramp = document.getElementById("gymRamp").checked;
  const overheads = +document.getElementById("gymOverheads").value;
  const staff = +document.getElementById("gymStaff").value;

  const investment = equip + amenities + floor;
  const revenue = ramp ? members * fee * 0.6 : members * fee;
  const totalCosts = overheads + staff;
  const profit = revenue - totalCosts;

  document.getElementById("gymSummary").innerHTML = `
    <p><strong>Investment:</strong> €${investment.toLocaleString()}</p>
    <p><strong>Annual Revenue:</strong> €${Math.round(revenue).toLocaleString()}</p>
    <p><strong>Annual Costs:</strong> €${totalCosts.toLocaleString()}</p>
    <p><strong>Annual Profit:</strong> €${Math.round(profit).toLocaleString()}</p>
  `;

  drawCharts(revenue, totalCosts, investment);
}

function drawCharts(revenue, costs, investment) {
  const months = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
  const monthlyRevenue = revenue / 12;
  const monthlyCosts = costs / 12;
  const monthlyProfit = monthlyRevenue - monthlyCosts;

  // P&L Chart
  if (pnlChart) pnlChart.destroy();
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
    }
  });

  // ROI Chart
  const roiProgress = months.map((_, i) =>
    ((monthlyProfit * (i + 1)) / investment).toFixed(2)
  );

  if (roiChart) roiChart.destroy();
  roiChart = new Chart(document.getElementById("roiChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "ROI",
          data: roiProgress,
          borderColor: "#f39c12",
          tension: 0.4
        }
      ]
    }
  });
}
