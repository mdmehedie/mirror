import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import generationApi from '../services/generationApi'
import toast from 'react-hot-toast'

/**
 * ImageUpload Component
 * Reusable drag & drop image upload with preview and validation
 *
 * @param {string} imageType - 'model_image' or 'garment_image'
 * @param {string} label - Display label for the upload area
 * @param {function} onUploadSuccess - Callback when upload completes
 * @param {object} uploadedImage - Currently uploaded image data
 */
const ImageUpload = ({ imageType, label, onUploadSuccess, uploadedImage }) => {
  const [preview, setPreview] = useState(uploadedImage?.url || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Validate file before upload
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, or WEBP images.'
    }

    if (file.size > maxSize) {
      return 'File too large. Maximum size is 10MB.'
    }

    return null
  }

  // Handle file drop/select
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      // Simulate progress (since axios doesn't provide real progress for multipart uploads easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload image
      const response = await generationApi.uploadImage(file, imageType)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Call success callback
      onUploadSuccess(response)
      toast.success(`${label} uploaded successfully!`)
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Upload failed. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
      setPreview(null)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [imageType, label, onUploadSuccess])

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading,
  })

  // Handle remove image
  const handleRemove = (e) => {
    e.stopPropagation()
    setPreview(null)
    setError(null)
    onUploadSuccess(null)
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">{label}</label>

      <motion.div
        {...getRootProps()}
        animate={{
          scale: isDragActive ? 1.02 : 1,
          borderColor: isDragActive ? 'rgb(var(--primary))' : 'rgb(209, 213, 219)',
        }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-primary bg-primary/10 shadow-lg' : 'border-gray-300 hover:border-primary/50'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300' : ''}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <motion.img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

            {!uploading && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Uploading... {uploadProgress}%</p>
                </div>
              </div>
            )}

            {uploadedImage && !uploading && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md flex items-center text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Uploaded
              </div>
            )}
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <motion.div
                animate={{
                  y: isDragActive ? -10 : 0,
                  rotate: isDragActive ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Upload className={`h-12 w-12 mb-4 ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
              </motion.div>

            {isDragActive ? (
              <p className="text-primary font-medium">Drop the image here...</p>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  Drag and drop an image, or click to select
                </p>
                <p className="text-sm text-gray-400">
                  JPG, PNG, or WEBP (max 10MB)
                </p>
              </>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default ImageUpload
