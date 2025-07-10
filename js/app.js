// RPay Admin JavaScript - Republic Polytechnic Student Financial Portal

// Application State
const AppState = {
    currentTab: 'dashboard',
    transactions: [
        {
            id: 1,
            date: '2025-07-10',
            description: 'Semester 2 Tuition Payment',
            type: 'payment',
            amount: -3500.00,
            status: 'completed'
        },
        {
            id: 2,
            date: '2025-07-05',
            description: 'Merit Scholarship Credit',
            type: 'scholarship',
            amount: 2000.00,
            status: 'completed'
        },
        {
            id: 3,
            date: '2025-06-30',
            description: 'Lab Equipment Fee',
            type: 'payment',
            amount: -250.00,
            status: 'completed'
        },
        {
            id: 4,
            date: '2025-06-15',
            description: 'Library Fine Refund',
            type: 'refund',
            amount: 15.00,
            status: 'completed'
        },
        {
            id: 5,
            date: '2025-05-20',
            description: 'Semester 1 Tuition Payment',
            type: 'payment',
            amount: -3500.00,
            status: 'completed'
        }
    ],
    sortOrder: { column: null, direction: 'asc' },
    recentActions: JSON.parse(localStorage.getItem('rpay_recent_actions') || '[]')
};

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const tabPanels = document.querySelectorAll('.tab-panel');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const transactionSearch = document.getElementById('transaction-search');
const transactionFilter = document.getElementById('transaction-filter');
const transactionTable = document.getElementById('transactions-tbody');

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    loadTransactions();
    loadRecentActions();
});

// Initialize Application
function initializeApp() {
    // Set up ARIA attributes
    setupAccessibility();

    // Load saved state from localStorage
    const savedTab = localStorage.getItem('rpay_current_tab') || 'dashboard';
    switchTab(savedTab);

    console.log('RPay Admin initialized successfully');
}

// Setup Accessibility
function setupAccessibility() {
    // Add ARIA labels to dynamic elements
    navLinks.forEach((link, index) => {
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-selected', link.classList.contains('active'));
        link.setAttribute('tabindex', link.classList.contains('active') ? '0' : '-1');
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
            saveRecentAction(`Viewed ${tabName} section`);
        });

        // Keyboard support for tabs
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }

    // Transaction search and filter
    if (transactionSearch) {
        transactionSearch.addEventListener('input', debounce(filterTransactions, 300));
    }

    if (transactionFilter) {
        transactionFilter.addEventListener('change', filterTransactions);
    }

    // Table sorting
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            sortTransactions(column);
        });
    });

    // Form submissions
    setupFormHandlers();

    // Modal close on outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

// Tab Management
function switchTab(tabName) {
    // Remove active class from all tabs and panels
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-selected', 'false');
        link.setAttribute('tabindex', '-1');
    });

    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Add active class to selected tab and panel
    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    const activePanel = document.getElementById(`${tabName}-panel`);

    if (activeLink && activePanel) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-selected', 'true');
        activeLink.setAttribute('tabindex', '0');
        activePanel.classList.add('active');

        // Focus management for accessibility
        activeLink.focus();

        // Save current tab
        AppState.currentTab = tabName;
        localStorage.setItem('rpay_current_tab', tabName);

        // Announce tab change to screen readers
        announceToScreenReader(`Switched to ${tabName} section`);
    }
}

// Mobile Navigation
function toggleMobileNav() {
    navList.classList.toggle('active');
    const isOpen = navList.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    announceToScreenReader(isOpen ? 'Menu opened' : 'Menu closed');
}

// Transaction Management
function loadTransactions() {
    if (!transactionTable) return;

    renderTransactions(AppState.transactions);
}

