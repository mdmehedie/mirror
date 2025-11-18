# Ecompho Homepage Build Guide

## Project Overview

Ecompho is a **Django + React Virtual Try-On Platform** designed for AI-powered virtual clothing try-on generation. This guide provides comprehensive information for building a new homepage that integrates perfectly with the existing tech stack.

---

## 1. Technology Stack

### Framework & Build Tool
- **Frontend Framework**: React 19 (Latest)
- **Build Tool**: Vite 5.1.0 (Modern, fast bundler)
- **Development Port**: http://localhost:5555
- **API Port**: http://localhost:8000/api

### Styling & UI
- **CSS Framework**: Tailwind CSS 3.4.1
- **UI Component Library**: shadcn/ui (Radix UI + Tailwind)
- **Icon Library**: Lucide React 0.468.0
- **CSS-in-JS**: Class Variance Authority (CVA) for component variants
- **Utility**: Tailwind Merge + clsx for className management

### Animations & Motion
- **Animation Library**: Framer Motion 12.23.24
- **Confetti Effects**: canvas-confetti 1.9.4
- **Toast Notifications**: react-hot-toast 2.6.0

### Routing & State
- **Router**: React Router DOM 6.22.0
- **State Management**: React Context API (AuthContext)
- **HTTP Client**: Axios 1.6.7 (with token refresh interceptors)

### File Upload
- **File Upload**: react-dropzone 14.3.8

### UI Components Used
- Radix UI Avatar
- Radix UI Dialog
- Radix UI Dropdown Menu
- Radix UI Label
- Radix UI Separator
- Radix UI Toast

---

## 2. Current Homepage Location & Status

**Current Location**: `/Users/nafew/Documents/Web Projects/Ecompho/frontend/src/pages/Home.jsx`

**Current Implementation**: Basic placeholder with:
- Welcome heading with "ecompho" branding
- Description text
- Auth-conditional buttons (Get Started/Login for guests, Dashboard link for logged-in users)
- Three feature cards (Django Backend, React Frontend, Ready to Use)

**Purpose of Homepage**:
- Landing page for unauthenticated users (route: `/`)
- Welcome message for authenticated users
- Entry point to register/login or access dashboard

---

## 3. Theme & Color Scheme

### Color System (CSS Variables in HSL format)

**Light Mode** (`:root`):
```css
--background: 0 0% 100%;           /* Pure white */
--foreground: 222.2 84% 4.9%;      /* Dark blue-gray */
--primary: 221.2 83.2% 53.3%;      /* Bright blue */
--primary-foreground: 210 40% 98%; /* Off-white */
--secondary: 210 40% 96.1%;        /* Light gray */
--secondary-foreground: 222.2 47.4% 11.2%; /* Dark text */
--muted: 210 40% 96.1%;            /* Light gray */
--muted-foreground: 215.4 16.3% 46.9%; /* Medium gray text */
--accent: 210 40% 96.1%;           /* Light gray */
--accent-foreground: 222.2 47.4% 11.2%; /* Dark text */
--destructive: 0 84.2% 60.2%;      /* Red */
--destructive-foreground: 210 40% 98%; /* Off-white */
--border: 214.3 31.8% 91.4%;       /* Light gray border */
--input: 214.3 31.8% 91.4%;        /* Light gray input */
--ring: 221.2 83.2% 53.3%;         /* Blue (focus ring) */
--radius: 0.5rem;                  /* Border radius: 8px */
```

**Dark Mode** (`.dark` class):
```css
--background: 222.2 84% 4.9%;      /* Dark blue-gray */
--foreground: 210 40% 98%;         /* Off-white */
--primary: 217.2 91.2% 59.8%;      /* Lighter blue */
--primary-foreground: 222.2 47.4% 11.2%; /* Dark text */
--secondary: 217.2 32.6% 17.5%;    /* Dark card */
--secondary-foreground: 210 40% 98%; /* Off-white */
--destructive: 0 62.8% 30.6%;      /* Dark red */
--border: 217.2 32.6% 17.5%;       /* Dark border */
--input: 217.2 32.6% 17.5%;        /* Dark input */
--ring: 224.3 76.3% 48%;           /* Bright blue ring */
```

### Custom Gradients (in index.css)

**Primary Gradient**:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Purple to violet */
```

**Success Gradient**:
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
/* Green gradient */
```

**Blue Gradient**:
```css
background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
/* Light to dark blue */
```

**Animated Gradient**:
```css
background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
/* Multi-color gradient with animation */
animation: gradientShift 15s ease infinite;
```

### Border Radius
- Default: `0.5rem` (8px)
- Variants:
  - `lg`: `var(--radius)` (8px)
  - `md`: `calc(var(--radius) - 2px)` (6px)
  - `sm`: `calc(var(--radius) - 4px)` (4px)

### Shadow Effects
- **Glow Shadow**: `box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);`
- **Success Glow**: `box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);`

### Typography
- **Font Family**: System fonts (Apple System, Segoe UI, Roboto, etc.)
- **Font Smoothing**: Antialiased

