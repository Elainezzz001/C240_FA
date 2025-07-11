# RPay Financial Admin

A secure, all-in-one RP student financial management system for tracking school fees, scholarships, claims, transactions, and personal profile settings.

## 🎯 Project Overview

RPay helps Republic Polytechnic students stay on top of their financial status with live dashboards, editable profiles, integrated bursary and aid applications, and downloadable statements, ensuring full control and transparency over student finance.

## 🎨 Design System

### Color Palette
- **Republic Green**: `#1E8449` - Primary brand color
- **RP Red**: `#E53935` - Accent and alert color  
- **Deep Navy**: `#1A237E` - Headers and important text
- **White**: `#FFFFFF` - Background and clean surfaces
- **Light Gray**: `#F7F9FC` - Page background and subtle elements

### UI Components
- Card-based dashboard for fee summary, aid awarded, pending claims
- Floating chat bubble at bottom-right for live support or chatbot interaction
- Editable student profile page with fields like name, student ID, course, email
- Clear buttons for actions like "Submit Claim", "Apply Now", "Download Statement"
- Toast notifications for user actions like form submission or file download
- Mobile-first, accessible navigation with screen reader support

## ⚡ Features

### Dashboard
- **Financial Overview**: Quick summary cards showing fees, claims, scholarships, and balance
- **Recent Transactions**: Latest financial activity with color-coded income/expense
- **Quick Actions**: Fast access to common tasks like submitting claims

### School Fees Management
- **Fee Breakdown**: Detailed breakdown of tuition, services, and other fees
- **Payment History**: Complete record of all fee payments
- **Payment Status**: Real-time status of current semester fees

### Claims System
- **Submit Claims**: Easy form for medical, transportation, and equipment claims
- **Track Status**: Monitor claim progress (pending, approved, rejected)
- **Upload Receipts**: File attachment support for claim documentation

### Scholarships & Bursaries
- **Active Awards**: View current scholarships and their values
- **Available Opportunities**: Browse and apply for new financial aid
- **Application Tracking**: Monitor scholarship application status

### Transaction History
- **Complete Record**: All financial transactions in chronological order
- **Filter Options**: Filter by income, expenses, or view all
- **Export Capability**: Download transaction statements

### Profile Management
- **Editable Information**: Update personal details, contact info, and address
- **Student Details**: View student ID, course information, and academic details
- **Security**: Secure profile updates with validation

### Interactive Features
- **Live Chat**: Floating chat bubble with financial support bot
- **PDF Generation**: Download comprehensive financial statements
- **Form Validation**: Real-time validation for all user inputs
- **Local Storage**: Persist data across browser sessions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "Financial Admin Chatbot"
   ```

2. **Open in VS Code:**
   ```bash
   code .
   ```

3. **Start Live Server:**
   - Install the Live Server extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - The site will open at `http://localhost:3000`

### Project Structure
```
RPay Financial Admin/
├── index.html              # Main HTML file with all page sections
├── css/
│   └── styles.css          # Comprehensive styling with RP color scheme
├── js/
│   └── app.js              # JavaScript functionality and interactivity
├── logo/
│   └── RP Logo.png         # Republic Polytechnic logo
├── .vscode/
│   └── settings.json       # VS Code configuration for Live Server
└── .gitignore             # Git ignore patterns
```

## 🔧 Technical Implementation

### JavaScript Features
- **SPA Navigation**: Single-page application with tabbed navigation
- **Dynamic Content**: Show/hide sections without page reloads
- **Form Validation**: Client-side validation for claims, applications, and profile updates
- **Modal System**: Edit profile with overlay modal
- **PDF Generation**: Uses jsPDF library for statement downloads
- **Local Storage**: Data persistence for prototype demonstration
- **Chat System**: Interactive floating chat with bot responses

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with responsive breakpoints
- **Flexible Grid**: CSS Grid and Flexbox for adaptive layouts
- **Touch-Friendly**: Large tap targets and intuitive mobile navigation
- **Accessibility**: Keyboard navigation, screen reader support, high contrast support

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Usage Guide

### Navigation
- Use the top navigation bar to switch between different sections
- Keyboard shortcuts: `Ctrl + 1-6` for quick tab switching
- Click the RP logo to return to dashboard

### Submitting Claims
1. Navigate to the "Claims" tab
2. Fill out the claim form with type, amount, and description
3. Upload a receipt (PDF, JPG, PNG supported)
4. Click "Submit Claim" to process

### Managing Profile
1. Go to the "Profile" tab
2. Click "Edit Profile" button
3. Update your information in the modal
4. Save changes to update your profile

### Using Chat Support
1. Click the floating chat bubble (bottom-right)
2. Type your financial questions
3. Get instant responses about fees, claims, scholarships, and balances
4. Chat provides contextual help and contact information

### Downloading Statements
1. Click "Download Statement" on the dashboard
2. A PDF will be generated with your financial summary
3. Includes recent transactions, account summary, and student details

## 🔒 Security & Privacy

- All data is stored locally in your browser
- No sensitive information is transmitted to external servers
- Profile updates require form validation
- Secure file upload handling for claim receipts

## 🛠 Development

### Code Structure
- **Modular CSS**: Organized by component with CSS custom properties
- **ES6 JavaScript**: Modern JavaScript with proper error handling
- **Semantic HTML**: Accessible markup with proper ARIA labels
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Customization
- Update color scheme in CSS custom properties (`:root`)
- Modify navigation tabs in the HTML nav section
- Add new transaction types in the JavaScript data arrays
- Extend chat bot responses in the `getBotResponse()` function

## 📧 Support

For technical support or questions about the RPay Financial Admin system:
- **Email**: finance@rp.edu.sg
- **Phone**: +65 6510 3000
- **In-App Chat**: Use the floating chat bubble for instant help

## 📄 License

This project is developed for Republic Polytechnic students and is intended for educational and administrative use.

---

**RPay Financial Admin** - Empowering RP students with transparent, accessible financial management.
