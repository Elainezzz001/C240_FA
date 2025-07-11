// RPay Financial Admin - JavaScript Application
// Main application logic for handling UI interactions, animations, and data

// Application state
const app = {
    currentTab: 'dashboard',
    isLoading: false,
    transactions: [],
    claims: [],
    user: {
        name: 'Student',
        totalFees: 8450,
        pendingClaims: 1250,
        financialAid: 3500,
        balance: 450
    }
};

// DOM Elements
const elements = {
    navLinks: document.querySelectorAll('.nav-link'),
    tabContents: document.querySelectorAll('.tab-content'),
    navToggle: document.querySelector('.nav-toggle'),
    navLinksContainer: document.querySelector('.nav-links'),
    toast: document.getElementById('toast'),
    dashboardCards: document.querySelectorAll('.card-amount'),
    claimForm: document.getElementById('claimForm'),
    transactionFilter: document.getElementById('transactionFilter'),
    searchTransactions: document.getElementById('searchTransactions'),
    transactionList: document.getElementById('transactionList'),
    claimsList: document.getElementById('claimsList')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
    showToast('Dashboard is ready!', 'success');
});

// Application initialization
function initializeApp() {
    console.log('RPay Financial Admin initialized');
    
    // Set initial active tab
    setActiveTab('dashboard');
    
    // Animate dashboard counters
    animateCounters();
    
    // Setup mobile navigation
    setupMobileNavigation();
    
    // Load sample data
    loadSampleTransactions();
    loadSampleClaims();
}

// Event listeners setup
function setupEventListeners() {
    // Navigation tab switching
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleTabSwitch);
    });
    
    // Mobile navigation toggle
    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Claim form submission
    if (elements.claimForm) {
        elements.claimForm.addEventListener('submit', handleClaimSubmission);
    }
    
    // Transaction filtering
    if (elements.transactionFilter) {
        elements.transactionFilter.addEventListener('change', filterTransactions);
    }
    
    // Transaction search
    if (elements.searchTransactions) {
        elements.searchTransactions.addEventListener('input', debounce(searchTransactions, 300));
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

// Tab switching functionality
function handleTabSwitch(e) {
    e.preventDefault();
    const tabName = e.currentTarget.getAttribute('data-tab');
    if (tabName && tabName !== app.currentTab) {
        setActiveTab(tabName);
    }
}

function setActiveTab(tabName) {
    // Update navigation
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
    });
    
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.setAttribute('aria-hidden', 'false');
    }
    
    // Update application state
    app.currentTab = tabName;
    
    // Load tab-specific data
    loadTabData(tabName);
}

// Mobile navigation
function setupMobileNavigation() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addListener(handleMobileNavigation);
    handleMobileNavigation(mediaQuery);
}

function handleMobileNavigation(e) {
    if (!e.matches && elements.navLinksContainer) {
        elements.navLinksContainer.classList.remove('show');
        elements.navToggle.setAttribute('aria-expanded', 'false');
    }
}

function toggleMobileNav() {
    if (elements.navLinksContainer) {
        const isOpen = elements.navLinksContainer.classList.toggle('show');
        elements.navToggle.setAttribute('aria-expanded', isOpen.toString());
        
        // Update hamburger animation
        const hamburger = elements.navToggle.querySelector('.hamburger');
        if (hamburger) {
            hamburger.style.transform = isOpen ? 'rotate(45deg)' : '';
        }
    }
}

// Counter animations
function animateCounters() {
    elements.dashboardCards.forEach(card => {
        const target = parseInt(card.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                card.textContent = `$${Math.floor(current).toLocaleString()}`;
                requestAnimationFrame(updateCounter);
            } else {
                card.textContent = `$${target.toLocaleString()}`;
            }
        };
        
        // Start animation after a slight delay
        setTimeout(updateCounter, Math.random() * 500);
    });
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus the first focusable element
        const firstFocusable = modal.querySelector('input, select, textarea, button');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset form if it's a form modal
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormErrors(form);
        }
    }
}

// Form handling
function handleClaimSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const claimData = {
        id: Date.now(),
        type: formData.get('claimType'),
        amount: parseFloat(formData.get('claimAmount')),
        description: formData.get('claimDescription'),
        receipt: formData.get('claimReceipt'),
        status: 'pending',
        submittedDate: new Date().toISOString(),
        submittedBy: app.user.name
    };
    
    // Validate form
    if (validateClaimForm(claimData)) {
        // Simulate API call
        submitClaim(claimData);
    }
}

