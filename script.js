// Set today's date as default in date picker
document.getElementById('date').valueAsDate = new Date();

// Application State
let transactions = JSON.parse(localStorage.getItem('trackit_transactions')) || [];

// DOM Elements
const balanceAmount = document.getElementById('balanceAmount');
const incomeAmount = document.getElementById('incomeAmount');
const expenseAmount = document.getElementById('expenseAmount');

const transactionForm = document.getElementById('transactionForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');

const transactionList = document.getElementById('transactionList');
const filterCategory = document.getElementById('filterCategory');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');

// --- Helper Functions ---
function formatCurrency(num) {
  return '₹' + parseFloat(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function updateLocalStorage() {
  localStorage.setItem('trackit_transactions', JSON.stringify(transactions));
}

// --- Main App Functions ---
function updateSummary() {
  const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  
  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  balanceAmount.textContent = formatCurrency(total);
  incomeAmount.textContent = formatCurrency(income);
  expenseAmount.textContent = formatCurrency(expense);
}

function renderTransactions() {
  const selectedCategory = filterCategory.value;
  
  const filteredTransactions = selectedCategory === 'all'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  transactionList.innerHTML = '';

  if (filteredTransactions.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    
    filteredTransactions.forEach(t => {
      const li = document.createElement('li');
      li.className = `transaction-item ${t.type}`;
      
      li.innerHTML = `
        <div class="item-info">
          <h4>${t.desc}</h4>
          <span>${t.category} • ${t.date}</span>
        </div>
        <div class="item-right">
          <span class="item-amount ${t.type}">
            ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
          </span>
          <button class="btn-delete" onclick="deleteTransaction('${t.id}')" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      
      transactionList.appendChild(li);
    });
  }

  updateSummary();
}

function addTransaction(e) {
  e.preventDefault();

  const newTransaction = {
    id: Date.now().toString(),
    desc: descInput.value.trim(),
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
    category: categoryInput.value,
    date: dateInput.value
  };

  transactions.unshift(newTransaction);
  updateLocalStorage();
  renderTransactions();

  // Reset Form
  descInput.value = '';
  amountInput.value = '';
  dateInput.valueAsDate = new Date();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

// --- Theme Switcher ---
themeToggle.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.querySelector('i').className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

// --- Event Listeners ---
transactionForm.addEventListener('submit', addTransaction);
filterCategory.addEventListener('change', renderTransactions);

// Initial Render
renderTransactions();