// script.js

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

document.getElementById("gymRamp").addEventListener("change", () => {
  document.getElementById("gymRampSettings").style.display = document.getElementById("gymRamp").checked ? "block" : "none";
});

function calculatePadel() {
  const courts = +document.getElementById("padelCourts").value;
  const peakHours = +document.getElementById("padelPeakHours").value;
  const offHours = +document.getElementById("padelOffHours").value;
  const days = +document.getElementById("padelDays").value;
  const weeks = +document.getElementById("padelWeeks").value;
  const peakRate = +document.getElementById("padelPeakRate").value;
  const offRate = +document.getElementById("padelOffRate").value;
  const peakUtil = +document.getElementById("padelPeakUtil").value / 100;
  const offUtil = +document.getElementById("padelOffUtil").value / 100;
  const padelRev = ((courts * peakHours * days * weeks * peakRate * peakUtil) + (courts * offHours * days * weeks * offRate * offUtil));

  const staff = +document.getElementById("padelStaff").value * +document.getElementById("padelStaffSal").value;
  const overheads = ["padelUtil", "padelInsure", "padelClean", "padelMarket"].map(id => +document.getElementById(id).value).reduce((a, b) => a + b, 0);
  const costs = staff + overheads;

  document.getElementById("padelSummary").innerHTML = `Revenue: €${padelRev.toFixed(2)}<br>Costs: €${costs.toFixed(2)}<br>Profit: €${(padelRev - costs).toFixed(2)}`;
  window.padelData = { revenue: padelRev, costs };
  updatePNL(); updateROI();
}

function calculateGym() {
  let week = +document.getElementById("gymWeekly").value * +document.getElementById("gymWeeklyFee").value * 52;
  let month = +document.getElementById("gymMonthly").value * +document.getElementById("gymMonthlyFee").value * 12;
  let annual = +document.getElementById("gymAnnual").value * +document.getElementById("gymAnnualFee").value;
  let revenue = week + month + annual;

  if (document.getElementById("gymRamp").checked) {
    const duration = +document.getElementById("gymRampDuration").value;
    const effectiveness = +document.getElementById("gymRampEffect").value / 100;
    revenue = ((effectiveness * revenue * duration / 12) + (revenue * (12 - duration) / 12));
  }

  const staff = +document.getElementById("gymStaff").value * +document.getElementById("gymStaffSal").value;
  const overheads = ["gymUtil", "gymInsure", "gymClean", "gymMarket"].map(id => +document.getElementById(id).value).reduce((a, b) => a + b, 0);
  const costs = staff + overheads;

  document.getElementById("gymSummary").innerHTML = `Revenue: €${revenue.toFixed(2)}<br>Costs: €${costs.toFixed(2)}<br>Profit: €${(revenue - costs).toFixed(2)}`;
  window.gymData = { revenue, costs };
  updatePNL(); updateROI();
}

function updatePNL() {
  const type = document.querySelector("input[name='pnlToggle']:checked").value;
  const totalRevenue = (window.padelData?.revenue || 0) + (window.gymData?.revenue || 0);
  const totalCosts = (window.padelData?.costs || 0) + (window.gymData?.costs || 0);
  const months = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);

  const data = type === "annual" ? {
    labels: ["Annual"],
    revenue: [totalRevenue],
    costs: [totalCosts]
  } : {
    labels: months,
    revenue: Array(12).fill(totalRevenue / 12),
    costs: Array(12).fill(totalCosts / 12)
  };

  const ctx = document.getElementById("pnlChart").getContext("2d");
  if (window.pnlChart) window.pnlChart.destroy();
  window.pnlChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        { label: "Revenue", data: data.revenue, backgroundColor: "#4caf50" },
        { label: "Costs", data: data.costs, backgroundColor: "#f44336" }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Profit & Loss" }
      }
    }
  });

  document.getElementById("pnlSummary").innerHTML = `Total Revenue: €${totalRevenue.toFixed(2)}<br>Total Costs: €${totalCosts.toFixed(2)}<br>Profit: €${(totalRevenue - totalCosts).toFixed(2)}`;
}

function updateROI() {
  const totalRevenue = (window.padelData?.revenue || 0) + (window.gymData?.revenue || 0);
  const totalCosts = (window.padelData?.costs || 0) + (window.gymData?.costs || 0);
  const profit = totalRevenue - totalCosts;
  const investment = 500000; // placeholder investment
  const roiYears = profit > 0 ? investment / profit : Infinity;

  const ctx = document.getElementById("roiChart").getContext("2d");
  if (window.roiChart) window.roiChart.destroy();
  window.roiChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`),
      datasets: [{
        label: "Cumulative Profit",
        data: Array.from({ length: 10 }, (_, i) => (i + 1) * profit),
        borderColor: "#2196f3",
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "ROI Over Time" }
      }
    }
  });
  document.getElementById("roiSummary").innerHTML = `Years to ROI: ${roiYears === Infinity ? 'Never' : roiYears.toFixed(1)} years`;
}
