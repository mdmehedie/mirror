import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import generationApi from '../services/generationApi'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([generationApi.getStats(), generationApi.listGenerations()])
      .then(([summary, list]) => {
        setStats(summary)
        setRecent((Array.isArray(list) ? list : list.results || []).slice(0, 5))
      })
      .catch(() => setError('Could not load generation activity.'))
  }, [])

  const cards = [
    ['Total', stats?.total],
    ['Completed', stats?.completed],
    ['In progress', stats?.processing],
    ['Failed', stats?.failed],
    ['Closed', stats?.closed],
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {user?.username}. Your generation activity is below.</p>
        </div>
        <Link to="/integrations"><Button>Manage API keys</Button></Link>
      </div>
      {error && <p className="text-red-600" role="alert">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map(([label, value]) => (
          <Card key={label}><CardContent className="p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-semibold mt-2">{value ?? '—'}</p>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-5">
        <h2 className="text-xl font-semibold mb-1">Recent generations</h2>
        {stats?.average_processing_seconds != null && (
          <p className="text-sm text-gray-500 mb-4">Average processing time: {Number(stats.average_processing_seconds).toFixed(1)} seconds</p>
        )}
        {recent.length === 0 && <p className="text-gray-500 py-4">No generations yet.</p>}
        <div className="divide-y">
          {recent.map((generation) => (
            <Link key={generation.id} to={`/generation/${generation.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
              <span className="truncate">{generation.name}</span>
              <span className="text-sm capitalize">{generation.status}</span>
            </Link>
          ))}
        </div>
        <Link to="/gallery"><Button variant="outline" className="mt-4">View all generations</Button></Link>
      </CardContent></Card>
    </div>
  )
}

export default Dashboard
