# RPay Financial Admin

A secure, all-in-one RP student financial management system for tracking school fees, scholarships, claims, transactions, and personal profile settings.

## 🎯 Project Overview

**One-Line Pitch:** A secure, all-in-one RP student financial management system for tracking school fees, scholarships, claims, transactions, and personal profile settings.

**Why It Matters:** RPay helps Republic Polytechnic students stay on top of their financial status. With live dashboards, editable profiles, integrated bursary and aid applications, and downloadable statements, the platform ensures full control and transparency over student finance.

## 🎨 Design Features

### Color Palette
- **Republic Green:** #1E8449
- **RP Red:** #E53935  
- **Deep Navy:** #1A237E
- **White:** #FFFFFF
- **Light Gray:** #F7F9FC

### UX/UI Design Principles
- Card-based dashboard for fee summary, aid awarded, pending claims
- Floating chat bubble at bottom-right for live support or chatbot interaction
- Editable student profile page with fields like name, student ID, course, email
- Scholarship section includes available scholarships + applicable bursary programs
- Clear buttons for actions like "Submit Claim", "Apply Now", "Download Statement"
- Toast notifications for user actions like form submission or file download
- Mobile-first, accessible navigation with screen reader support and keyboard accessibility

## ⚙️ Features

### Navigation System
- SPA-style tabbed navigation (Dashboard, School Fees, Claims, Scholarships, Transactions, Profile)
- Show/hide sections dynamically without reloading
- Mobile-responsive navigation with hamburger menu

### Dashboard
- Financial summary cards showing outstanding fees, aid awarded, and pending claims
- Recent activity feed with color-coded income/expense transactions
- Quick action buttons for common tasks

### School Fees Management
- Detailed fee breakdown (tuition, services, technology fees)
- Payment history tracking
- Downloadable PDF statements using jsPDF

### Claims System
- Submit new claims with form validation
- Upload receipt functionality
- Track pending and approved claims
- Support for multiple claim types (medical, transport, textbook, equipment)

### Scholarships & Bursaries
- Browse available scholarships and bursaries
- Track application status
- Apply for new opportunities

### Transaction History
- Complete transaction listing with filtering
- Filter by type (income/expense) and date range
- Color-coded transaction types

### Profile Management
- Editable student information (name, ID, course, email, phone)
- Account settings for notifications
- Modal-based editing system

### Chat Support
- Floating chat bubble for easy access
- Interactive chatbot with contextual responses
- Support for common queries about fees, scholarships, and claims

## 🛠️ Technical Implementation

### Technologies Used
- **Frontend:** HTML5, CSS3 (Custom Grid/Flexbox), Vanilla JavaScript
- **PDF Generation:** jsPDF library
- **Storage:** LocalStorage for prototype data persistence
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support

### File Structure
```
├── index.html              # Main HTML structure
├── css/
│   └── styles.css          # Complete responsive styling
├── js/
│   └── app.js              # Full application logic
├── logo/
│   └── RP Logo.png         # Republic Polytechnic logo
├── .vscode/
│   └── settings.json       # VS Code configuration
├── .gitignore              # Git ignore rules
└── README.md               # This documentation
```

### JavaScript Architecture
- **Class-based architecture** with RPay main class
- **Event-driven programming** for user interactions
- **Modular design** with separate methods for different features
- **Data persistence** using localStorage
- **Form validation** with user feedback
- **Toast notification system** for user actions
- **Responsive design** with mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended)

### Installation
1. Clone or download the repository
2. Open the project folder in VS Code
3. Install the Live Server extension if not already installed
4. Right-click on `index.html` and select "Open with Live Server"
5. The application will open in your default browser

### Usage
1. **Dashboard:** View financial summary and recent activity
2. **School Fees:** Check fee breakdown and download statements
3. **Claims:** Submit new claims and track existing ones
4. **Scholarships:** Browse and apply for financial aid
5. **Transactions:** Filter and view transaction history
6. **Profile:** Edit personal information and settings
7. **Chat:** Use the floating chat bubble for support

## 🔧 Development

### Running Locally
```bash
# Using VS Code Live Server (recommended)
1. Open project in VS Code
2. Right-click index.html
3. Select "Open with Live Server"

# Alternative: Using Python (if available)
python -m http.server 8000

# Alternative: Using Node.js (if available)
npx http-server
```

### Git Setup
```bash
git init
git add .
git commit -m "Initial commit – Full RP Student Financial Admin System"
```

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop:** Full-featured experience with multi-column layouts
- **Tablet:** Optimized card layouts and touch-friendly interactions
- **Mobile:** Single-column layout with mobile navigation menu

## ♿ Accessibility Features

- **Keyboard Navigation:** Full keyboard support for all interactions
- **Screen Reader Support:** Proper ARIA labels and semantic HTML
- **Focus Management:** Clear focus indicators and logical tab order
- **High Contrast Support:** Respects user's contrast preferences
- **Reduced Motion:** Honors user's motion preferences

## 🔒 Security Considerations

- Client-side data storage (localStorage) for prototype
- Form validation to prevent invalid submissions
- No sensitive data transmitted (prototype environment)
- XSS prevention through proper DOM manipulation

## 🎯 Future Enhancements

- Backend integration with actual RP systems
- Real-time notifications
- Payment processing integration
- Advanced reporting and analytics
- Mobile app development
- Multi-language support

## 📄 License

This project is developed for Republic Polytechnic and follows institutional guidelines.

## 👥 Support

For technical support or questions:
- Email: support@rp.edu.sg
- Phone: +65 6510 3000
- Chat: Use the in-app chat feature

---

**Built with ❤️ for Republic Polytechnic Students**