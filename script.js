function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function calculatePadel() {
  document.getElementById('padelSummary').innerHTML = '<p>Padel calculations go here.</p>';
}

function calculateGym() {
  document.getElementById('gymSummary').innerHTML = '<p>Gym calculations go here.</p>';
}