---

## 4. Installed UI Libraries & Components

### Component Library: shadcn/ui
Located in `/frontend/src/components/ui/`:

#### Available Components:
1. **Alert** - `alert.jsx`
   - Display important messages
   - Variants: default, destructive
   
2. **Avatar** - `avatar.jsx`
   - User profile pictures
   - Radix UI based
   
3. **Button** - `button.jsx`
   - Variants: default, destructive, outline, secondary, ghost, link
   - Sizes: default, sm, lg, icon
   - CVA-based variants
   
4. **Card** - `card.jsx`
   - Sections: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
   - Used for content containers
   
5. **Dropdown Menu** - `dropdown-menu.jsx`
   - Radix UI dropdown with menu items
   - Used for user profile menu in navbar
   
6. **Input** - `input.jsx`
   - Form text input field
   
7. **Label** - `label.jsx`
   - Form labels
   - Radix UI based

### Icon Library: Lucide React
- 468+ icons available
- Examples used: Code2, Rocket, Shield, Sparkles, Image, User, LogOut, etc.
- Usage: `import { IconName } from 'lucide-react'`

### Custom Components:
1. **Navbar.jsx** - Main navigation
2. **ProtectedRoute.jsx** - Route protection wrapper
3. **ImageUpload.jsx** - File upload component with dropzone

---

## 5. Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── alert.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── input.jsx
│   │   │   └── label.jsx
│   │   ├── ImageUpload.jsx        # File upload component
│   │   ├── Navbar.jsx             # Navigation component
│   │   └── ProtectedRoute.jsx     # Route protection
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx        # Authentication state (login, register, logout, user)
│   │
│   ├── pages/                     # Page components
│   │   ├── Home.jsx               # Homepage (route: /)
│   │   ├── Login.jsx              # Login page (route: /login)
│   │   ├── Register.jsx           # Registration (route: /register)
│   │   ├── Dashboard.jsx          # User dashboard (protected)
│   │   ├── Profile.jsx            # User profile (protected)
│   │   ├── CreateGeneration.jsx   # Create try-on (protected)
│   │   ├── GenerationResult.jsx   # Try-on result (protected)
│   │   └── Gallery.jsx            # User's try-ons (protected)
│   │
│   ├── services/
│   │   ├── api.js                 # Axios instance with interceptors
│   │   └── generationApi.js       # API calls for try-on generation
│   │
│   ├── hooks/                     # Custom hooks (currently empty)
│   │
│   ├── lib/
│   │   └── utils.js               # Utility function: cn() for className merging
│   │
│   ├── utils/                     # Additional utilities (if any)
│   │
│   ├── assets/                    # Static assets
│   │
│   ├── App.jsx                    # Main app with routes
│   ├── main.jsx                   # React entry point with Router & Toaster
│   └── index.css                  # Global styles with Tailwind directives
│
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration with API proxy
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── components.json                # shadcn/ui configuration
└── .eslintrc.cjs                  # ESLint configuration
```

---

## 6. Routing System

**Client-Side Router**: React Router DOM v6

**Routes Configuration** (in `App.jsx`):

### Public Routes:
- `/` → Home.jsx (homepage)
- `/login` → Login.jsx
- `/register` → Register.jsx
- `*` → Redirects to `/` (catch-all)

### Protected Routes (requires authentication):
- `/dashboard` → Dashboard.jsx
- `/profile` → Profile.jsx
- `/generate` → CreateGeneration.jsx (Create try-on)
- `/generation/:id` → GenerationResult.jsx (View result)
- `/gallery` → Gallery.jsx (View user's try-ons)

**Route Protection**: 
- ProtectedRoute wrapper checks `isAuthenticated` from AuthContext
- Redirects to login if not authenticated

**Navigation Pattern**:
- Uses `<Link>` components from react-router-dom
- Uses `useNavigate()` hook for programmatic navigation

---

## 7. Design Patterns & Components

### Button Patterns:
```jsx
// Default button
<Button>Click me</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="lg">Large</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon /></Button>

// With icon
<Button><Sparkles className="mr-2 h-4 w-4" />Create</Button>
```

### Card Patterns:
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Layout Patterns:
- Container with max-width: `<div className="container mx-auto px-4">`
- Grid layouts: `<div className="grid md:grid-cols-3 gap-6">`
- Flexbox: `<div className="flex justify-between items-center">`
- Spacing utilities: `space-y-4`, `gap-6`, `mb-16`

### Animation Patterns:
- **Framer Motion** for advanced animations
- **Tailwind animations** for standard transitions
- **Custom keyframes** defined in index.css

### Authentication Pattern:
```jsx
const { isAuthenticated, user, login, logout } = useAuth()

