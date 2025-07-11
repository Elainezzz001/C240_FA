// Global Variables
let currentTab = 'dashboard';
let transactions = [];
let claims = [];
let studentProfile = {
    name: 'John Doe',
    id: 'S1234567A',
    course: 'Diploma in Information Technology',
    email: 'john.doe@mail.rp.edu.sg',
    phone: '+65 9123 4567',
    address: '123 Main Street, Singapore 123456'
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    renderRecentTransactions();
    renderAllTransactions();
    renderClaims();
    setupEventListeners();
});

// Initialize the application
function initializeApp() {
    // Load saved data from localStorage
    loadFromStorage();
    
    // Set up navigation
    setupNavigation();
    
    // Initialize chat functionality
    initializeChat();
    
    // Show dashboard by default
    showTab('dashboard');
}

// Setup navigation event listeners
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabName) {
            item.classList.add('active');
        }
    });
    
    // Show corresponding tab content
    showTab(tabName);
    currentTab = tabName;
}

// Show specific tab content
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Claim form submission
    const claimForm = document.getElementById('claimForm');
    if (claimForm) {
        claimForm.addEventListener('submit', handleClaimSubmission);
    }
    
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Transaction filter
    const transactionFilter = document.getElementById('transactionFilter');
    if (transactionFilter) {
        transactionFilter.addEventListener('change', filterTransactions);
    }
    
    // Chat functionality
    const sendButton = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInputField');
    
    if (sendButton) {
        sendButton.addEventListener('click', sendChatMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

// Load sample data
function loadSampleData() {
    transactions = [
        {
            id: 1,
            type: 'income',
            description: 'Scholarship Payment',
            amount: 2000.00,
            date: '2025-07-01',
            category: 'scholarship'
        },
        {
            id: 2,
            type: 'expense',
            description: 'School Fees Payment',
            amount: 7700.00,
            date: '2025-06-15',
            category: 'fees'
        },
        {
            id: 3,
            type: 'income',
            description: 'Bursary Award',
            amount: 500.00,
            date: '2025-06-10',
            category: 'bursary'
        },
        {
            id: 4,
            type: 'expense',
            description: 'Textbook Purchase',
            amount: 150.00,
            date: '2025-06-05',
            category: 'books'
        },
        {
            id: 5,
            type: 'expense',
            description: 'Transportation',
            amount: 50.00,
            date: '2025-07-08',
            category: 'transport'
        }
    ];
    
    claims = [
        {
            id: 1,
            type: 'Medical Expenses',
            amount: 120.00,
            description: 'Doctor consultation and medication',
            status: 'pending',
            date: '2025-07-05'
        },
        {
            id: 2,
            type: 'Transportation',
            amount: 230.00,
            description: 'Monthly transport allowance',
            status: 'approved',
            date: '2025-06-20'
        },
        {
            id: 3,
            type: 'Equipment/Books',
            amount: 85.00,
            description: 'Programming textbooks',
            status: 'rejected',
            date: '2025-06-15'
        }
    ];
    
    // Save to localStorage
    saveToStorage();
}

// Render recent transactions on dashboard
function renderRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    if (!container) return;
    
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    container.innerHTML = recentTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${formatDate(transaction.date)}</p>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Render all transactions
function renderAllTransactions() {
    const container = document.getElementById('allTransactions');
    if (!container) return;
    
    const sortedTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${formatDate(transaction.date)} • ${transaction.category}</p>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Filter transactions
function filterTransactions() {
    const filter = document.getElementById('transactionFilter').value;
    const container = document.getElementById('allTransactions');
    
    let filteredTransactions = transactions;
    
    if (filter !== 'all') {
        filteredTransactions = transactions.filter(t => t.type === filter);
    }
    
    const sortedTransactions = filteredTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedTransactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${formatDate(transaction.date)} • ${transaction.category}</p>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

// Render claims
function renderClaims() {
    const container = document.getElementById('claimsList');
    if (!container) return;
    
    const sortedClaims = claims
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedClaims.map(claim => `
        <div class="claim-item">
            <div class="claim-header">
                <span class="claim-type">${claim.type}</span>
                <span class="claim-status ${claim.status}">${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</span>
            </div>
            <p>${claim.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                <span class="claim-amount">$${claim.amount.toFixed(2)}</span>
                <span class="claim-date">${formatDate(claim.date)}</span>
            </div>
        </div>
    `).join('');
}

// Handle claim form submission
function handleClaimSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const claimData = {
        id: claims.length + 1,
        type: document.getElementById('claimType').value,
        amount: parseFloat(document.getElementById('claimAmount').value),
        description: document.getElementById('claimDescription').value,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
    };
    
    // Validate form
    if (!claimData.type || !claimData.amount || !claimData.description) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Add claim to array
    claims.push(claimData);
    
    // Update UI
    renderClaims();
    
    // Reset form
    e.target.reset();
    
    // Save to storage
    saveToStorage();
    
    // Show success message
    showToast('Claim submitted successfully! You will receive an update within 3-5 business days.', 'success');
}

// Profile management
function editProfile() {
    // Populate modal with current data
    document.getElementById('editName').value = studentProfile.name;
    document.getElementById('editEmail').value = studentProfile.email;
    document.getElementById('editPhone').value = studentProfile.phone;
    document.getElementById('editAddress').value = studentProfile.address;
    
    // Show modal
    document.getElementById('profileModal').classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    // Update profile data
    studentProfile.name = document.getElementById('editName').value;
    studentProfile.email = document.getElementById('editEmail').value;
    studentProfile.phone = document.getElementById('editPhone').value;
    studentProfile.address = document.getElementById('editAddress').value;
    
    // Update UI
    updateProfileDisplay();
    
    // Close modal
    closeProfileModal();
    
    // Save to storage
    saveToStorage();
    
    // Show success message
    showToast('Profile updated successfully!', 'success');
}

function updateProfileDisplay() {
    document.getElementById('studentName').textContent = studentProfile.name;
    document.getElementById('studentId').textContent = studentProfile.id;
    document.getElementById('studentCourse').textContent = studentProfile.course;
    document.getElementById('studentEmail').textContent = studentProfile.email;
    document.getElementById('studentPhone').textContent = studentProfile.phone;
    document.getElementById('studentAddress').textContent = studentProfile.address;
}

// Chat functionality
function initializeChat() {
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    
    if (chatBubble) {
        chatBubble.addEventListener('click', function() {
            chatWindow.classList.toggle('active');
        });
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            chatWindow.classList.remove('active');
        });
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInputField');
    const messagesContainer = document.getElementById('chatMessages');
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `<p>${getBotResponse(message)}</p>`;
        messagesContainer.appendChild(botMessage);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('fee') || message.includes('payment')) {
        return 'Your current semester fees are fully paid. For payment history or upcoming fees, check the School Fees section.';
    } else if (message.includes('claim') || message.includes('reimburs')) {
        return 'You can submit claims for medical expenses, transportation, or equipment. Go to the Claims section to submit a new claim.';
    } else if (message.includes('scholarship') || message.includes('bursary')) {
        return 'You currently have an active Merit Scholarship worth $2,000. Check the Scholarships section for more opportunities.';
    } else if (message.includes('balance') || message.includes('money')) {
        return 'Your current account balance is $1,250.30. You can view detailed transactions in the Transactions section.';
    } else if (message.includes('help') || message.includes('support')) {
        return 'I can help you with questions about fees, claims, scholarships, and account balances. You can also contact our finance office directly at finance@rp.edu.sg.';
    } else {
        return 'Thank you for your message. For specific financial queries, please visit the relevant sections in your dashboard or contact our finance office at finance@rp.edu.sg.';
    }
}

// PDF Statement Generation
function downloadStatement() {
    try {
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add header
        doc.setFontSize(20);
        doc.setTextColor(30, 132, 73); // RP Green
        doc.text('RPay Financial Statement', 20, 30);
        
        // Add student info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Student: ${studentProfile.name}`, 20, 50);
        doc.text(`Student ID: ${studentProfile.id}`, 20, 60);
        doc.text(`Course: ${studentProfile.course}`, 20, 70);
        doc.text(`Statement Date: ${formatDate(new Date().toISOString().split('T')[0])}`, 20, 80);
        
        // Add line
        doc.line(20, 90, 190, 90);
        
        // Add transactions
        doc.setFontSize(14);
        doc.text('Recent Transactions', 20, 105);
        
        let yPosition = 120;
        const recentTransactions = transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
        
        doc.setFontSize(10);
        recentTransactions.forEach(transaction => {
            const sign = transaction.type === 'income' ? '+' : '-';
            const amount = `${sign}$${transaction.amount.toFixed(2)}`;
            
            doc.text(formatDate(transaction.date), 20, yPosition);
            doc.text(transaction.description, 50, yPosition);
            doc.text(amount, 150, yPosition);
            
            yPosition += 10;
        });
        
        // Add summary
        doc.line(20, yPosition + 5, 190, yPosition + 5);
        doc.setFontSize(12);
        doc.text('Account Summary', 20, yPosition + 20);
        doc.text('Total School Fees: $8,500.00 (Paid)', 20, yPosition + 35);
        doc.text('Active Scholarships: $2,000.00', 20, yPosition + 45);
        doc.text('Current Balance: $1,250.30', 20, yPosition + 55);
        
        // Save the PDF
        doc.save('rpay-financial-statement.pdf');
        
        showToast('Financial statement downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Error generating PDF. Please try again.', 'error');
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
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

function saveToStorage() {
    localStorage.setItem('rpay_transactions', JSON.stringify(transactions));
    localStorage.setItem('rpay_claims', JSON.stringify(claims));
    localStorage.setItem('rpay_profile', JSON.stringify(studentProfile));
}

function loadFromStorage() {
    const storedTransactions = localStorage.getItem('rpay_transactions');
    const storedClaims = localStorage.getItem('rpay_claims');
    const storedProfile = localStorage.getItem('rpay_profile');
    
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
    
    if (storedClaims) {
        claims = JSON.parse(storedClaims);
    }
    
    if (storedProfile) {
        studentProfile = JSON.parse(storedProfile);
        updateProfileDisplay();
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const profileModal = document.getElementById('profileModal');
    
    if (e.target === profileModal) {
        closeProfileModal();
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals
        closeProfileModal();
        
        // Close chat window
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow.classList.contains('active')) {
            chatWindow.classList.remove('active');
        }
    }
});

// Add keyboard navigation for tabs
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const tabs = ['dashboard', 'school-fees', 'claims', 'scholarships', 'transactions', 'profile'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            switchTab(tabs[tabIndex]);
        }
    }
});

// Export functions for global use
window.switchTab = switchTab;
window.editProfile = editProfile;
window.closeProfileModal = closeProfileModal;
window.downloadStatement = downloadStatement;
