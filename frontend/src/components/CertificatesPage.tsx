import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ArrowLeft, Download, Trophy, Calendar } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner@2.0.3'

interface CertificatesPageProps {
  onNavigate: (page: string) => void
}

export function CertificatesPage({ onNavigate }: CertificatesPageProps) {
  const { userEvents } = useData()
  const { user } = useAuth()

  const completedEvents = userEvents.filter(event => event.status === 'completed')

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Environment': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Career': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Arts': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  const handleDownloadCertificate = (eventTitle: string) => {
    // In a real app, this would generate and download a PDF certificate
    toast.success(`Certificate for "${eventTitle}" downloaded!`)
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('student-dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl mb-2">My Certificates</h1>
          <p className="text-muted-foreground">
            Download certificates for events you've completed
          </p>
        </div>

        {/* Certificates */}
        {completedEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl mb-4">No certificates yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Complete events to earn certificates that you can download and add to your portfolio.
              </p>
              <Button onClick={() => onNavigate('events')}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                You have {completedEvents.length} certificate{completedEvents.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {completedEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                    <CardDescription>
                      Completed on {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.organizer}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <Button 
                          className="w-full" 
                          onClick={() => handleDownloadCertificate(event.title)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificate (PDF)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Card */}
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Certificate Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      You've completed {completedEvents.length} event{completedEvents.length !== 1 ? 's' : ''} and earned {completedEvents.length} certificate{completedEvents.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-destructive">{completedEvents.length}</div>
                    <div className="text-sm text-muted-foreground">Certificates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}