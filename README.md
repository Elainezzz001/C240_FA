# RPay Admin - Republic Polytechnic Student Financial Portal

## Overview
RPay Admin is a centralized portal for RP students to manage fees, scholarships, and transactions securely and efficiently. The platform simplifies student financial administration tasks by consolidating key information into one comprehensive dashboard.

## Features

### 🎯 Core Functionality
- **Dashboard Overview**: Quick view of outstanding fees, scholarship status, and recent transactions
- **Payment Management**: Track and manage tuition fees, lab equipment costs, and other payments
- **Scholarship Applications**: Apply for financial aid, bursaries, and academic excellence awards
- **Transaction History**: Comprehensive view of all financial activities with search and filtering
- **Profile Management**: Student information and notification preferences

### 🎨 Design Features
- **RP Branding**: Aligned with Republic Polytechnic's color palette (reds, grays, whites)
- **Responsive Design**: Mobile-friendly layout for access on any device
- **Accessibility**: Full keyboard navigation and screen reader support
- **Modern UI**: Clean, professional interface with smooth animations

### ⚡ Technical Features
- **Single Page Application**: Tabbed navigation without page reloads
- **Dynamic Sorting**: Sortable transaction tables with filtering capabilities
- **Form Validation**: Client-side validation with helpful error messages
- **Local Storage**: Persistent state for recent actions and preferences
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## Project Structure

```
RPay Admin/
├── index.html              # Main HTML file with complete portal structure
├── css/
│   └── styles.css          # Complete styling with RP branding
├── js/
│   └── app.js              # Interactive functionality and SPA behavior
├── logo/
│   └── RP Logo.png         # Republic Polytechnic logo
├── .vscode/
│   └── settings.json       # VS Code configuration for Live Server
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended for development)

### Installation
1. Clone or download this repository
2. Open the project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. The portal will open automatically in your default browser at `http://localhost:5500`

### Alternative Setup
You can also run this project using any local web server:
```bash
# Using Python 3
python -m http.server 5500

# Using Node.js (if you have http-server installed)
npx http-server -p 5500

# Using PHP
php -S localhost:5500
```

## Usage Guide

### Navigation
- Use the main navigation tabs to switch between sections
- All navigation is keyboard accessible (Tab, Arrow keys, Enter)
- Mobile users can tap the hamburger menu (☰) to access navigation

### Dashboard
- View outstanding fees and payment status
- Check scholarship approvals and amounts
- Access quick actions for common tasks

### Payments
- Review outstanding payments with due dates
- View payment history with download options
- Make payments through integrated payment buttons

### Scholarships
- Check current scholarship status
- Apply for new financial aid opportunities
- Submit bursary and excellence award applications

### Transactions
- Search and filter transaction history
- Sort by date, amount, or transaction type
- Download receipts for completed transactions

### Profile
- View student information
- Manage notification preferences
- Update personal settings

## Development

### Color Palette
The project uses Republic Polytechnic's official branding:
- **Primary Red**: `#e31d23`
- **Dark Red**: `#c41e3a`
- **Light Red**: `#ff4757`
- **Dark Gray**: `#2c3e50`
- **Medium Gray**: `#6c757d`
- **Light Gray**: `#f8f9fa`
- **White**: `#ffffff`

### JavaScript Architecture
- **Modular Design**: Separated concerns for navigation, forms, and data management
- **Event-Driven**: Uses modern event listeners and delegation
- **Accessible**: Includes ARIA labels and keyboard navigation
- **Responsive**: Adapts to different screen sizes and input methods

### CSS Architecture
- **CSS Custom Properties**: Centralized theme variables
- **Mobile-First**: Responsive design with progressive enhancement
- **Accessibility**: High contrast support and reduced motion preferences
- **Print Styles**: Optimized for printing receipts and documents

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features
- Full keyboard navigation
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences
- ARIA labels and landmarks
- Focus management for modals

## Security Considerations
- Input validation on all forms
- XSS prevention through proper sanitization
- HTTPS ready (use HTTPS in production)
- No sensitive data in localStorage
- Content Security Policy headers recommended

## Performance
- Optimized images and assets
- Minimal JavaScript bundle
- CSS Grid and Flexbox for efficient layouts
- Lazy loading for modal content
- Local storage for state persistence

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers and devices
5. Submit a pull request

## License
This project is created for Republic Polytechnic students and is intended for educational and administrative purposes.

## Support
For technical issues or feature requests, please contact the RP IT Support team or submit an issue through the appropriate channels.

---

**Built with ❤️ for Republic Polytechnic Students**
