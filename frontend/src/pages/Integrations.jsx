import { useEffect, useState } from 'react'
import { KeyRound, Copy, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import integrationApi from '../services/integrationApi'
import toast from 'react-hot-toast'

const Integrations = () => {
  const [keys, setKeys] = useState([])
  const [name, setName] = useState('My ecommerce store')
  const [newKey, setNewKey] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    integrationApi.listKeys().then(setKeys).catch(() => toast.error('Could not load API keys'))
  }, [])

  const createKey = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      const created = await integrationApi.createKey(name)
      setNewKey(created.key)
      setKeys((current) => [created, ...current])
      toast.success('API key created')
    } catch (error) {
      toast.error(error.response?.data?.name?.[0] || 'Could not create API key')
    } finally {
      setBusy(false)
    }
  }

  const revokeKey = async (key) => {
    if (!window.confirm(`Revoke ${key.name}? Requests using this key will stop working.`)) return
    setBusy(true)
    try {
      await integrationApi.revokeKey(key.id)
      setKeys((current) => current.filter((item) => item.id !== key.id))
      setNewKey('')
      toast.success('API key revoked')
    } catch {
      toast.error('Could not revoke API key')
    } finally {
      setBusy(false)
    }
  }

  const baseUrl = new URL(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').origin
  const example = `curl -X POST '${baseUrl}/api/v1/generations/' \\
  -H 'X-Ecompho-Key: YOUR_API_KEY' \\
  -F 'model_image=@person.jpg' \\
  -F 'garment_image=@shirt.jpg' \\
  -F 'name=Summer shirt' \\
  -F 'category=upper_body' \\
  -F 'quality_preset=standard'`

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ecommerce API</h1>
        <p className="text-gray-600 mt-2">Connect your store backend to virtual try-on generation.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> API keys</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">Keep keys on your ecommerce server. Never put a key in browser code or a public repository.</p>
          <form onSubmit={createKey} className="flex flex-col sm:flex-row gap-2">
            <Input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} aria-label="API key name" required />
            <Button disabled={busy} type="submit">Create key</Button>
          </form>
          {newKey && (
            <div className="rounded-lg border border-green-300 bg-green-50 p-4 space-y-2">
              <p className="font-medium">Copy this key now. It will not be shown again.</p>
              <div className="flex gap-2 items-center">
                <code className="break-all flex-1 text-sm">{newKey}</code>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(newKey).then(() => toast.success('Copied'))}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between gap-3 border rounded-lg p-3">
                <div>
                  <p className="font-medium">{key.name}</p>
                  <p className="text-xs text-gray-500">{key.prefix}… · Created {new Date(key.created_at).toLocaleDateString()} · Last used {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'never'}</p>
                </div>
                <Button variant="destructive" size="sm" disabled={busy} onClick={() => revokeKey(key)} aria-label={`Revoke ${key.name}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>API documentation</CardTitle></CardHeader>
        <CardContent className="space-y-5 text-sm">
          <p>Your ecommerce backend authenticates its customer, then sends both images here. Store the returned generation ID beside that customer in your own database. This app does not store ecommerce customer IDs.</p>
          <div>
            <h3 className="font-semibold mb-2">1. Create a generation</h3>
            <p><code>POST {baseUrl}/api/v1/generations/</code> · multipart/form-data · header <code>X-Ecompho-Key</code></p>
            <pre className="mt-2 overflow-x-auto rounded bg-gray-900 text-white p-4 text-xs">{example}</pre>
            <p className="mt-2">Images: JPEG, PNG, or WebP; 512 × 512 pixels minimum; 10 MB maximum each. Optional fields: name, category (upper_body, lower_body, dresses), quality_preset (draft, standard, high), garment_description. Provider: Replicate.</p>
            <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-4 text-xs">{'HTTP 202\n{"id":"GENERATION_UUID","status":"pending","result_image_url":null,...}'}</pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Check status</h3>
            <p><code>GET {baseUrl}/api/v1/generations/GENERATION_UUID/</code> with the same key. Poll until status is completed, failed, or closed. A completed response includes <code>result_image_url</code>.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Download the result</h3>
            <p>Fetch <code>result_image_url</code> from your backend with the same key. It returns image bytes with the appropriate content type. Save or stream those bytes to your customer through your own authenticated route. Keep the generation ID in your store for previous results.</p>
          </div>
          <p className="text-gray-600">Invalid or revoked key: 401. Invalid images or fields: 400. Unknown generation ID: 404. Generation jobs need the Celery worker running.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Integrations
