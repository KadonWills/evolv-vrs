# Vacation Request System

A modern, responsive vacation request management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Authentication & Authorization
- Role-based login (Employee/Manager)
- JWT-based mock authentication
- Protected routes based on user role
- Persistent login state

### Employee Features
- View personal vacation requests
- Create new vacation requests
- Edit existing requests (full edit or reason-only)
- Cancel pending requests
- Real-time status updates

### Manager Features  
- View all employee vacation requests
- Filter requests by status (All, Pending, Approved, Rejected)
- Approve/reject requests with comments
- Pagination for large request lists
- Bulk actions for request management

### UI/UX Features
- Fully responsive design (Mobile, Tablet, Desktop)
- Clean, modern interface using Shadcn/ui components
- Status badges with color coding
- Toast notifications for all actions
- Loading states for async operations
- Empty states for lists with no data
- Accessible keyboard navigation
- Form validation with user feedback

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context API
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone git@github.com:KadonWills/evolv-vrs.git
cd evolv-vrs
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

The application uses mock authentication. You can log in with any of the following:

**Employee Users:**
- Email: `john@izsoftwares.com` (Password: any)

**Manager Users:**
- Email: `jane@izsoftwares.com` (Password: any)

*Note: Any password will work for demo purposes*

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (redirects to appropriate dashboard)
│   ├── login/             # Login page
│   ├── employee/          # Employee dashboard
│   └── manager/           # Manager dashboard
├── components/
│   ├── ui/                # Reusable UI components (Button, Input, etc.)
│   ├── auth/              # Authentication components
│   ├── employee/          # Employee-specific components
│   ├── manager/           # Manager-specific components
│   └── shared/            # Shared components (Header, StatusBadge, etc.)
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state management
│   └── VacationContext.tsx # Vacation requests state management
├── lib/
│   ├── mockApi.ts         # Mock API implementation
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## Key Features Detail

### Mock Data & Storage
- Uses localStorage to persist authentication and vacation data
- Simulates API delays (500-1000ms) for realistic UX
- Implements full CRUD operations with mock HTTP methods

### Validation
- Start date must be today or future
- End date must be after start date  
- Reason field requires minimum 10 characters
- Manager comments required for rejections

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface on mobile devices
- Optimized layouts for different screen sizes

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management for modals
- Semantic HTML structure
- Screen reader friendly

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
}
```

### Vacation Request
```typescript
interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComment?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Development Guidelines

- Uses TypeScript strict mode
- Follows Next.js App Router conventions
- Implements proper error boundaries
- Uses ESLint and Prettier for code formatting
- Meaningful comments for complex logic

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