function validateClaimForm(data) {
    const errors = [];
    
    if (!data.type) {
        errors.push('Please select a claim type');
    }
    
    if (!data.amount || data.amount <= 0) {
        errors.push('Please enter a valid amount');
    }
    
    if (!data.description || data.description.trim().length < 10) {
        errors.push('Please provide a detailed description (minimum 10 characters)');
    }
    
    if (!data.receipt) {
        errors.push('Please upload a receipt');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function showFormErrors(errors) {
    // Remove existing error messages
    clearFormErrors(elements.claimForm);
    
    // Add new error messages
    errors.forEach(error => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = error;
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--spacing-xs)';
        
        elements.claimForm.insertBefore(errorDiv, elements.claimForm.querySelector('.form-actions'));
    });
}

function clearFormErrors(form) {
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
}

function submitClaim(claimData) {
    // Show loading state
    const submitBtn = elements.claimForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Add to claims list
        app.claims.unshift(claimData);
        
        // Update UI
        updateClaimsList();
        updatePendingClaimsAmount();
        
        // Close modal and show success
        closeModal('claimModal');
        showToast('Claim submitted successfully!', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Transaction and claims data management
function loadSampleTransactions() {
    app.transactions = [
        {
            id: 1,
            date: '2025-07-10',
            type: 'fees',
            description: 'Semester 2 Tuition Fee',
            amount: -4200,
            status: 'completed'
        },
        {
            id: 2,
            date: '2025-07-09',
            type: 'aid',
            description: 'Financial Aid Disbursement',
            amount: 3500,
            status: 'completed'
        },
        {
            id: 3,
            date: '2025-07-08',
            type: 'fees',
            description: 'Student Services Fee',
            amount: -250,
            status: 'completed'
        },
        {
            id: 4,
            date: '2025-07-07',
            type: 'claims',
            description: 'Textbook Reimbursement',
            amount: 150,
            status: 'processing'
        },
        {
            id: 5,
            date: '2025-07-05',
            type: 'fees',
            description: 'Lab Fee - Engineering',
            amount: -300,
            status: 'completed'
        }
    ];
}

function loadSampleClaims() {
    app.claims = [
        {
            id: 1,
            type: 'textbook',
            amount: 150,
            description: 'Engineering Mathematics textbook for EG2401',
            status: 'approved',
            submittedDate: '2025-07-07T10:30:00Z',
            submittedBy: app.user.name
        },
        {
            id: 2,
            type: 'transport',
            amount: 45,
            description: 'Monthly transport pass for July 2025',
            status: 'pending',
            submittedDate: '2025-07-09T14:15:00Z',
            submittedBy: app.user.name
        },
        {
            id: 3,
            type: 'meal',
            amount: 25,
            description: 'Project team dinner during late study session',
            status: 'rejected',
            submittedDate: '2025-07-06T18:45:00Z',
            submittedBy: app.user.name
        }
    ];
}

// Data loading and updating
function loadTabData(tabName) {
    switch (tabName) {
        case 'transactions':
            updateTransactionsList();
            break;
        case 'claims':
            updateClaimsList();
            break;
        case 'aid':
            // Aid data is static for now
            break;
        default:
            break;
    }
}

function loadInitialData() {
    // This would typically fetch data from an API
    updateTransactionsList();
    updateClaimsList();
}

function updateTransactionsList() {
    if (!elements.transactionList) return;
    
    const filteredTransactions = getFilteredTransactions();
    
    if (filteredTransactions.length === 0) {
        elements.transactionList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox" aria-hidden="true"></i>
                <h3>No transactions found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }
    
    const html = filteredTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-icon">
                <i class="fas ${getTransactionIcon(transaction.type)}" aria-hidden="true"></i>
            </div>
            <div class="transaction-details">
                <h4>${transaction.description}</h4>
                <p class="transaction-date">${formatDate(transaction.date)}</p>
                <span class="transaction-type">${formatTransactionType(transaction.type)}</span>
            </div>
            <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toLocaleString()}
            </div>
            <div class="transaction-status">
                <span class="status-badge ${transaction.status}">${formatStatus(transaction.status)}</span>
            </div>
        </div>
    `).join('');
    
    elements.transactionList.innerHTML = html;
}

function updateClaimsList() {
    if (!elements.claimsList) return;
    
    if (app.claims.length === 0) {
        elements.claimsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-invoice" aria-hidden="true"></i>
                <h3>No claims submitted</h3>
                <p>Submit your first claim to get started.</p>
                <button class="btn btn-primary" onclick="openModal('claimModal')">
                    <i class="fas fa-plus" aria-hidden="true"></i> Submit New Claim
                </button>
            </div>
        `;
        return;
    }
    
    const html = app.claims.map(claim => `
        <div class="claim-item">
            <div class="claim-header">
                <h4>${formatClaimType(claim.type)} - $${claim.amount.toLocaleString()}</h4>
                <span class="status-badge ${claim.status}">${formatStatus(claim.status)}</span>
            </div>
            <p class="claim-description">${claim.description}</p>
            <div class="claim-meta">
                <span class="claim-date">Submitted: ${formatDate(claim.submittedDate)}</span>
                <span class="claim-id">ID: #${claim.id}</span>
            </div>
        </div>
    `).join('');
    
    elements.claimsList.innerHTML = html;
}

