// RPay Financial Admin - JavaScript Functionality

class RPay {
    constructor() {
        this.currentTab = 'dashboard';
        this.studentData = this.loadStudentData();
        this.transactions = this.generateSampleTransactions();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupChat();
        this.setupModals();
        this.setupForms();
        this.loadTransactions();
        this.loadStudentProfile();
    }

    // Data Management
    loadStudentData() {
        const defaultData = {
            name: 'John Doe',
            studentId: 'S12345678',
            course: 'Diploma in Information Technology',
            email: 'john.doe@student.rp.edu.sg',
            phone: '+65 9123 4567',
            GPA: 3.8,
            settings: {
                emailNotifications: true,
                smsAlerts: false,
                paymentReminders: true
            }
        };

        const saved = localStorage.getItem('rpay_student_data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveStudentData() {
        localStorage.setItem('rpay_student_data', JSON.stringify(this.studentData));
    }

    generateSampleTransactions() {
        const transactions = [
            {
                id: 1,
                type: 'income',
                description: 'Bursary Payment',
                amount: 500.00,
                date: new Date('2025-07-09'),
                category: 'Financial Aid'
            },
            {
                id: 2,
                type: 'expense',
                description: 'Tuition Fee Payment',
                amount: 1225.00,
                date: new Date('2025-07-04'),
                category: 'School Fees'
            },
            {
                id: 3,
                type: 'income',
                description: 'Merit Scholarship',
                amount: 750.00,
                date: new Date('2025-06-28'),
                category: 'Scholarship'
            },
            {
                id: 4,
                type: 'expense',
                description: 'Student Services Fee',
                amount: 150.00,
                date: new Date('2025-06-15'),
                category: 'School Fees'
            },
            {
                id: 5,
                type: 'income',
                description: 'Transport Allowance',
                amount: 85.00,
                date: new Date('2025-06-10'),
                category: 'Claims'
            }
        ];

        return transactions.sort((a, b) => b.date - a.date);
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav-list');

        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
            });
        }

        // --- Scholarship Apply Now Modal Logic ---

        // 1. Open modal on Apply Now click
        document.querySelectorAll('.scholarship-item .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.scholarship-item');
                const title = card?.querySelector('h4')?.textContent || '';

                // Set student info
                document.getElementById('applicantName').value = this.studentData.name;
                document.getElementById('applicantId').value = this.studentData.studentId;

                // Save the selected scholarship type for validation
                document.getElementById('applicationForm').setAttribute('data-scholarship', title);

                const modal = document.getElementById('applicationModal');
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.getElementById('applicantGpa').focus();
            });
        });

        // 2. Close modal (X and Cancel)
        document.getElementById('applicationModalClose')?.addEventListener('click', () => {
            document.getElementById('applicationModal').classList.remove('active');
        });

        document.getElementById('cancelApplication')?.addEventListener('click', () => {
            document.getElementById('applicationModal').classList.remove('active');
        });

        // 3. Handle form submission
        document.getElementById('applicationForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const gpa = document.getElementById('applicantGpa').value;
           const scholarship = document.getElementById('applicationForm').getAttribute('data-scholarship');
            const numericGpa = parseFloat(gpa);

            const gpaRequirements = {
                "Merit Scholarship": 3.0,
                "Need-Based Bursary": 0.0,  // No requirement
                "Excellence Award": 3.5,
                "Talent Bursary": 0.0,
                "Leadership Grant": 3.2
            };

            const requiredGpa = gpaRequirements[scholarship] ?? 0.0;

            if (!gpa || numericGpa < 0 || numericGpa > 4.0) {
                window.rpayApp.showToast('Please enter a valid GPA.', 'error');
            } else if (numericGpa < requiredGpa) {
                window.rpayApp.showToast(`Minimum GPA of ${requiredGpa.toFixed(2)} required for ${scholarship}.`, 'error');
            } else {
                window.rpayApp.showToast('Application submitted successfully!', 'success');
                document.getElementById('applicationForm').reset();
                document.getElementById('applicationModal').classList.remove('active');
            }

        });


        // Download statement
        const downloadBtn = document.getElementById('downloadStatement');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadStatement());
        }

        // Settings save
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Transaction filters
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyTransactionFilters());
        }
    }

    // Navigation System
    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Update active nav button
                navBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });

                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                    this.currentTab = targetTab;
                }

                // Close mobile menu
                const navList = document.querySelector('.nav-list');
                if (navList) {
                    navList.classList.remove('active');
                }
            });
        });
    }

    // Chat System
    setupChat() {
        const chatBubble = document.getElementById('chatBubble');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');

        if (chatBubble && chatWindow) {
            chatBubble.addEventListener('click', () => {
                chatWindow.classList.add('active');
                chatWindow.setAttribute('aria-hidden', 'false');
                chatInput?.focus();
            });

            chatClose?.addEventListener('click', () => {
                chatWindow.classList.remove('active');
                chatWindow.setAttribute('aria-hidden', 'true');
            });

            const sendMessage = () => {
                const message = chatInput?.value.trim();
                if (message) {
                    this.addChatMessage(message, 'user');
                    chatInput.value = '';

                    // Simulate bot response
                    setTimeout(() => {
                        this.handleBotResponse(message);
                    }, 1000);
                }
            };

            chatSend?.addEventListener('click', sendMessage);
            chatInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            restartChat?.addEventListener('click', () => {
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.innerHTML = '';
                    this.addChatMessage('Hello! How can I assist you today?', 'bot');
                }
            });

        }
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${message}</p>`;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    handleBotResponse(userMessage) {
        const responses = {
            'fees': 'Your current outstanding fees are $2,450.00. You can view the breakdown in the School Fees section.',
            'scholarship': 'You have 2 scholarship applications under review. Check the Scholarships section for details.',
            'claim': 'You have 3 pending claims. Visit the Claims section to track their status.',
            'payment': 'You can make payments through the School Fees section or contact our finance office.',
            'help': 'I can help you with fees, scholarships, claims, payments, and account information. What would you like to know?',
            'default': 'Thank you for your message. For specific inquiries, please contact our support team at support@rp.edu.sg or call +65 6510 3000.',
            'how do i submit a claim': 'To submit a claim, go to the Claims section and fill in the required fields.',
            'gpa': 'Your GPA is used in scholarship applications. Please ensure it’s updated in your profile.',
            'bursary': 'Please visit the Scholarships & Bursary section for information on available bursaries and application procedures.'
        };

        const lowerMessage = userMessage.toLowerCase();
        let response = responses.default;

        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }

        this.addChatMessage(response, 'bot');
    }

    // Modal System
    setupModals() {
        const editBtns = document.querySelectorAll('.edit-btn');
        const modal = document.getElementById('editModal');
        const modalClose = document.getElementById('modalClose');
        const cancelEdit = document.getElementById('cancelEdit');
        const editForm = document.getElementById('editForm');

        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const field = btn.getAttribute('data-field');
                this.openEditModal(field);
            });
        });

        [modalClose, cancelEdit].forEach(btn => {
            btn?.addEventListener('click', () => {
                this.closeModal();
            });
        });

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        editForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileEdit();
        });
    }

    openEditModal(field) {
        const modal = document.getElementById('editModal');
        const editLabel = document.getElementById('editLabel');
        const editInput = document.getElementById('editInput');

        if (!modal || !editLabel || !editInput) return;

        const fieldLabels = {
            name: 'Full Name',
            studentId: 'Student ID',
            course: 'Course',
            email: 'Email Address',
            phone: 'Phone Number'
        };

        editLabel.textContent = fieldLabels[field] || field;
        editInput.value = this.studentData[field] || '';
        editInput.setAttribute('data-field', field);

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        editInput.focus();
    }

    closeModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    saveProfileEdit() {
        const editInput = document.getElementById('editInput');
        if (!editInput) return;

        const field = editInput.getAttribute('data-field');
        const value = editInput.value.trim();

        if (field && value) {
            this.studentData[field] = value;
            this.saveStudentData();
            this.loadStudentProfile();
            this.closeModal();
            this.showToast('Profile updated successfully!', 'success');
        }
    }

    // Forms Setup
    setupForms() {
        const claimForm = document.getElementById('claimForm');

        claimForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitClaim();
        });
    }

    submitClaim() {
        const formData = {
            type: document.getElementById('claimType')?.value,
            amount: document.getElementById('claimAmount')?.value,
            description: document.getElementById('claimDescription')?.value,
            receipt: document.getElementById('claimReceipt')?.files[0]
        };

        if (this.validateClaimForm(formData)) {
            // Simulate submission
            setTimeout(() => {
                this.showToast('Claim submitted successfully! You will receive an email confirmation.', 'success');
                document.getElementById('claimForm')?.reset();
            }, 1000);
        }
    }

    validateClaimForm(data) {
        if (!data.type) {
            this.showToast('Please select a claim type.', 'error');
            return false;
        }
        if (!data.amount || parseFloat(data.amount) <= 0) {
            this.showToast('Please enter a valid amount.', 'error');
            return false;
        }
        if (!data.description) {
            this.showToast('Please provide a description.', 'error');
            return false;
        }
        if (!data.receipt) {
            this.showToast('Please upload a receipt.', 'error');
            return false;
        }
        return true;
    }

    // Student Profile Management
    loadStudentProfile() {
        const fields = ['name', 'studentId', 'course', 'email', 'phone'];

        fields.forEach(field => {
            const element = document.getElementById(`display${field.charAt(0).toUpperCase() + field.slice(1)}`);
            if (element) {
                element.textContent = this.studentData[field] || '';
            }
        });

        // Load settings
        Object.entries(this.studentData.settings || {}).forEach(([key, value]) => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = value;
            }
        });
    }

    saveSettings() {
        const settings = {
            emailNotifications: document.getElementById('emailNotifications')?.checked || false,
            smsAlerts: document.getElementById('smsAlerts')?.checked || false,
            paymentReminders: document.getElementById('paymentReminders')?.checked || false
        };

        this.studentData.settings = settings;
        this.saveStudentData();
        this.showToast('Settings saved successfully!', 'success');
    }

    // Transaction Management
    loadTransactions() {
        const container = document.getElementById('transactionHistory');
        if (!container) return;

        container.innerHTML = '';

        this.transactions.forEach(transaction => {
            const transactionElement = this.createTransactionElement(transaction);
            container.appendChild(transactionElement);
        });
    }

    createTransactionElement(transaction) {
        const div = document.createElement('div');
        div.className = 'activity-item';

        const typeClass = transaction.type === 'income' ? 'income' : 'expense';
        const typeSymbol = transaction.type === 'income' ? '+' : '-';
        const amountPrefix = transaction.type === 'income' ? '+' : '-';

        div.innerHTML = `
            <span class="activity-type ${typeClass}">${typeSymbol}</span>
            <div class="activity-details">
                <p>${transaction.description}</p>
                <small>${transaction.date.toLocaleDateString()}</small>
            </div>
            <span class="activity-amount">${amountPrefix}$${transaction.amount.toFixed(2)}</span>
        `;

        return div;
    }

    applyTransactionFilters() {
        const typeFilter = document.getElementById('transactionType')?.value;
        const dateFrom = document.getElementById('dateFrom')?.value;
        const dateTo = document.getElementById('dateTo')?.value;

        let filteredTransactions = [...this.transactions];

        if (typeFilter && typeFilter !== 'all') {
            filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
        }

        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filteredTransactions = filteredTransactions.filter(t => t.date >= fromDate);
        }

        if (dateTo) {
            const toDate = new Date(dateTo);
            filteredTransactions = filteredTransactions.filter(t => t.date <= toDate);
        }

        const container = document.getElementById('transactionHistory');
        if (container) {
            container.innerHTML = '';
            filteredTransactions.forEach(transaction => {
                const transactionElement = this.createTransactionElement(transaction);
                container.appendChild(transactionElement);
            });
        }

        this.showToast(`Found ${filteredTransactions.length} transaction(s)`, 'info');
    }

    // PDF Generation
    async downloadStatement() {
        this.showToast('Preparing your statement...', 'info');

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.text('RPay Financial Statement', 20, 30);

            doc.setFontSize(12);
            doc.text(`Student: ${this.studentData.name}`, 20, 50);
            doc.text(`Student ID: ${this.studentData.studentId}`, 20, 60);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 70);

            // Fee Summary
            doc.setFontSize(16);
            doc.text('Fee Summary', 20, 90);
            doc.setFontSize(12);
            doc.text('Tuition Fee: $2,200.00', 20, 105);
            doc.text('Student Services: $150.00', 20, 115);
            doc.text('Technology Fee: $100.00', 20, 125);
            doc.text('Total Outstanding: $2,450.00', 20, 140);

            // Recent Transactions
            doc.setFontSize(16);
            doc.text('Recent Transactions', 20, 160);
            doc.setFontSize(10);

            let yPosition = 175;
            this.transactions.slice(0, 10).forEach(transaction => {
                const type = transaction.type === 'income' ? '+' : '-';
                const line = `${transaction.date.toLocaleDateString()} - ${transaction.description} - ${type}$${transaction.amount.toFixed(2)}`;
                doc.text(line, 20, yPosition);
                yPosition += 10;
            });

            doc.save(`RPay_Statement_${this.studentData.studentId}_${new Date().toISOString().split('T')[0]}.pdf`);
            this.showToast('Statement downloaded successfully!', 'success');

        } catch (error) {
            console.error('PDF generation error:', error);
            this.showToast('Error generating statement. Please try again.', 'error');
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    // Utility Methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-SG', {
            style: 'currency',
            currency: 'SGD'
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-SG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rpayApp = new RPay();

    // Add accessibility improvements
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals and chat
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal.active');
            const chat = document.querySelector('.chat-window.active');

            if (modal) {
                window.rpayApp.closeModal();
            } else if (chat) {
                chat.classList.remove('active');
                chat.setAttribute('aria-hidden', 'true');
            }
        }
    });

    // Handle focus management for better accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.active');
            if (modal) {
                const focusable = modal.querySelectorAll(focusableElements);
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });
});

// Service Worker Registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Enable dashboard summary buttons to navigate tabs
document.querySelectorAll('button[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        const tabBtn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
        tabBtn?.click();  // simulate click on nav tab
    });
});