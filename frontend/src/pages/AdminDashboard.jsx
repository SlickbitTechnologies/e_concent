import { useState, useEffect } from "react";
import { Users, BarChart, FileText, Settings, Bell, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import ParticipantReviewModal from "@/components/ParticipantReviewModal";

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    incomplete: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchParticipants();
  }, []);

  const addTestParticipant = () => {
    const testParticipant = {
      id: `NS-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      firstName: 'Test',
      lastName: 'Participant',
      participantName: 'Test Participant',
      email: 'test@example.com',
      status: 'completed',
      submissionDate: new Date().toISOString(),
      healthConditions: 'No significant health conditions reported',
      allergies: 'No known allergies',
      currentMedications: 'None currently',
      informedConsent: true,
      dataUsageConsent: true,
      dateOfBirth: '1990-01-01',
      phone: '555-0123',
      address: '123 Test St, Test City'
    };

    const existingParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
    existingParticipants.push(testParticipant);
    localStorage.setItem('participants', JSON.stringify(existingParticipants));
    fetchParticipants();
  };

  const fetchParticipants = async () => {
    try {
      // First try to get from Firestore
      const { getParticipantsFromFirestore } = await import('../services/firestoreService');
      const firestoreResult = await getParticipantsFromFirestore();
      
      let allParticipants = [];
      
      if (firestoreResult.success) {
        console.log('Successfully fetched participants from Firestore:', firestoreResult.data.length);
        allParticipants = firestoreResult.data;
      } else {
        console.error('Failed to fetch from Firestore:', firestoreResult.error);
        
        // Fallback to localStorage
        const localParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
        console.log('Using localStorage fallback, participants:', localParticipants.length);
        allParticipants = localParticipants;
      }
      
      // Also try to fetch from API as additional source
      try {
        const response = await fetch('/api/consents');
        if (response.ok) {
          const apiParticipants = await response.json();
          console.log('Also fetched from API:', apiParticipants.length);
          // Merge with Firestore data if needed (avoid duplicates)
        }
      } catch (apiError) {
        console.log('API not available');
      }
      setParticipants(allParticipants);
      
      // Calculate stats
      const total = allParticipants.length;
      const approved = allParticipants.filter(p => p.status === 'approved').length;
      const pendingReview = allParticipants.filter(p => p.status === 'completed').length;
      const rejected = allParticipants.filter(p => p.status === 'rejected').length;
      const incomplete = allParticipants.filter(p => !p.status || p.status === 'pending').length;
      const completionRate = total > 0 ? Math.round((approved / total) * 100) : 0;
      
      setStats({ total, completed: approved, incomplete: incomplete + pendingReview + rejected, completionRate });
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (participant) => {
    setSelectedParticipant(participant);
    setIsReviewModalOpen(true);
  };

  const handleApproveParticipant = async (participantId) => {
    console.log('Approving participant:', participantId);
    try {
      // Find participant to get Firestore ID
      const participant = participants.find(p => p.id === participantId);
      if (!participant) {
        console.error('Participant not found with ID:', participantId);
        alert('Participant not found. Please refresh the page and try again.');
        return;
      }

      // Update in Firestore if firestoreId exists
      if (participant.firestoreId) {
        const { updateParticipantStatusInFirestore } = await import('../services/firestoreService');
        const firestoreResult = await updateParticipantStatusInFirestore(participant.firestoreId, 'approved');
        
        if (firestoreResult.success) {
          console.log('Participant status updated in Firestore');
        } else {
          console.error('Failed to update in Firestore:', firestoreResult.error);
        }
      }

      // Update in localStorage as backup
      const existingParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
      const updatedParticipants = existingParticipants.map(p => 
        p.id === participantId ? { ...p, status: 'approved', approvedDate: new Date().toISOString() } : p
      );
      localStorage.setItem('participants', JSON.stringify(updatedParticipants));
      console.log('Participant status updated in localStorage');

      // Try to update via API (skip if not available)
      try {
        const response = await fetch(`/api/consents/${participantId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' }),
        });
        
        if (response.ok) {
          console.log('API update successful');
        } else {
          console.log('API update failed:', response.status, response.statusText);
        }
      } catch (apiError) {
        console.log('API not available:', apiError.message);
      }

      // Refresh participants list
      console.log('Refreshing participants list...');
      await fetchParticipants();
      console.log('Participants list refreshed');
    } catch (error) {
      console.error('Error approving participant:', error);
      alert('Error approving participant. Please try again.');
    }
  };

  const handleRejectParticipant = async (participantId) => {
    try {
      // Update in localStorage
      const existingParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
      const updatedParticipants = existingParticipants.map(p => 
        p.id === participantId ? { ...p, status: 'rejected' } : p
      );
      localStorage.setItem('participants', JSON.stringify(updatedParticipants));

      // Try to update via API
      try {
        const response = await fetch(`/api/consents/${participantId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' }),
        });
        
        if (response.ok) {
          console.log('API reject update successful');
        } else {
          console.log('API reject update failed:', response.status, response.statusText);
        }
      } catch (apiError) {
        console.log('API not available, using localStorage only:', apiError.message);
      }

      // Refresh participants list
      await fetchParticipants();
    } catch (error) {
      console.error('Error rejecting participant:', error);
      throw error;
    }
  };

  const handleDeleteParticipant = async (participantId) => {
    try {
      console.log('Deleting participant:', participantId);
      
      // Remove from localStorage
      const existingParticipants = JSON.parse(localStorage.getItem('participants') || '[]');
      const updatedParticipants = existingParticipants.filter(p => p.id !== participantId);
      localStorage.setItem('participants', JSON.stringify(updatedParticipants));
      console.log('Participant removed from localStorage');

      // Try to delete via API
      try {
        const response = await fetch(`/api/consents/${participantId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('API delete successful');
        } else {
          console.log('API delete failed:', response.status, response.statusText);
        }
      } catch (apiError) {
        console.log('API not available, using localStorage only:', apiError.message);
      }

      // Refresh participants list
      await fetchParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
      throw error;
    }
  };

  const getStatusBadge = (participant) => {
    const status = participant.status || 'pending';
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Pending Review
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Incomplete
          </Badge>
        );
    }
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
                  <p className="text-sm text-muted-foreground">Approved Applications</p>
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
                  <p className="text-sm text-muted-foreground">Pending Review</p>
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
                  <p className="text-sm text-muted-foreground">Approval Rate</p>
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
                          participant.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30'
                        }`}>
                          {participant.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">
                              Participant ID: {participant.id}
                            </h4>
                            {getStatusBadge(participant)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {formatDate(participant.submissionDate || participant.created_at)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReviewClick(participant)}
                      >
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
              {/* <Button variant="medical-outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Export Participants
              </Button>
              <Button variant="medical-outline" className="w-full justify-start">
                <BarChart className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="medical-outline" className="w-full justify-start" onClick={addTestParticipant}>
                <Users className="w-4 h-4 mr-2" />
                Add Test Participant
              </Button>
              <Button variant="medical-outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button> */}
            </CardContent>
          </Card>
        </div>

        {/* Review Modal */}
        <ParticipantReviewModal
          participant={selectedParticipant}
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedParticipant(null);
          }}
          onApprove={handleApproveParticipant}
          onReject={handleRejectParticipant}
          onDelete={handleDeleteParticipant}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;


