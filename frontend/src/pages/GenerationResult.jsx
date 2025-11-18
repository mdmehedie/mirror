import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import generationApi from '../services/generationApi'
import toast from 'react-hot-toast'

const GenerationResult = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [generation, setGeneration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pollingInterval, setPollingInterval] = useState(null)
  const [hasNotified, setHasNotified] = useState(false)
  const [progress, setProgress] = useState(0)

  // Status configurations
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Pending',
      description: 'Generation is queued and waiting to start...',
    },
    processing: {
      icon: Loader2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Processing',
      description: 'AI is generating your virtual try-on...',
      animate: true,
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Completed',
      description: 'Your virtual try-on is ready!',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Failed',
      description: 'Generation failed. Please try again.',
    },
  }

  // Trigger confetti animation
  const triggerConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }))
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }))
    }, 250)
  }

  // Fetch generation details
  const fetchGeneration = async () => {
    try {
      const data = await generationApi.getGeneration(id)
      setGeneration(data)
      setError(null)

      // Update progress based on status
      if (data.status === 'pending') {
        setProgress(10)
      } else if (data.status === 'processing') {
        // Simulate progress
        setProgress((prev) => Math.min(prev + 5, 90))
      } else if (data.status === 'completed') {
        setProgress(100)
      }

      // Stop polling if generation is complete or failed
      if (data.status === 'completed' || data.status === 'failed') {
        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }

        // Only show notification once
        if (!hasNotified) {
          if (data.status === 'completed') {
            toast.success('Generation completed successfully!')
            // Trigger confetti!
            setTimeout(() => triggerConfetti(), 500)
          } else if (data.status === 'failed') {
            toast.error('Generation failed')
          }
          setHasNotified(true)
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch generation'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Setup polling
  useEffect(() => {
    // Initial fetch
    fetchGeneration()

    // Start polling every 3 seconds
    const interval = setInterval(() => {
      fetchGeneration()
    }, 3000)

    setPollingInterval(interval)

    // Cleanup on unmount
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [id])

  // Handle download
  const handleDownload = async () => {
    if (!generation?.result_image?.url) return

    try {
      const response = await fetch(generation.result_image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${generation.name || 'generation'}-result.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Image downloaded!')
    } catch (err) {
      toast.error('Failed to download image')
    }
  }

  if (loading && !generation) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading generation...</p>
        </div>
      </div>
    )
  }

  if (error && !generation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/gallery')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>
    )
  }

  const status = statusConfig[generation?.status] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-7xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/gallery" className="text-primary hover:underline flex items-center mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold">{generation?.name || 'Generation Result'}</h1>
        </div>

        {generation?.status === 'completed' && (
          <Button onClick={handleDownload} size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download Result
          </Button>
        )}
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className={`mb-6 ${status.borderColor} border-2 ${status.bgColor}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  rotate: status.animate ? 360 : 0,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 2, repeat: status.animate ? Infinity : 0, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                }}
              >
                <StatusIcon
                  className={`h-12 w-12 ${status.color}`}
                />
              </motion.div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold ${status.color}`}>{status.label}</h3>
                <p className="text-gray-600">{status.description}</p>
                {generation?.processing_time_seconds && (
                  <p className="text-sm text-gray-500 mt-1">
                    Processing time: {generation.processing_time_seconds}s
                  </p>
                )}
              </div>
            </div>

            {/* Animated Progress Bar */}
            {(generation?.status === 'pending' || generation?.status === 'processing') && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {generation?.status === 'failed' && generation?.error_message && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{generation.error_message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Images Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Model Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Model Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generation?.model_image?.url ? (
              <img
                src={generation.model_image.url}
                alt="Model"
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="mt-3 text-sm text-gray-600">
              <p>Size: {generation?.model_image?.width} × {generation?.model_image?.height}</p>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Garment Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Garment Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generation?.garment_image?.url ? (
              <img
                src={generation.garment_image.url}
                alt="Garment"
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="mt-3 text-sm text-gray-600">
              <p>Size: {generation?.garment_image?.width} × {generation?.garment_image?.height}</p>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Result Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ y: -5 }}
        >
          <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generation?.status === 'completed' && generation?.result_image?.url ? (
              <>
                <img
                  src={generation.result_image.url}
                  alt="Result"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="mt-3 text-sm text-gray-600">
                  <p>Size: {generation.result_image.width} × {generation.result_image.height}</p>
                  <p className="text-green-600 font-medium mt-1">✓ Ready to download</p>
                </div>
              </>
            ) : generation?.status === 'processing' || generation?.status === 'pending' ? (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Generating...</p>
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>

      {/* Generation Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">Provider</dt>
              <dd className="mt-1 capitalize">{generation?.provider}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Quality Preset</dt>
              <dd className="mt-1 capitalize">{generation?.quality_preset}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Created At</dt>
              <dd className="mt-1">{new Date(generation?.created_at).toLocaleString()}</dd>
            </div>
            {generation?.completed_at && (
              <div>
                <dt className="font-medium text-gray-500">Completed At</dt>
                <dd className="mt-1">{new Date(generation.completed_at).toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  )
}

export default GenerationResult
