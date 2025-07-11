// RPay Financial Admin - JavaScript Application
// Main application logic for handling UI interactions, animations, and data

// Application state
const app = {
    currentTab: 'dashboard',
    isLoading: false,
    transactions: [],
    claims: [],
    scholarshipApplications: [],
    isEditingProfile: false,
    user: {
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.rp.edu.sg',
        phone: '+65 9123 4567',
        studentId: 'RP2021001234',
        course: 'Diploma in Engineering Informatics',
        bankName: 'DBS Bank',
        accountNumber: '****-****-1234',
        accountHolder: 'John Doe',
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
    scholarshipForm: document.getElementById('scholarshipForm'),
    profileForm: document.getElementById('profileForm'),
    transactionFilter: document.getElementById('transactionFilter'),
    searchTransactions: document.getElementById('searchTransactions'),
    transactionList: document.getElementById('transactionList'),
    claimsList: document.getElementById('claimsList'),
    applicationsList: document.getElementById('applicationsList'),
    chatBubble: document.getElementById('chatBubble'),
    chatWindow: document.getElementById('chatWindow'),
    chatMessages: document.getElementById('chatMessages'),
    chatForm: document.getElementById('chatForm'),
    chatInput: document.getElementById('chatInput')
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
    loadSampleApplications();
    
    // Load user profile from localStorage
    loadUserProfile();
    
    // Initialize chat
    initializeChat();
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
    
    // Scholarship form submission
    if (elements.scholarshipForm) {
        elements.scholarshipForm.addEventListener('submit', handleScholarshipSubmission);
    }
    
    // Profile form submission
    if (elements.profileForm) {
        elements.profileForm.addEventListener('submit', handleProfileSubmission);
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
    
    // Chat bubble click handler
    if (elements.chatBubble) {
        elements.chatBubble.addEventListener('click', toggleChat);
        elements.chatBubble.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleChat();
            }
        });
    }
    
    // Chat form submission
    if (elements.chatForm) {
        elements.chatForm.addEventListener('submit', handleChatSubmit);
    }
    
    // Auto-resize chat input
    if (elements.chatInput) {
        elements.chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        const chatWindow = document.getElementById('chatWindow');
        const chatBubble = document.getElementById('chatBubble');
        
        if (isChatOpen && chatWindow && !chatWindow.contains(e.target) && !chatBubble.contains(e.target)) {
            toggleChat();
        }
    });
    
    // Escape key to close chat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isChatOpen) {
            toggleChat();
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

function showFormErrors(errors, formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Remove existing error messages
    clearFormErrors(form);
    
    // Add new error messages
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-errors';
    errorContainer.style.cssText = `
        background-color: rgba(231, 76, 60, 0.1);
        border: 1px solid var(--error);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
    `;
    
    const errorList = document.createElement('ul');
    errorList.style.cssText = `
        margin: 0;
        padding-left: var(--spacing-lg);
        color: var(--error);
    `;
    
    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorItem.style.marginBottom = 'var(--spacing-xs)';
        errorList.appendChild(errorItem);
    });
    
    errorContainer.appendChild(errorList);
    form.insertBefore(errorContainer, form.querySelector('.form-actions'));
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

// Scholarship application handling
function handleScholarshipSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const applicationData = {
        id: Date.now(),
        type: formData.get('scholarshipType'),
        gpa: parseFloat(formData.get('currentGPA')),
        householdIncome: parseFloat(formData.get('householdIncome')),
        personalStatement: formData.get('personalStatement'),
        supportingDocs: formData.get('supportingDocs'),
        status: 'submitted',
        submittedDate: new Date().toISOString(),
        submittedBy: app.user.name
    };
    
    // Validate form
    if (validateScholarshipForm(applicationData)) {
        submitScholarshipApplication(applicationData);
    }
}

function validateScholarshipForm(data) {
    const errors = [];
    
    if (!data.type) {
        errors.push('Please select a scholarship/bursary type');
    }
    
    if (!data.gpa || data.gpa < 0 || data.gpa > 4.0) {
        errors.push('Please enter a valid GPA (0.0 - 4.0)');
    }
    
    if (!data.householdIncome || data.householdIncome < 0) {
        errors.push('Please enter a valid household income');
    }
    
    if (!data.personalStatement || data.personalStatement.trim().length < 50) {
        errors.push('Please provide a detailed personal statement (minimum 50 characters)');
    }
    
    if (!data.supportingDocs) {
        errors.push('Please upload supporting documents');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors, 'scholarshipForm');
        return false;
    }
    
    return true;
}

