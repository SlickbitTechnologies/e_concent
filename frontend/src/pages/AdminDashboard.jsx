import { useState, useEffect } from "react";
import { Users, BarChart, FileText, Settings, Bell, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    incomplete: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/consents');
      const data = await response.json();
      setParticipants(data);
      
      // Calculate stats
      const total = data.length;
      const completed = data.filter(p => isApplicationComplete(p.data)).length;
      const incomplete = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      setStats({ total, completed, incomplete, completionRate });
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const isApplicationComplete = (data) => {
    // Check if essential fields are present
    const requiredFields = ['personalInfo', 'medicalHistory', 'consentGiven'];
    return requiredFields.some(field => data && data[field]);
  };

  const getStatusBadge = (data) => {
    const isComplete = isApplicationComplete(data);
    return isComplete ? (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Complete
      </Badge>
    ) : (
      <Badge variant="warning" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Incomplete
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Review participant registrations and trial applications</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold text-foreground">{loading ? '...' : stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Complete Applications</p>
                  <p className="text-2xl font-bold text-foreground">{loading ? '...' : stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Incomplete Applications</p>
                  <p className="text-2xl font-bold text-foreground">{loading ? '...' : stats.incomplete}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-foreground">{loading ? '...' : `${stats.completionRate}%`}</p>
                </div>
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Participant Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading participants...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No participants registered yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isApplicationComplete(participant.data) 
                            ? 'bg-success-light' 
                            : 'bg-warning-light'
                        }`}>
                          {isApplicationComplete(participant.data) ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <Clock className="w-5 h-5 text-warning" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">
                              {participant.data?.personalInfo?.name || 
                               participant.data?.firstName || 
                               participant.data?.name || 
                               'Participant'}
                            </h4>
                            {getStatusBadge(participant.data)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {participant.id.slice(0, 8)}... • Registered: {formatDate(participant.created_at)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="medical" className="w-full justify-start" onClick={() => window.location.reload()}>
                <FileText className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="medical-outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Export Participants
              </Button>
              <Button variant="medical-outline" className="w-full justify-start">
                <BarChart className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="medical-outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


