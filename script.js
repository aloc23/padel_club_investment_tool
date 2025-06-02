function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// --- Staff Cost Calculators ---
function calcStaffTotal(sectionId, outputId) {
  let inputs = document.querySelectorAll(`#${sectionId} input`);
  let total = 0;
  for (let i = 0; i < inputs.length; i += 2) {
    const count = parseFloat(inputs[i].value) || 0;
    const salary = parseFloat(inputs[i + 1].value) || 0;
    total += count * salary;
  }
  document.getElementById(outputId).innerText = total.toLocaleString();
  return total;
}

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
    calcStaffTotal('padel-ft', 'padel_staff_total');
    calcStaffTotal('padel-pt', 'padel_staff_total');
    calcStaffTotal('gym-ft', 'gym_staff_total');
    calcStaffTotal('gym-pt', 'gym_staff_total');
  });
});

// --- P&L + ROI Chart Rendering ---
const plBar = new Chart(document.getElementById('plBarChart'), {
  type: 'bar',
  data: {
    labels: ["Revenue", "Costs"],
    datasets: [{
      label: 'P&L Summary',
      data: [300000, 240000],
      backgroundColor: ['#4caf50', '#f44336']
    }]
  }
});

const plLine = new Chart(document.getElementById('plLineChart'), {
  type: 'line',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: 'Monthly Profit (€)',
      data: [5000, 8000, 10000, 9500, 11000, 13000],
      borderColor: '#2196f3',
      fill: false
    }]
  }
});

const plPie = new Chart(document.getElementById('plPieChart'), {
  type: 'pie',
  data: {
    labels: ["Salaries", "Overheads", "Maintenance"],
    datasets: [{
      data: [100000, 80000, 60000],
      backgroundColor: ['#ff9800', '#9c27b0', '#03a9f4']
    }]
  }
});

// ROI Charts
const roiLine = new Chart(document.getElementById('roiLineChart'), {
  type: 'line',
  data: {
    labels: ["Year 1", "Year 2", "Year 3", "Year 4"],
    datasets: [{
      label: 'Cumulative ROI (€)',
      data: [10000, 35000, 70000, 110000],
      borderColor: '#009688',
      fill: false
    }]
  }
});

const roiBar = new Chart(document.getElementById('roiBarChart'), {
  type: 'bar',
  data: {
    labels: ["Year 1", "Year 2", "Year 3", "Year 4"],
    datasets: [{
      label: 'Annual ROI (€)',
      data: [10000, 25000, 35000, 40000],
      backgroundColor: '#3f51b5'
    }]
  }
});

const roiPie = new Chart(document.getElementById('roiPieChart'), {
  type: 'pie',
  data: {
    labels: ["Initial Investment", "Return"],
    datasets: [{
      data: [200000, 110000],
      backgroundColor: ['#607d8b', '#8bc34a']
    }]
  }
});

// P&L Toggle (Monthly vs Annual)
document.querySelectorAll('input[name="pl_toggle"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const isAnnual = radio.value === 'annual';
    plLine.data.datasets[0].data = isAnnual 
      ? [60000, 85000, 100000, 120000]
      : [5000, 8000, 10000, 9500, 11000, 13000];
    plLine.data.labels = isAnnual 
      ? ["Year 1", "Year 2", "Year 3", "Year 4"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    plLine.update();
  });
});
