# Quick Start: Building a Homepage for Ecompho

## The Essentials (Copy-Paste Ready)

### 1. Basic Homepage Template Structure

```jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Icon1, Icon2 } from "lucide-react"

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center space-y-6">
        <motion.h1
          className="text-5xl md:text-6xl font-bold tracking-tight"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          Welcome to <span className="text-primary">ecompho</span>
        </motion.h1>
        
        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your description here
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/generate">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Create Try-On
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Login
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Icon1 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Feature 1</CardTitle>
              <CardDescription>Description</CardDescription>
            </CardHeader>
          </Card>
          {/* More cards... */}
        </div>
      </section>
    </div>
  )
}

export default Home
```

### 2. Color System Quick Reference

```jsx
// Light colors
className="text-primary"           // Blue
className="text-secondary"         // Light Gray
className="text-muted-foreground"  // Medium Gray
className="bg-primary/10"          // Light blue background
className="border border-border"   // Light gray border

// Dark colors
className="dark:text-primary"      // Light blue in dark mode
className="dark:bg-secondary"      // Dark card background

// Gradients
className="gradient-primary"       // Purple to violet
className="gradient-success"       // Green
className="gradient-blue"          // Blue gradient
className="gradient-animated"      // Animated multi-color
```

### 3. Button Patterns

```jsx
// Primary action
<Button size="lg">Primary Action</Button>

// Secondary action
<Button size="lg" variant="outline">Secondary</Button>

// Ghost/subtle
<Button variant="ghost">Subtle</Button>

// With icon
<Button>
  <Sparkles className="mr-2 h-4 w-4" />
  Create Try-On
</Button>

// Icon only
<Button size="icon"><Icon /></Button>
```

### 4. Card Pattern

```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### 5. Layout Patterns

```jsx
// Container with padding
<div className="container mx-auto px-4">

// Grid (responsive)
<div className="grid md:grid-cols-3 gap-6">

// Flexbox centered
<div className="flex justify-center items-center">

// Vertical spacing
<div className="space-y-6">

// Full-screen section
<section className="min-h-screen py-20">
```

### 6. Animation Examples

```jsx
import { motion } from 'framer-motion'

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Staggered animation
{items.map((item, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: i * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

### 7. Notifications

```jsx
import toast from 'react-hot-toast'

// Success
toast.success('Created successfully!')

// Error
toast.error('Something went wrong')

// Loading
const { id } = toast.loading('Generating...')
// Later: toast.success('Done!', { id })
```

### 8. Check Authentication

```jsx
import { useAuth } from '@/contexts/AuthContext'

const { isAuthenticated, user, logout } = useAuth()

{isAuthenticated ? (
  <div>Welcome {user?.username}</div>
) : (
  <div>Please login</div>
)}
```

## Available Icon Names (Partial List)

```jsx
import {
  Sparkles,      // Sparkle/magic
  Image,         // Image icon
  Code2,         // Code
  Rocket,        // Launch/speed
  Shield,        // Security
  User,          // User profile
  LogOut,        // Logout
  Settings,      // Settings
  LayoutDashboard, // Dashboard
  ArrowRight,    // Arrow
  Check,         // Checkmark
  X,             // Close
  Loader2,       // Loading spinner
  Clock,         // Time/pending
  AlertCircle,   // Alert
} from 'lucide-react'
```

## Common Imports

```jsx
// Core React
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Icons
import { Sparkles, User, LogOut } from "lucide-react"

// Animations
import { motion, AnimatePresence } from 'framer-motion'

// Context
import { useAuth } from '@/contexts/AuthContext'

// Notifications
import toast from 'react-hot-toast'

// Utilities
import { cn } from '@/lib/utils'
```

## Tailwind Utility Classes Quick Reference

```
Spacing:      m-4, p-4, mb-6, py-8, gap-4, space-y-4
Display:      flex, grid, block, hidden, md:block
Colors:       text-primary, bg-secondary, border-border
Sizing:       w-12, h-6, max-w-2xl, min-h-screen
Typography:  text-sm, font-bold, tracking-tight, text-center
Layout:       container, mx-auto, px-4
Responsive:  md:grid-cols-3, lg:text-lg
Effects:     shadow-sm, rounded-lg, opacity-50
```

## File Locations Quick Reference

```
Component imports:     @/components/ui/button
Icon imports:          lucide-react
Utility imports:       @/lib/utils
Context imports:       @/contexts/AuthContext
Animation:             framer-motion
Notifications:         react-hot-toast
HTTP requests:         @/services/api

CSS/Styles:           /src/index.css
Config:               /tailwind.config.js
Routes:               /App.jsx
Navbar:               /components/Navbar.jsx
```

## Responsive Design Breakpoints

```jsx
// Mobile first (default)
className="text-sm"

// Tablet and up (768px)
className="md:text-lg"

// Desktop and up (1024px)
className="lg:text-xl"

// Large desktop (1536px)
className="2xl:text-2xl"

// Example
className="w-full md:w-1/2 lg:w-1/3"
```

## Common Project Paths

```
Homepage:              /frontend/src/pages/Home.jsx
Components:            /frontend/src/components/
UI Library:            /frontend/src/components/ui/
Auth Context:          /frontend/src/contexts/AuthContext.jsx
Utilities:             /frontend/src/lib/utils.js
Global Styles:         /frontend/src/index.css
Tailwind Config:       /frontend/tailwind.config.js
```

## Development Commands

```bash
# Start dev server (port 5555)
npm run dev

# Build for production
npm run build

# Check linting
npm run lint

# Preview production build
npm run preview
```

---

That's all you need to get started! Use this as a reference while building the homepage.
