import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Filter,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import generationApi from '../services/generationApi'
import toast from 'react-hot-toast'

const Gallery = () => {
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)

  // Filters and sorting
  const [sortBy, setSortBy] = useState('-created_at') // Default: newest first
  const [statusFilter, setStatusFilter] = useState('all')

  // Status badge configuration
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Pending',
    },
    processing: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Processing',
      animate: true,
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Completed',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      label: 'Failed',
    },
    closed: {
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      label: 'Closed',
    },
  }

  // Fetch generations
  const fetchGenerations = async () => {
    setLoading(true)
    try {
      const params = {
        sort_by: sortBy,
        page,
      }

      // Add status filter if not "all"
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      const data = await generationApi.listGenerations(params)
      // Handle both array response and paginated response
      const generationsArray = Array.isArray(data) ? data : (data.results || [])
      setGenerations(generationsArray)
      setTotalCount(Array.isArray(data) ? data.length : (data.count || 0))
      setHasNextPage(Boolean(data.next))
      setError(null)
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load generations'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchGenerations()
  }, [sortBy, statusFilter, page])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get thumbnail image
  const getThumbnail = (generation) => {
    // Use result if completed, otherwise use model image
    if (generation.status === 'completed' && generation.result_image?.url) {
      return generation.result_image.url
    }
    return generation.model_image?.url || null
  }

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 shimmer" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded shimmer" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded shimmer w-3/4" />
          <div className="h-3 bg-gray-200 rounded shimmer w-1/2" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Gallery</h1>
          <p className="text-gray-600">View and manage your virtual try-on generations</p>
        </div>
        <Link to="/generate">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Filters and Sorting */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sort By */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="-name">Name (Z-A)</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <SkeletonCard />
            </motion.div>
          ))}
        </motion.div>
      ) : error ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : generations.length === 0 ? (
        // Empty State
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No generations yet</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Start creating virtual try-ons by uploading model and garment images
            </p>
            <Link to="/generate">
              <Button size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your First Try-On
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        // Generations Grid
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {generations.map((generation, index) => {
                const status = statusConfig[generation.status]
                const StatusIcon = status.icon
                const thumbnail = getThumbnail(generation)

                return (
                  <motion.div
                    key={generation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    layout
                  >
                    <Link to={`/generation/${generation.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full group">
                    {/* Thumbnail */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {thumbnail ? (
                        <motion.img
                          src={thumbnail}
                          alt={generation.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}

                      {/* Status Badge */}
                      <div
                        className={`absolute top-2 right-2 ${status.bgColor} px-2 py-1 rounded-md flex items-center gap-1`}
                      >
                        <StatusIcon
                          className={`h-3 w-3 ${status.color} ${status.animate ? 'animate-spin' : ''}`}
                        />
                        <span className={`text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 truncate" title={generation.name}>
                        {generation.name || 'Untitled Generation'}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Provider:</span>
                          <span className="capitalize font-medium">{generation.provider}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Quality:</span>
                          <span className="capitalize font-medium">
                            {generation.quality_preset}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-gray-500 text-xs">
                            {formatDate(generation.created_at)}
                          </span>
                          {generation.processing_time_seconds && (
                            <span className="text-gray-500 text-xs">
                              {generation.processing_time_seconds}s
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {/* Results Count */}
          <motion.div
            className="mt-6 text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>Showing page {page} of {totalCount} generation{totalCount !== 1 ? 's' : ''}</p>
            <div className="flex justify-center gap-2 mt-3">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button variant="outline" disabled={!hasNextPage} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

export default Gallery
