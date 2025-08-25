import { useState } from "react";
import { X, User, Mail, Calendar, FileText, Heart, Pill, AlertTriangle, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ParticipantReviewModal = ({ participant, isOpen, onClose, onApprove, onReject, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !participant) return null;

  console.log('Modal opened for participant:', participant.id, 'Status:', participant.status);

  const handleApprove = async () => {
    console.log('Approve button clicked for participant:', participant.id);
    setIsProcessing(true);
    try {
      console.log('Calling onApprove function...');
      await onApprove(participant.id);
      console.log('onApprove completed, closing modal...');
      onClose();
    } catch (error) {
      console.error('Error approving participant:', error);
      alert('Error approving participant. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(participant.id);
      onClose();
    } catch (error) {
      console.error('Error rejecting participant:', error);
      alert('Error rejecting participant. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this participant? This action cannot be undone.')) {
      setIsProcessing(true);
      try {
        await onDelete(participant.id);
        onClose();
      } catch (error) {
        console.error('Error deleting participant:', error);
        alert('Error deleting participant. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
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
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {/* {participant.participantName || `${participant.firstName} ${participant.lastName}` || 'Participant'} */}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-lg font-mono text-primary font-semibold">ID: {participant.id}</p>
                {getStatusBadge(participant.status)}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information - Privacy Protected */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Participant Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Participant ID</label>
                <p className="text-foreground font-mono">{participant.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Domain</label>
                <p className="text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {participant.email ? `***@${participant.email.split('@')[1]}` : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                <p className="text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(participant.submissionDate || participant.created_at)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Form Completion</label>
                <p className="text-foreground">All sections completed</p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="w-5 h-5" />
                Privacy Protection Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                Detailed participant information including personal details, medical information, and emergency contacts 
                are protected for privacy reasons. Only the participant ID and basic submission metadata are shown for 
                administrative review purposes.
              </p>
            </CardContent>
          </Card>

          {/* Consent Information */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Consent Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Informed Consent</label>
                  <p className="text-foreground">
                    {participant.informedConsent ? '✓ Agreed' : '✗ Not agreed'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data Usage Consent</label>
                  <p className="text-foreground">
                    {participant.dataUsageConsent ? '✓ Agreed' : '✗ Not agreed'}
                  </p>
                </div>
              </div>
            </CardContent> 
          </Card>*/}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <Button 
            variant="outline" 
            onClick={handleDelete}
            disabled={isProcessing}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            {isProcessing ? 'Deleting...' : 'Delete'}
          </Button>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Close
            </Button>
            {participant.status !== 'approved' && participant.status !== 'rejected' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Reject'}
                </Button>
                <Button 
                  variant="medical" 
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Approve'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantReviewModal;
