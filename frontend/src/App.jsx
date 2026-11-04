import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CreateGeneration from './pages/CreateGeneration'
import GenerationResult from './pages/GenerationResult'
import Gallery from './pages/Gallery'
import Integrations from './pages/Integrations'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />

            {/* Generation Flow Routes */}
            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <CreateGeneration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/generation/:id"
              element={
                <ProtectedRoute>
                  <GenerationResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