// Filtering and searching
function filterTransactions() {
    updateTransactionsList();
}

function searchTransactions() {
    updateTransactionsList();
}

function getFilteredTransactions() {
    let filtered = [...app.transactions];
    
    // Apply type filter
    const typeFilter = elements.transactionFilter?.value;
    if (typeFilter && typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    // Apply search filter
    const searchTerm = elements.searchTransactions?.value?.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.description.toLowerCase().includes(searchTerm) ||
            t.type.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return filtered;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTransactionType(type) {
    const types = {
        fees: 'School Fees',
        claims: 'Claim',
        aid: 'Financial Aid'
    };
    return types[type] || type;
}

function formatClaimType(type) {
    const types = {
        textbook: 'Textbook Reimbursement',
        transport: 'Transport Allowance',
        meal: 'Meal Allowance',
        other: 'Other'
    };
    return types[type] || type;
}

function formatStatus(status) {
    const statuses = {
        completed: 'Completed',
        processing: 'Processing',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected'
    };
    return statuses[status] || status;
}

function getTransactionIcon(type) {
    const icons = {
        fees: 'fa-graduation-cap',
        claims: 'fa-receipt',
        aid: 'fa-hand-holding-usd'
    };
    return icons[type] || 'fa-circle';
}

function updatePendingClaimsAmount() {
    const pendingAmount = app.claims
        .filter(claim => claim.status === 'pending')
        .reduce((sum, claim) => sum + claim.amount, 0);
    
    app.user.pendingClaims = pendingAmount;
    
    // Update dashboard card
    const pendingCard = document.querySelector('[data-target="1250"]');
    if (pendingCard) {
        pendingCard.setAttribute('data-target', pendingAmount);
        pendingCard.textContent = `$${pendingAmount.toLocaleString()}`;
    }
}

// Toast notifications
function showToast(message, type = 'success') {
    if (!elements.toast) return;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const iconColor = type === 'success' ? 'var(--success)' : 'var(--error)';
    
    elements.toast.querySelector('.toast-icon').className = `toast-icon fas ${icon}`;
    elements.toast.querySelector('.toast-icon').style.color = iconColor;
    elements.toast.querySelector('.toast-message').textContent = message;
    
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Utility functions
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

// Quick action functions
function downloadStatement() {
    showToast('Statement download started', 'success');
    
    // Simulate file download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,RPay Financial Statement - Generated on ' + new Date().toLocaleDateString();
        link.download = 'rpay-statement-' + new Date().toISOString().split('T')[0] + '.txt';
        link.click();
    }, 1000);
}

function viewHelp() {
    showToast('Opening help center...', 'success');
    
    // This would typically open a help modal or redirect to help page
    setTimeout(() => {
        alert('Help & Support\n\nFor assistance with RPay Financial Admin:\n\n• Email: fintech@rp.edu.sg\n• Phone: +65 6510 3000\n• Office Hours: Mon-Fri 9AM-5PM\n\nCommon questions:\n• How to submit a claim?\n• Payment deadlines\n• Financial aid status');
    }, 500);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Page loaded in ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }
        }, 0);
    });
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { app, formatDate, formatStatus };
}
