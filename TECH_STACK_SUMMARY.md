# Ecompho Tech Stack Summary

## One-Page Overview

### What Is Ecompho?
A full-stack **Virtual Try-On Platform** combining:
- **Backend**: Django + Django REST Framework (Python)
- **Frontend**: React 19 + Vite (JavaScript)
- **Database**: PostgreSQL
- **Real-time**: Redis + Django Channels
- **AI Integration**: Replicate & Gemini APIs for virtual try-on generation

**Purpose**: Users can upload photos and create AI-powered virtual clothing try-ons.

---

## Frontend Stack (What You're Building In)

### Core Framework
```
React 19.0.0
├── Vite 5.1.0 (build tool, port 5555)
├── React Router DOM 6.22.0 (routing)
└── Context API (state management)
```

### Styling & UI
```
Tailwind CSS 3.4.1
├── shadcn/ui (Radix UI + Tailwind components)
├── Lucide React 0.468.0 (icons - 468+ icons)
└── Custom CSS animations
```

### Key Libraries
```
Animations:
  ├── Framer Motion 12.23.24 (advanced animations)
  ├── canvas-confetti 1.9.4 (celebration effects)
  └── tailwindcss-animate 1.0.7 (Tailwind animations)

Communication:
  ├── Axios 1.6.7 (HTTP client with token refresh)
  └── react-hot-toast 2.6.0 (notifications)

Forms & Input:
  ├── react-dropzone 14.3.8 (file uploads)
  └── Radix UI (accessible form components)
```

### UI Component Library (shadcn/ui)
- **Alert** - Info/warning messages
- **Avatar** - User profile pictures
- **Button** - Multiple variants & sizes
- **Card** - Content containers with header/title/description
- **Dropdown Menu** - Navigation menus
- **Input** - Text input fields
- **Label** - Form labels

---

## Project Structure

```
frontend/
├── src/
│   ├── pages/           # Page components (Home, Login, Dashboard, etc.)
│   ├── components/      # Reusable components
│   │   └── ui/         # shadcn/ui components
│   ├── contexts/        # React Context (AuthContext for authentication)
│   ├── services/        # API integration (api.js, generationApi.js)
│   ├── hooks/           # Custom hooks (currently empty)
│   ├── lib/             # Utilities (utils.js with cn() function)
│   ├── assets/          # Static files
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point with Router & Toaster
│   └── index.css        # Global styles with Tailwind
├── vite.config.js       # Vite build configuration
├── tailwind.config.js   # Tailwind CSS theme config
├── components.json      # shadcn/ui settings
└── package.json         # Dependencies
```

---

## Routes (What Users See)