// Conditional rendering based on auth state
{isAuthenticated ? (
  <Dashboard />
) : (
  <LoginPrompt />
)}
```

---

## 8. Navbar Component Structure

**Path**: `/frontend/src/components/Navbar.jsx`

### Features:
- Responsive navigation bar
- Logo/brand link to home
- Conditional rendering:
  - **Unauthenticated**: Login & Register buttons
  - **Authenticated**: Dashboard, Gallery, Create Try-On, User dropdown menu

### User Dropdown Menu:
- Display user info (username, email)
- Links: Dashboard, Profile, Settings
- Logout action
- Uses Radix UI DropdownMenu

### Styling:
- Border-bottom separator
- Flexbox layout for horizontal alignment
- Icon integration from lucide-react

---

## 9. Existing Animation Libraries & Effects

### Framer Motion (v12.23.24)
Used in Gallery.jsx for:
- `motion` - Wrapper for animated elements
- `AnimatePresence` - Handle mount/unmount animations
- Variants for coordinated animations

### Custom Animations (index.css):
1. **gradientShift** - 15-second infinite gradient animation
2. **shimmer** - Loading skeleton shimmer effect

### Toast Notifications (react-hot-toast)
```jsx
import toast from 'react-hot-toast'

// Success
toast.success('Done!')

// Error
toast.error('Something went wrong')

// Custom styling configured in main.jsx
```

### Confetti (canvas-confetti)
Available for celebration moments

---

## 10. API Integration Pattern

**API Setup**: `/frontend/src/services/api.js`

### Axios Instance Features:
1. **Base URL**: Configured from env variable or defaults to `http://localhost:8000/api`
2. **Request Interceptor**: Automatically adds JWT token to Authorization header
3. **Response Interceptor**: 
   - Handles 401 errors (token expired)
   - Auto-refreshes token using refresh endpoint
   - Retries failed requests with new token
   - Redirects to login if refresh fails

### Making API Calls:
```jsx
import api from '@/services/api'

// GET request
const data = await api.get('/endpoint')

// POST request
const response = await api.post('/endpoint', payload)

// PATCH/PUT request
const updated = await api.patch('/endpoint', data)
```

### Error Handling:
```jsx
try {
  const data = await api.get('/endpoint')
} catch (err) {
  const errorMsg = err.response?.data?.detail || 'Error occurred'
}
```

---

## 11. Key Files to Reference When Building Homepage

### Must Read:
1. **App.jsx** - Route structure and overall app layout
2. **Navbar.jsx** - Navigation pattern and component usage
3. **Home.jsx** - Current homepage implementation
4. **index.css** - Custom utilities and animations
5. **tailwind.config.js** - Color variables and theme config
6. **package.json** - Available dependencies

### Component Examples:
- Gallery.jsx - Complex state management with filtering
- CreateGeneration.jsx - Form handling and file uploads
- Login.jsx & Register.jsx - Authentication flows

---

## 12. Commands & Development

### Development Server:
```bash
cd frontend
npm run dev  # Starts Vite dev server on port 5555
```

### Build for Production:
```bash
npm run build  # Creates optimized build
```

### Linting:
```bash
npm run lint  # Check for code issues
```

### Preview Production Build:
```bash
npm run preview
```

---

## 13. Environment Variables

**Location**: `/frontend/.env`

Example setup:
```
VITE_API_URL=http://localhost:8000/api
```

---

## 14. Key Utilities

### cn() Function (utils.js):
Merges Tailwind classes with clsx and twMerge for proper precedence.

```jsx
import { cn } from '@/lib/utils'

<div className={cn('p-4', condition && 'bg-red-500')}>
```

---

## 15. Tips for Building the Homepage

### Best Practices:
1. Use existing shadcn/ui components for consistency
2. Leverage Tailwind CSS classes for styling
3. Use the color system via CSS variables (var(--primary), etc.)
4. Import icons from lucide-react
5. Use Framer Motion for sophisticated animations
6. Keep authentication state in mind (use useAuth hook)
7. Follow the existing component structure and patterns

### Component Integration:
- All pages use the Navbar (imported in App.jsx)
- All pages wrap in container with padding
- Use Card components for content sections
- Use Button variants appropriately
- Add proper spacing with Tailwind utilities

### Performance:
- Vite handles code-splitting automatically
- Use React.lazy() for route-based splitting if needed
- Framer Motion animations are hardware-accelerated
- Lucide icons are tree-shakeable

---

## Summary

**Tech Stack Overview**:
- React 19 + Vite for modern frontend development
- Tailwind CSS + shadcn/ui for consistent, accessible UI
- Framer Motion for animations
- React Router for client-side routing
- Axios with JWT authentication
- Context API for state management

**Homepage Should**:
- Match existing color scheme and design language
- Use shadcn/ui components
- Integrate with authentication context
- Follow routing conventions
- Support responsive design
- Use custom animations from Framer Motion where appropriate

**File Locations**:
- New homepage: `/frontend/src/pages/Home.jsx`
- Components: `/frontend/src/components/`
- Utilities: `/frontend/src/lib/utils.js`
- Global styles: `/frontend/src/index.css`
- Configuration: `/frontend/tailwind.config.js`