function renderTransactions(transactions) {
    if (!transactionTable) return;

    transactionTable.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td><span class="status ${transaction.type}">${capitalizeFirst(transaction.type)}</span></td>
            <td class="${transaction.amount < 0 ? 'amount outstanding' : 'amount'}">${formatCurrency(transaction.amount)}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="downloadReceipt(${transaction.id})" aria-label="Download receipt for ${transaction.description}">
                    Receipt
                </button>
            </td>
        `;
        transactionTable.appendChild(row);
    });
}

function filterTransactions() {
    const searchTerm = transactionSearch ? transactionSearch.value.toLowerCase() : '';
    const filterType = transactionFilter ? transactionFilter.value : '';

    let filtered = AppState.transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
            transaction.type.toLowerCase().includes(searchTerm);
        const matchesFilter = !filterType || transaction.type === filterType;

        return matchesSearch && matchesFilter;
    });

    renderTransactions(filtered);
    announceToScreenReader(`Showing ${filtered.length} transactions`);
}

function sortTransactions(column) {
    let direction = 'asc';

    if (AppState.sortOrder.column === column && AppState.sortOrder.direction === 'asc') {
        direction = 'desc';
    }

    AppState.sortOrder = { column, direction };

    // Update sort indicators
    document.querySelectorAll('.sortable').forEach(header => {
        header.classList.remove('asc', 'desc');
        if (header.dataset.sort === column) {
            header.classList.add(direction);
        }
    });

    // Sort the array
    AppState.transactions.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        // Handle different data types
        if (column === 'date') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        } else if (column === 'amount') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        } else {
            aVal = aVal.toString().toLowerCase();
            bVal = bVal.toString().toLowerCase();
        }

        if (direction === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });

    filterTransactions(); // Re-render with current filters
    announceToScreenReader(`Table sorted by ${column} in ${direction}ending order`);
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    // Focus management
    const firstFocusable = modal.querySelector('input, textarea, select, button');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    saveRecentAction(`Opened ${modalId.replace('Modal', '')} application form`);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Clear form errors
    const form = modal.querySelector('form');
    if (form) {
        clearFormErrors(form);
    }

    // Return focus to trigger element
    const triggerButton = document.querySelector(`[onclick*="${modalId}"]`);
    if (triggerButton) {
        triggerButton.focus();
    }
}

// Form Handling
function setupFormHandlers() {
    // Bursary form
    const bursaryForm = document.getElementById('bursaryForm');
    if (bursaryForm) {
        bursaryForm.addEventListener('submit', handleBursarySubmission);
    }

    // Excellence form
    const excellenceForm = document.getElementById('excellenceForm');
    if (excellenceForm) {
        excellenceForm.addEventListener('submit', handleExcellenceSubmission);
    }
}

function handleBursarySubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Validate form
    if (!validateBursaryForm(form, formData)) {
        return;
    }

    // Simulate form submission
    submitApplication('bursary', formData)
        .then(() => {
            showSuccessMessage('Bursary application submitted successfully!');
            closeModal('bursaryModal');
            form.reset();
            saveRecentAction('Submitted bursary application');
        })
        .catch((error) => {
            showErrorMessage('Failed to submit application. Please try again.');
            console.error('Bursary submission error:', error);
        });
}

function handleExcellenceSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Validate form
    if (!validateExcellenceForm(form, formData)) {
        return;
    }

    // Simulate form submission
    submitApplication('excellence', formData)
        .then(() => {
            showSuccessMessage('Excellence award application submitted successfully!');
            closeModal('excellenceModal');
            form.reset();
            saveRecentAction('Submitted excellence award application');
        })
        .catch((error) => {
            showErrorMessage('Failed to submit application. Please try again.');
            console.error('Excellence submission error:', error);
        });
}

// Form Validation
function validateBursaryForm(form, formData) {
    clearFormErrors(form);
    let isValid = true;

    const householdIncome = formData.get('householdIncome');
    const familySize = formData.get('familySize');

    if (!householdIncome || parseFloat(householdIncome) < 0) {
        showFieldError('household-income', 'Please enter a valid household income');
        isValid = false;
    }

    if (!familySize || parseInt(familySize) < 1) {
        showFieldError('family-size', 'Please enter a valid family size');
        isValid = false;
    }

    return isValid;
}

function validateExcellenceForm(form, formData) {
    clearFormErrors(form);
    let isValid = true;

    const gpa = formData.get('currentGpa');
    const achievements = formData.get('achievements');
    const transcripts = formData.get('transcripts');

    if (!gpa || parseFloat(gpa) < 0 || parseFloat(gpa) > 4) {
        showFieldError('current-gpa', 'Please enter a valid GPA between 0 and 4');
        isValid = false;
    }

    if (!achievements || achievements.trim().length < 10) {
        showFieldError('achievements', 'Please provide detailed achievements (minimum 10 characters)');
        isValid = false;
    }

    if (!transcripts || transcripts.size === 0) {
        showFieldError('transcripts', 'Please upload your official transcripts');
        isValid = false;
    }

    return isValid;
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = 'var(--danger-red)';
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${fieldId}-error`);
    }
}

function clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });

    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    });
}

// API Simulation
async function submitApplication(type, formData) {
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve({ success: true, id: Date.now() });
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
}

// Utility Functions
function downloadReceipt(transactionId) {
    const transaction = AppState.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // Simulate receipt download
    showSuccessMessage(`Receipt for "${transaction.description}" is being downloaded...`);
    saveRecentAction(`Downloaded receipt for ${transaction.description}`);

    // In a real app, this would trigger an actual download
    console.log(`Downloading receipt for transaction ${transactionId}`);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    const formatted = new Intl.NumberFormat('en-SG', {
        style: 'currency',
        currency: 'SGD'
    }).format(Math.abs(amount));

    return amount < 0 ? `-${formatted}` : formatted;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Notification System
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Close notification">&times;</button>
    `;

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                color: white;
                font-weight: 600;
                z-index: 1001;
                max-width: 400px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
                animation: slideIn 0.3s ease;
                box-shadow: var(--shadow-lg);
            }
            .notification-success { background: var(--success-green); }
            .notification-error { background: var(--danger-red); }
            .notification-info { background: var(--info-blue); }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);

    // Announce to screen readers
    announceToScreenReader(message);
}

// Recent Actions Tracking
function saveRecentAction(action) {
    const timestamp = new Date().toISOString();
    AppState.recentActions.unshift({ action, timestamp });

    // Keep only last 10 actions
    AppState.recentActions = AppState.recentActions.slice(0, 10);

    localStorage.setItem('rpay_recent_actions', JSON.stringify(AppState.recentActions));
}

function loadRecentActions() {
    // This could be used to populate a "Recent Activity" section
    console.log('Recent actions:', AppState.recentActions);
}

// Accessibility Helpers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

function handleKeyboardNavigation(e) {
    // Arrow key navigation for tabs
    if (e.target.classList.contains('nav-link')) {
        const tabs = Array.from(navLinks);
        const currentIndex = tabs.indexOf(e.target);

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            tabs[prevIndex].focus();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            tabs[nextIndex].focus();
        } else if (e.key === 'Home') {
            e.preventDefault();
            tabs[0].focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            tabs[tabs.length - 1].focus();
        }
    }
}

// Global functions for HTML onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.downloadReceipt = downloadReceipt;

// Export for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        switchTab,
        formatCurrency,
        formatDate,
        validateBursaryForm,
        validateExcellenceForm
    };
}