### Public Routes
- `/` → **Home** (current page you're improving)
- `/login` → Login page
- `/register` → Registration page

### Protected Routes (requires login)
- `/dashboard` → User dashboard
- `/profile` → User profile & settings
- `/generate` → Create new virtual try-on
- `/generation/:id` → View try-on result
- `/gallery` → View all user's try-ons

---

## Colors & Theme

### Primary Colors (Light Mode)
- **Background**: Pure white
- **Foreground**: Dark blue-gray (text)
- **Primary**: Bright blue (#3B82F6)
- **Border**: Light gray
- **Accent**: Light gray

### Dark Mode
- **Background**: Dark blue-gray
- **Foreground**: Off-white (text)
- **Primary**: Light blue
- **Secondary**: Very dark
- **Border**: Dark gray

### Special Effects
- **Gradients**: Purple→Violet, Green, Blue, Multi-color animated
- **Shadows**: Glow effects with blue/green tints
- **Animations**: Gradient shift (15s), shimmer loading effect

---

## Key Patterns to Use

### Authentication
```jsx
import { useAuth } from '@/contexts/AuthContext'
const { isAuthenticated, user, logout } = useAuth()
```

### Components
```jsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
```

### Styling
```jsx
className="container mx-auto px-4"    // Responsive container
className="grid md:grid-cols-3 gap-6" // Responsive grid
className="text-primary"              // Blue text
className="bg-primary/10"             // Light blue background
```

### Animations
```jsx
import { motion } from 'framer-motion'
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
```

### API Calls
```jsx
import api from '@/services/api'
const data = await api.get('/endpoint')
```

---

## Current Homepage

**Location**: `/frontend/src/pages/Home.jsx`

**Current Content**:
- Welcome heading with "ecompho" brand
- Description: "A modern Django + React application..."
- Auth-based buttons (Register/Login or Dashboard)
- Three feature cards about the tech stack

**Your Task**: Enhance/replace this with a more compelling homepage that:
- Showcases the virtual try-on capability
- Highlights key benefits
- Includes impressive visuals/animations
- Maintains consistent design language
- Integrates seamlessly with existing auth system

---

## Development Workflow

```bash
# Start development server (port 5555)
npm run dev

# Build for production
npm run build

# Check code quality
npm run lint

# Preview built version
npm run preview
```

---

## Key Files to Examine

**Essential Reading**:
1. `App.jsx` - Route structure
2. `components/Navbar.jsx` - Navigation pattern
3. `pages/Home.jsx` - Current homepage
4. `index.css` - Styling setup
5. `contexts/AuthContext.jsx` - Auth system

**Reference Examples**:
- `Gallery.jsx` - Complex component with filtering
- `CreateGeneration.jsx` - Form handling
- `components/ui/button.jsx` - Component pattern

---

## Typography & Spacing

### Text Sizes
- Heading 1: `text-5xl md:text-6xl`
- Heading 2: `text-3xl`
- Body: `text-base`
- Small: `text-sm`

### Spacing
- Sections: `py-20`, `py-16`
- Cards gap: `gap-6`
- Internal: `space-y-6`, `p-6`
- Container: `mx-auto px-4`

### Responsive
- Mobile: default classes
- Tablet (768px+): `md:` prefix
- Desktop (1024px+): `lg:` prefix
- Large (1536px+): `2xl:` prefix

---

## What Makes It Special

1. **Modern React**: Latest React 19 with Vite for fast builds
2. **Beautiful UI**: shadcn/ui + Tailwind for consistent design
3. **Smooth Animations**: Framer Motion for polished feel
4. **Authentication**: JWT-based secure auth with token refresh
5. **API Integration**: Axios with automatic token handling
6. **Responsive Design**: Mobile-first, works on all devices
7. **Dark Mode Ready**: Theme system supports light/dark modes
8. **AI-Powered**: Integrates with cutting-edge AI APIs

---

## Common Tasks

### Add a New Page
1. Create `/src/pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add route: `<Route path="/new" element={<NewPage />} />`

### Add a New Component
1. Create `/src/components/NewComponent.jsx`
2. Export component
3. Import and use in pages

### Modify Colors
- Edit `:root` or `.dark` in `/src/index.css`
- Or modify `tailwind.config.js` for theme variables

### Add Icons
- Browse: [lucide.dev](https://lucide.dev)
- Import and use: `<Sparkles className="h-6 w-6" />`

### Animate Elements
- Import Framer Motion: `import { motion } from 'framer-motion'`
- Wrap elements: `<motion.div initial={{}} animate={{}}>`
- Configure with variants and transitions

---

## Quick Stats

- **Total Dependencies**: 17 main + 24 dev
- **Component Files**: 24 total (7 UI, 1 custom, 16 pages/contexts)
- **Lines of Configuration**: ~200 (vite, tailwind, eslint)
- **Setup Time**: Fully configured, ready to build
- **Build Performance**: Vite produces optimized bundles in seconds

---

## What You Need to Know

1. **Everything is in React**: No mixed frameworks - pure React
2. **CSS is Tailwind**: No CSS files needed, use utility classes
3. **Components are Pre-built**: shadcn/ui does the heavy lifting
4. **Auth is Already Done**: Use `useAuth()` hook anywhere
5. **API is Pre-configured**: Axios handles all the hard stuff
6. **Routing Works Out of Box**: Just add new routes to `App.jsx`

---

## Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **shadcn/ui Docs**: https://ui.shadcn.com
- **Framer Motion Docs**: https://www.framer.com/motion/
- **React Router Docs**: https://reactrouter.com
- **Lucide Icons**: https://lucide.dev

---

That's the complete tech stack! You have everything needed to build an amazing homepage.