function submitScholarshipApplication(applicationData) {
    // Show loading state
    const submitBtn = elements.scholarshipForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Add to applications list
        app.scholarshipApplications.unshift(applicationData);
        
        // Save to localStorage
        saveToLocalStorage('scholarshipApplications', app.scholarshipApplications);
        
        // Update UI
        updateApplicationsList();
        
        // Close modal and show success
        closeModal('scholarshipModal');
        showToast('Scholarship application submitted successfully!', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Profile management
function toggleEditProfile() {
    const forms = document.querySelectorAll('.profile-form input, .profile-form select, .profile-form textarea');
    const editBtn = document.getElementById('editProfileBtn');
    const actions = document.getElementById('profileActions');
    
    if (!app.isEditingProfile) {
        // Enable editing
        forms.forEach(input => {
            if (input.id !== 'studentId' && input.id !== 'email') { // Keep some fields readonly
                input.removeAttribute('readonly');
                input.style.backgroundColor = 'var(--white)';
                input.style.color = 'var(--text-primary)';
                input.style.cursor = 'text';
            }
        });
        
        editBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> Cancel Edit';
        editBtn.className = 'btn btn-outline';
        actions.style.display = 'flex';
        app.isEditingProfile = true;
    } else {
        cancelEditProfile();
    }
}

function cancelEditProfile() {
    const forms = document.querySelectorAll('.profile-form input, .profile-form select, .profile-form textarea');
    const editBtn = document.getElementById('editProfileBtn');
    const actions = document.getElementById('profileActions');
    
    // Disable editing and restore original values
    forms.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.style.backgroundColor = 'var(--background-gray)';
        input.style.color = 'var(--text-secondary)';
        input.style.cursor = 'not-allowed';
        
        // Restore original values
        const fieldName = input.name;
        if (app.user[fieldName]) {
            input.value = app.user[fieldName];
        }
    });
    
    editBtn.innerHTML = '<i class="fas fa-edit" aria-hidden="true"></i> Edit Profile';
    editBtn.className = 'btn btn-primary';
    actions.style.display = 'none';
    app.isEditingProfile = false;
}

function saveProfile() {
    const formData = new FormData(elements.profileForm);
    const bankingFormData = new FormData(document.getElementById('bankingForm'));
    
    // Update user object
    app.user.firstName = formData.get('firstName');
    app.user.lastName = formData.get('lastName');
    app.user.phone = formData.get('phone');
    app.user.course = formData.get('course');
    app.user.bankName = bankingFormData.get('bankName');
    app.user.accountNumber = bankingFormData.get('accountNumber');
    app.user.accountHolder = bankingFormData.get('accountHolder');
    app.user.name = `${app.user.firstName} ${app.user.lastName}`;
    
    // Save to localStorage
    saveToLocalStorage('userProfile', app.user);
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-section h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${app.user.firstName}!`;
    }
    
    // Exit edit mode
    cancelEditProfile();
    
    showToast('Profile updated successfully!', 'success');
}

function handleProfileSubmission(e) {
    e.preventDefault();
    saveProfile();
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

function loadSampleApplications() {
    app.scholarshipApplications = [
        {
            id: 1,
            type: 'merit',
            gpa: 3.8,
            householdIncome: 2500,
            personalStatement: 'I have consistently maintained excellent academic performance...',
            status: 'under_review',
            submittedDate: '2025-07-01T10:30:00Z',
            submittedBy: app.user.name,
            amount: 2000
        },
        {
            id: 2,
            type: 'bursary',
            gpa: 3.2,
            householdIncome: 1800,
            personalStatement: 'Due to my family\'s financial circumstances...',
            status: 'approved',
            submittedDate: '2025-06-15T14:20:00Z',
            submittedBy: app.user.name,
            amount: 1500
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
        case 'scholarships':
            updateApplicationsList();
            break;
        case 'fees':
        case 'aid':
        case 'profile':
        case 'dashboard':
            // These tabs have static content or are handled elsewhere
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

function updateApplicationsList() {
    if (!elements.applicationsList) return;
    
    if (app.scholarshipApplications.length === 0) {
        elements.applicationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-award" aria-hidden="true"></i>
                <h3>No applications submitted</h3>
                <p>Apply for scholarships and bursaries to get started.</p>
                <button class="btn btn-primary" onclick="openModal('scholarshipModal')">
                    <i class="fas fa-plus" aria-hidden="true"></i> Apply Now
                </button>
            </div>
        `;
        return;
    }
    
    const html = app.scholarshipApplications.map(application => `
        <div class="application-item">
            <div class="application-details">
                <h4>${formatScholarshipType(application.type)}</h4>
                <p class="application-date">Submitted: ${formatDate(application.submittedDate)}</p>
            </div>
            <div class="application-amount">$${application.amount.toLocaleString()}</div>
            <div class="application-status">
                <span class="status-badge ${application.status}">${formatApplicationStatus(application.status)}</span>
            </div>
        </div>
    `).join('');
    
    elements.applicationsList.innerHTML = html;
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
