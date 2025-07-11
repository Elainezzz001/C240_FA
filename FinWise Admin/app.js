// FinWise Admin - app.js
// Chart.js demo data for budget overview
const ctx = document.getElementById('budgetChart').getContext('2d');
const budgetChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Spent', 'Remaining'],
    datasets: [{
      data: [65000, 35000],
      backgroundColor: ['#1A237E', '#2E7D32'],
      borderWidth: 2
    }]
  },
  options: {
    plugins: {
      legend: { position: 'bottom' }
    },
    responsive: true,
    maintainAspectRatio: false
  }
});

// Demo transactions data
const transactions = [
  { date: '2025-07-01', desc: 'Office Supplies', amount: 120.50, status: 'Approved' },
  { date: '2025-07-03', desc: 'Travel Reimbursement', amount: 450.00, status: 'Pending' },
  { date: '2025-07-05', desc: 'Catering', amount: 300.00, status: 'Approved' },
  { date: '2025-07-07', desc: 'Software License', amount: 800.00, status: 'Rejected' }
];

function renderTransactions(data) {
  const tbody = document.querySelector('#transactionsTable tbody');
  tbody.innerHTML = '';
  data.forEach(tx => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.desc}</td>
      <td>$${tx.amount.toFixed(2)}</td>
      <td>${tx.status}</td>
    `;
    tbody.appendChild(row);
  });
}

// Search/filter functionality with debounce
const searchInput = document.getElementById('searchTransactions');
searchInput.addEventListener('input', debounce(function(e) {
  const q = e.target.value.toLowerCase();
  const filtered = transactions.filter(tx =>
    tx.desc.toLowerCase().includes(q) ||
    tx.status.toLowerCase().includes(q) ||
    tx.date.includes(q)
  );
  renderTransactions(filtered);
}, 300));

function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Initial render
renderTransactions(transactions);

// Form validation and local storage for reimbursements
document.getElementById('reimbursementForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const message = document.getElementById('formMessage');
  if (!desc || isNaN(amount) || amount <= 0) {
    message.textContent = 'Please enter a valid description and amount.';
    message.style.color = 'red';
    return;
  }
  // Save to localStorage (simulate draft)
  const drafts = JSON.parse(localStorage.getItem('reimbursementDrafts') || '[]');
  drafts.push({ desc, amount, date: new Date().toISOString() });
  localStorage.setItem('reimbursementDrafts', JSON.stringify(drafts));
  message.textContent = 'Reimbursement submitted (saved locally).';
  message.style.color = 'var(--success)';
  this.reset();
});

// Accessibility: focus styles
['desc', 'amount', 'searchTransactions'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('focus', () => el.style.outline = '2px solid #FFD600');
  el.addEventListener('blur', () => el.style.outline = '');
});

// Keyboard navigation for table rows
document.getElementById('transactionsTable').addEventListener('keydown', function(e) {
  if (e.target.tagName === 'TD' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    const row = e.target.parentElement;
    const next = e.key === 'ArrowDown' ? row.nextElementSibling : row.previousElementSibling;
    if (next) {
      next.children[0].focus();
    }
  }
});
