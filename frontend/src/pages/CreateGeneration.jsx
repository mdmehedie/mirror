import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import ImageUpload from '../components/ImageUpload'
import generationApi from '../services/generationApi'
import toast from 'react-hot-toast'

const CreateGeneration = () => {
  const navigate = useNavigate()

  // Form state
  const [generationName, setGenerationName] = useState('')
  const [modelImage, setModelImage] = useState(null)
  const [garmentImage, setGarmentImage] = useState(null)
  const [provider, setProvider] = useState('replicate')
  const [qualityPreset, setQualityPreset] = useState('standard')
  const [category, setCategory] = useState('upper_body')
  const [garmentDescription, setGarmentDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Provider information
  const providers = {
    gemini: {
      name: 'Gemini (Google)',
      description: 'Fast generation with Google AI',
      estimatedTime: '~10 seconds',
      cost: 'Free (Development)',
      badge: 'FAST',
      badgeColor: 'bg-blue-500',
    },
    replicate: {
      name: 'Replicate (IDM-VTON)',
      description: 'High-quality IDM-VTON model',
      estimatedTime: '~19 seconds',
      cost: 'Pay-as-you-go',
      badge: 'BEST QUALITY',
      badgeColor: 'bg-purple-500',
    },
  }

  // Quality presets
  const qualities = [
    { value: 'draft', label: 'Draft', description: 'Fast preview' },
    { value: 'standard', label: 'Standard', description: 'Balanced quality' },
    { value: 'high', label: 'High', description: 'Best quality' },
  ]

  // Garment categories
  const categories = [
    { value: 'upper_body', label: 'Upper Body', description: 'T-shirts, shirts, jackets, etc.' },
    { value: 'lower_body', label: 'Lower Body', description: 'Pants, skirts, shorts, etc.' },
    { value: 'dresses', label: 'Dresses', description: 'Full-body dresses' },
  ]

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!modelImage) {
      toast.error('Please upload a model image')
      return
    }

    if (!garmentImage) {
      toast.error('Please upload a garment image')
      return
    }

    setIsSubmitting(true)

    try {
      // Create generation
      const generationData = {
        name: generationName || 'Untitled Generation',
        model_image_id: modelImage.id,
        garment_image_id: garmentImage.id,
        provider: provider,
        quality_preset: qualityPreset,
        category: category,
        garment_description: garmentDescription,
      }

      const response = await generationApi.createGeneration(generationData)

      toast.success('Generation started! Redirecting to results...')

      // Redirect to result page
      setTimeout(() => {
        navigate(`/generation/${response.id}`)
      }, 1000)
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to start generation'
      toast.error(errorMessage)
      console.error('Generation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-6xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold">Create Virtual Try-On</h1>
        </div>
        <p className="text-gray-600">
          Upload a model image and a garment image to generate a virtual try-on
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Image Uploads */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Upload both model and garment images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                imageType="model_image"
                label="Model Image"
                onUploadSuccess={setModelImage}
                uploadedImage={modelImage}
              />

              <ImageUpload
                imageType="garment_image"
                label="Garment Image"
                onUploadSuccess={setGarmentImage}
                uploadedImage={garmentImage}
              />
            </CardContent>
          </Card>
          </motion.div>

          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Choose provider and quality settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Generation Name */}
              <div>
                <Label htmlFor="name">Generation Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Summer Dress Try-On"
                  value={generationName}
                  onChange={(e) => setGenerationName(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Provider Selection */}
              <div>
                <Label className="mb-3 block">AI Provider</Label>
                <div className="space-y-3">
                  {Object.entries(providers).map(([key, info], index) => (
                    <motion.div
                      key={key}
                      onClick={() => setProvider(key)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${provider === key ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'}
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={provider === key}
                            onChange={() => setProvider(key)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-semibold">{info.name}</p>
                            <p className="text-sm text-gray-600">{info.description}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${info.badgeColor} text-white`}>
                          {info.badge}
                        </span>
                      </div>
                      <div className="ml-6 text-sm text-gray-500">
                        <p>⏱️ {info.estimatedTime}</p>
                        <p>💰 {info.cost}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quality Preset */}
              <div>
                <Label htmlFor="quality" className="mb-3 block">
                  Quality Preset
                </Label>
                <select
                  id="quality"
                  value={qualityPreset}
                  onChange={(e) => setQualityPreset(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {qualities.map((quality) => (
                    <option key={quality.value} value={quality.value}>
                      {quality.label} - {quality.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Garment Category */}
              <div>
                <Label htmlFor="category" className="mb-3 block">
                  Garment Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label} - {cat.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Required for accurate try-on generation
                </p>
              </div>

              {/* Garment Description */}
              <div>
                <Label htmlFor="garmentDescription" className="mb-3 block">
                  Garment Description (Optional)
                </Label>
                <textarea
                  id="garmentDescription"
                  value={garmentDescription}
                  onChange={(e) => setGarmentDescription(e.target.value)}
                  placeholder="E.g., Red cotton T-shirt with round neck, modern casual style..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add details like color, style, material, or specific requirements
                </p>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tips for best results:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Use clear, well-lit photos</li>
                      <li>Model should be facing forward</li>
                      <li>Garment should be clearly visible</li>
                      <li>Minimum 512x512 pixels recommended</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || !modelImage || !garmentImage}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Starting Generation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Try-On
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}

export default CreateGeneration
