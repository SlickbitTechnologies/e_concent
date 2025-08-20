// Converted from TSX to JSX; functionality preserved
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Chatbot from "@/components/Chatbot";

const ConsentForm = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    age: "",
    sex: "",
    phoneNumber: "",
    address: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    
    // Medical Information
    healthConditions: "",
    allergies: "",
    currentMedications: "",
    lastTetanusShot: "",
    
    // Healthcare Providers
    physicianName: "",
    physicianPhone: "",
    dentistName: "",
    dentistPhone: "",
    preferredHospital: "",
    
    // Insurance Information
    insuranceProvider: "",
    policyNumber: "",
    policyHolder: "",
    
    // Legal Authorization Checkboxes
    emergencyMedicalCare: false,
    surgery: false,
    bloodTransfusions: false,
    dentalTreatment: false,
    other: false,
    otherSpecify: "",
    
    // Original fields
    consentDate: new Date().toISOString().split("T")[0],
    isUCLAPatient: "",
    hospital: "",
    hasReceivedInfo: false,
    consentConsent1: false,
    consentConsent2: false,
    consentConsent3: false,
    consentConsent4: false,
    consentConsent5: false,
    consentConsent6: false,
    signature: ""
  });

  // Define fields metadata for the chatbot
  const fields = [
    { key: 'firstName', label: 'First Name', help: 'Your given name.' },
    { key: 'lastName', label: 'Last Name', help: 'Your family name.' },
    { key: 'email', label: 'Email Address', help: 'Your primary contact email.' },
    { key: 'dateOfBirth', label: 'Date of Birth', help: 'Your birth date in YYYY-MM-DD format.' },
    { key: 'age', label: 'Age', help: 'Your current age in years.' },
    { key: 'sex', label: 'Sex', help: 'Your biological sex.' },
    { key: 'phoneNumber', label: 'Phone Number', help: 'Your contact phone number.' },
    { key: 'address', label: 'Home Address', help: 'Your residential address.' },
    { key: 'emergencyContactName', label: 'Emergency Contact Name', help: 'Name of your emergency contact.' },
    { key: 'emergencyContactPhone', label: 'Emergency Contact Phone', help: 'Phone number of your emergency contact.' },
    { key: 'emergencyContactRelationship', label: 'Emergency Contact Relationship', help: 'Relationship to your emergency contact (e.g., spouse, parent).' },
    { key: 'healthConditions', label: 'Current Health Conditions', help: 'Any ongoing medical issues.' },
    { key: 'allergies', label: 'Allergies', help: 'Any known allergies to medications, foods, etc.' },
    { key: 'currentMedications', label: 'Current Medications', help: 'List of all medicines you are currently taking.' },
    { key: 'lastTetanusShot', label: 'Last Tetanus Shot', help: 'Date of your last tetanus vaccination.' },
    { key: 'physicianName', label: 'Primary Physician Name', help: 'Name of your primary care doctor.' },
    { key: 'physicianPhone', label: 'Physician Phone', help: 'Phone number of your primary care doctor.' },
    { key: 'dentistName', label: 'Dentist Name', help: 'Name of your dentist.' },
    { key: 'dentistPhone', label: 'Dentist Phone', help: 'Phone number of your dentist.' },
    { key: 'preferredHospital', label: 'Preferred Hospital', help: 'Your preferred hospital for care.' },
    { key: 'insuranceProvider', label: 'Insurance Provider', help: 'Your health insurance company.' },
    { key: 'policyNumber', label: 'Policy Number', help: 'Your insurance policy number.' },
    { key: 'policyHolder', label: 'Policy Holder', help: 'Name of the insurance policy holder.' },
    { key: 'emergencyMedicalCare', label: 'Emergency Medical Care', help: 'Consent for emergency care.' },
    { key: 'surgery', label: 'Surgery', help: 'Consent for surgery if needed.' },
    { key: 'bloodTransfusions', label: 'Blood Transfusions', help: 'Consent for blood transfusions if needed.' },
    { key: 'dentalTreatment', label: 'Dental Treatment', help: 'Consent for emergency dental treatment.' },
    { key: 'other', label: 'Other Authorizations', help: 'Any other specific medical authorizations.' },
    { key: 'otherSpecify', label: 'Other Specify', help: 'Details for other authorizations.' },
    { key: 'isUCLAPatient', label: 'UCLA Patient', help: 'Are you a UCLA patient?' },
    { key: 'hospital', label: 'Hospital Location', help: 'Which hospital are you associated with?' },
    { key: 'hasReceivedInfo', label: 'Received Information', help: 'Confirmation of receiving trial information.' },
    { key: 'consentConsent1', label: 'Consent to Participate', help: 'Your consent to join the trial.' },
    { key: 'consentConsent2', label: 'Voluntary Participation', help: 'Understanding that participation is voluntary.' },
    { key: 'consentConsent3', label: 'Risks and Benefits', help: 'Understanding of risks and benefits.' },
    { key: 'consentConsent4', label: 'Right to Withdraw', help: 'Understanding of your right to withdraw.' },
    { key: 'consentConsent5', label: 'Data Collection Consent', help: 'Consent for data collection.' },
    { key: 'consentConsent6', label: 'Received Copy', help: 'Confirmation of receiving a copy of the form.' },
    { key: 'signature', label: 'Digital Signature', help: 'Your digital signature.' },
    { key: 'consentDate', label: 'Consent Date', help: 'The date of your consent.' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['firstName','lastName','email','dateOfBirth','age','phoneNumber','address','emergencyContactName','emergencyContactPhone','emergencyContactRelationship','signature','isUCLAPatient','hospital'];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    if (!formData.hasReceivedInfo || !formData.consentConsent1) {
      alert('Please confirm that you have received information about the trial and consent to participate.');
      return;
    }
    setShowPreview(true);
  };

  const handleFinalSubmit = async () => {
    try {
      const response = await fetch('/api/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit consent');
      const saved = await response.json();
      navigate('/submission-success', { state: { consentId: saved.id } });
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
    }
  };

  const handleBackToEdit = () => setShowPreview(false);

  const consentFormText = `\n    Welcome to the NeuroSAFE PROOF Clinical Trial consent form...\n  `;



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
              <div className="text-primary-foreground font-bold text-sm">NEUROSAFE<br />PROOF</div>
            </div>
            <div>
              <h1 className="text-xl font-bold">NeuroSAFE PROOF Clinical Trial</h1>
              <p className="text-primary-foreground/80">Consent Form</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate('/trial-info')} className="text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trial Info
            </Button>
            <Button variant="secondary" onClick={() => navigate('/home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {showPreview ? (
          <div className="space-y-6">
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Form Preview</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Please review all the information below carefully before final submission.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Consent Form Preview</CardTitle>
                <p className="text-muted-foreground">Review your information before final submission</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><strong>First Name:</strong> {formData.firstName || 'Not provided'}</div>
                    <div><strong>Last Name:</strong> {formData.lastName || 'Not provided'}</div>
                    <div><strong>Email:</strong> {formData.email || 'Not provided'}</div>
                    <div><strong>Date of Birth:</strong> {formData.dateOfBirth || 'Not provided'}</div>
                    <div><strong>Age:</strong> {formData.age || 'Not provided'}</div>
                    <div><strong>Sex:</strong> {formData.sex || 'Not provided'}</div>
                    <div><strong>Phone Number:</strong> {formData.phoneNumber || 'Not provided'}</div>
                    <div className="md:col-span-2"><strong>Address:</strong> {formData.address || 'Not provided'}</div>
                  </div>
                </div>

                {/* Emergency Contact Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><strong>Name:</strong> {formData.emergencyContactName || 'Not provided'}</div>
                    <div><strong>Phone:</strong> {formData.emergencyContactPhone || 'Not provided'}</div>
                    <div className="md:col-span-2"><strong>Relationship:</strong> {formData.emergencyContactRelationship || 'Not provided'}</div>
                  </div>
                </div>

                {/* Medical Information Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    Medical Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Health Conditions:</strong> {formData.healthConditions || 'Not provided'}</div>
                    <div><strong>Allergies:</strong> {formData.allergies || 'Not provided'}</div>
                    <div><strong>Current Medications:</strong> {formData.currentMedications || 'Not provided'}</div>
                    <div><strong>Last Tetanus Shot:</strong> {formData.lastTetanusShot || 'Not provided'}</div>
                  </div>
                </div>

                {/* Medical Care Information Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    Medical Care Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><strong>Physician:</strong> {formData.physicianName || 'Not provided'}</div>
                    <div><strong>Physician Phone:</strong> {formData.physicianPhone || 'Not provided'}</div>
                    <div><strong>Dentist:</strong> {formData.dentistName || 'Not provided'}</div>
                    <div><strong>Dentist Phone:</strong> {formData.dentistPhone || 'Not provided'}</div>
                    <div><strong>Preferred Hospital:</strong> {formData.preferredHospital || 'Not provided'}</div>
                    <div><strong>Insurance Provider:</strong> {formData.insuranceProvider || 'Not provided'}</div>
                    <div><strong>Policy Number:</strong> {formData.policyNumber || 'Not provided'}</div>
                    <div><strong>Policy Holder:</strong> {formData.policyHolder || 'Not provided'}</div>
                  </div>
                </div>

                {/* Legal Authorization Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                    Legal Authorization
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Emergency Medical Care:</strong> {formData.emergencyMedicalCare ? 'Yes' : 'No'}</div>
                    <div><strong>Surgery:</strong> {formData.surgery ? 'Yes' : 'No'}</div>
                    <div><strong>Blood Transfusions:</strong> {formData.bloodTransfusions ? 'Yes' : 'No'}</div>
                    <div><strong>Dental Treatment:</strong> {formData.dentalTreatment ? 'Yes' : 'No'}</div>
                    <div><strong>Other:</strong> {formData.other ? 'Yes' : 'No'}</div>
                    {formData.otherSpecify && <div><strong>Other Specify:</strong> {formData.otherSpecify}</div>}
                  </div>
                </div>

                {/* Final Consent Preview */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                    Final Consent & Study Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>UCLA Patient:</strong> {formData.isUCLAPatient === 'yes' ? 'Yes' : formData.isUCLAPatient === 'no' ? 'No' : 'Not specified'}</div>
                    <div><strong>Hospital:</strong> {
                      formData.hospital === 'uclh' ? 'University College London Hospital' :
                      formData.hospital === 'guys' ? "Guy's Hospital" :
                      formData.hospital === 'imperial' ? 'Imperial College Healthcare' :
                      formData.hospital === 'kings' ? "King's College Hospital" :
                      formData.hospital === 'barts' ? 'Barts Health' :
                      'Not selected'
                    }</div>
                    <div><strong>Received Information:</strong> {formData.hasReceivedInfo ? 'Yes' : 'No'}</div>
                    <div><strong>Consent to Participate:</strong> {formData.consentConsent1 ? 'Yes' : 'No'}</div>
                    <div><strong>Signature:</strong> {formData.signature || 'Not provided'}</div>
                    <div><strong>Date:</strong> {formData.consentDate || 'Not provided'}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button variant="outline" onClick={handleBackToEdit} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Edit
                  </Button>
                  <Button onClick={handleFinalSubmit} className="flex-1">
                    Confirm & Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Manual Form Filling Available</h3>
              <p className="text-sm text-green-700 dark:text-green-300">You can fill out this form manually by typing in all the fields below, or use the AI assistant for help and voice input. All fields marked with * are required.</p>
            </div>

            {/* Inserted full form */}
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Section 1: Basic Information */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                      <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        Basic Information
                      </CardTitle>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Please provide your basic contact information.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="firstName">First Name *</Label><Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required /></div>
                        <div className="space-y-2"><Label htmlFor="lastName">Last Name *</Label><Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="dateOfBirth">Date of Birth *</Label><Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} required /></div>
                        <div className="space-y-2"><Label htmlFor="age">Age *</Label><Input id="age" type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} required /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sex">Sex *</Label>
                          <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                            <SelectTrigger><SelectValue placeholder="Select sex" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label htmlFor="phoneNumber">Phone Number *</Label><Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} required /></div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="email">Email Address *</Label><Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required /></div>
                      <div className="space-y-2"><Label htmlFor="address">Home Address *</Label><Textarea id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required /></div>
                    </CardContent>
                  </Card>

                  {/* Section 2: Emergency Contact */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                      <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2"><div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>Emergency Contact</CardTitle>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-2">Please provide emergency contact details.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="emergencyContactName">Emergency Contact Name *</Label><Input id="emergencyContactName" value={formData.emergencyContactName} onChange={(e) => handleInputChange('emergencyContactName', e.target.value)} required /></div>
                        <div className="space-y-2"><Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label><Input id="emergencyContactPhone" type="tel" value={formData.emergencyContactPhone} onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)} required /></div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="emergencyContactRelationship">Relationship to You *</Label><Input id="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)} required /></div>
                    </CardContent>
                  </Card>

                  {/* Section 3: Medical Information */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                      <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        Medical Information
                      </CardTitle>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">Medical history is crucial for ensuring your safety during the trial. Please provide accurate information about your health conditions and medications.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="healthConditions">Current Health Conditions</Label>
                        <Textarea id="healthConditions" value={formData.healthConditions} onChange={(e) => handleInputChange('healthConditions', e.target.value)} placeholder="List any current health conditions, diseases, or ongoing medical issues" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea id="allergies" value={formData.allergies} onChange={(e) => handleInputChange('allergies', e.target.value)} placeholder="List any known allergies (medications, foods, environmental)" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentMedications">Current Medications</Label>
                        <Textarea id="currentMedications" value={formData.currentMedications} onChange={(e) => handleInputChange('currentMedications', e.target.value)} placeholder="List all current medications including dosages" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastTetanusShot">Last Tetanus Shot</Label>
                        <Input id="lastTetanusShot" type="date" value={formData.lastTetanusShot} onChange={(e) => handleInputChange('lastTetanusShot', e.target.value)} placeholder="Date of last tetanus vaccination" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 4: Medical Care Information */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                      <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        Medical Care Information
                      </CardTitle>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Your healthcare provider details and insurance information help us coordinate your care during the trial.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="physicianName">Primary Physician Name</Label>
                          <Input id="physicianName" value={formData.physicianName} onChange={(e) => handleInputChange('physicianName', e.target.value)} placeholder="Your primary care physician" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="physicianPhone">Physician Phone</Label>
                          <Input id="physicianPhone" type="tel" value={formData.physicianPhone} onChange={(e) => handleInputChange('physicianPhone', e.target.value)} placeholder="Physician's phone number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dentistName">Dentist Name</Label>
                          <Input id="dentistName" value={formData.dentistName} onChange={(e) => handleInputChange('dentistName', e.target.value)} placeholder="Your dentist's name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dentistPhone">Dentist Phone</Label>
                          <Input id="dentistPhone" type="tel" value={formData.dentistPhone} onChange={(e) => handleInputChange('dentistPhone', e.target.value)} placeholder="Dentist's phone number" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredHospital">Preferred Hospital</Label>
                        <Input id="preferredHospital" value={formData.preferredHospital} onChange={(e) => handleInputChange('preferredHospital', e.target.value)} placeholder="Your preferred hospital for emergency care" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                          <Input id="insuranceProvider" value={formData.insuranceProvider} onChange={(e) => handleInputChange('insuranceProvider', e.target.value)} placeholder="Insurance company name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="policyNumber">Policy Number</Label>
                          <Input id="policyNumber" value={formData.policyNumber} onChange={(e) => handleInputChange('policyNumber', e.target.value)} placeholder="Insurance policy number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="policyHolder">Policy Holder</Label>
                          <Input id="policyHolder" value={formData.policyHolder} onChange={(e) => handleInputChange('policyHolder', e.target.value)} placeholder="Name of policy holder" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 5: Legal Authorization */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                      <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                        Legal Authorization
                      </CardTitle>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">Please authorize the types of medical care you consent to receive during the trial. Check all that apply.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="emergencyMedicalCare" checked={formData.emergencyMedicalCare} onCheckedChange={(checked) => handleInputChange('emergencyMedicalCare', !!checked)} />
                          <Label htmlFor="emergencyMedicalCare" className="text-sm leading-normal">Emergency medical care and first aid</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="surgery" checked={formData.surgery} onCheckedChange={(checked) => handleInputChange('surgery', !!checked)} />
                          <Label htmlFor="surgery" className="text-sm leading-normal">Surgery if deemed necessary by medical professionals</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="bloodTransfusions" checked={formData.bloodTransfusions} onCheckedChange={(checked) => handleInputChange('bloodTransfusions', !!checked)} />
                          <Label htmlFor="bloodTransfusions" className="text-sm leading-normal">Blood transfusions if medically necessary</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="dentalTreatment" checked={formData.dentalTreatment} onCheckedChange={(checked) => handleInputChange('dentalTreatment', !!checked)} />
                          <Label htmlFor="dentalTreatment" className="text-sm leading-normal">Emergency dental treatment</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="other" checked={formData.other} onCheckedChange={(checked) => handleInputChange('other', !!checked)} />
                          <Label htmlFor="other" className="text-sm leading-normal">Other (please specify below)</Label>
                        </div>
                      </div>
                      {formData.other && (
                        <div className="space-y-2">
                          <Label htmlFor="otherSpecify">Please specify other authorizations:</Label>
                          <Textarea id="otherSpecify" value={formData.otherSpecify} onChange={(e) => handleInputChange('otherSpecify', e.target.value)} placeholder="Describe any other medical authorizations" rows={2} />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Section 6: Consent and Signature */}
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                      <CardTitle className="text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                        Final Consent & Signature
                      </CardTitle>
                      <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-2">Final consent declarations and your digital signature to confirm participation in the NeuroSAFE PROOF trial.</p>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      {/* Trial Information Confirmation */}
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-4">Welcome to the NeuroSAFE PROOF Clinical Trial. This is a multi-centre, randomised controlled trial evaluating innovative robotic-assisted radical prostatectomy versus standard robotic assisted radical prostatectomy in men with prostate cancer.</p>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="hasReceivedInfo" checked={formData.hasReceivedInfo} onCheckedChange={(checked) => handleInputChange('hasReceivedInfo', !!checked)} />
                          <Label htmlFor="hasReceivedInfo" className="text-sm">Yes, I have received and understood the information about this trial</Label>
                        </div>
                      </div>

                      {/* Consent Declarations */}
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="consentConsent1" checked={formData.consentConsent1} onCheckedChange={(checked) => handleInputChange('consentConsent1', !!checked)} />
                          <Label htmlFor="consentConsent1" className="text-sm leading-normal">I consent to participate in the NeuroSAFE PROOF clinical trial</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="consentConsent2" checked={formData.consentConsent2} onCheckedChange={(checked) => handleInputChange('consentConsent2', !!checked)} />
                          <Label htmlFor="consentConsent2" className="text-sm leading-normal">I understand that my participation is voluntary</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="consentConsent3" checked={formData.consentConsent3} onCheckedChange={(checked) => handleInputChange('consentConsent3', !!checked)} />
                          <Label htmlFor="consentConsent3" className="text-sm leading-normal">I understand the risks and benefits</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="consentConsent4" checked={formData.consentConsent4} onCheckedChange={(checked) => handleInputChange('consentConsent4', !!checked)} />
                          <Label htmlFor="consentConsent4" className="text-sm leading-normal">I can withdraw at any time without prejudice to my care</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="consentConsent5" checked={formData.consentConsent5} onCheckedChange={(checked) => handleInputChange('consentConsent5', !!checked)} />
                          <Label htmlFor="consentConsent5" className="text-sm leading-normal">I consent to data collection and processing for research purposes</Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="consentConsent6" checked={formData.consentConsent6} onCheckedChange={(checked) => handleInputChange('consentConsent6', !!checked)} />
                          <Label htmlFor="consentConsent6" className="text-sm leading-normal">I have received a copy of this consent form and information sheet</Label>
                        </div>
                      </div>

                      {/* Signature and Final Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signature">Digital Signature *</Label>
                          <Input id="signature" value={formData.signature} onChange={(e) => handleInputChange('signature', e.target.value)} placeholder="Type your full name as signature" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="consentDate">Consent Date *</Label>
                          <Input id="consentDate" type="date" value={formData.consentDate} onChange={(e) => handleInputChange('consentDate', e.target.value)} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="isUCLAPatient">Are you a UCLA patient? *</Label>
                          <Select value={formData.isUCLAPatient} onValueChange={(value) => handleInputChange('isUCLAPatient', value)}>
                            <SelectTrigger><SelectValue placeholder="Select yes or no" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hospital">Hospital Location *</Label>
                          <Select value={formData.hospital} onValueChange={(value) => handleInputChange('hospital', value)}>
                            <SelectTrigger><SelectValue placeholder="Select your hospital" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="uclh">University College London Hospital</SelectItem>
                              <SelectItem value="guys">Guy's Hospital</SelectItem>
                              <SelectItem value="imperial">Imperial College Healthcare</SelectItem>
                              <SelectItem value="kings">King's College Hospital</SelectItem>
                              <SelectItem value="barts">Barts Health</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <Button type="submit" className="w-full" size="lg">Submit Consent Form</Button>
                        <p className="text-xs text-muted-foreground text-center mt-2">By submitting, you confirm all information is accurate and complete.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-6">
                    <CardHeader><CardTitle>Study Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg"><h4 className="font-semibold mb-2">NeuroSAFE PROOF</h4><p className="text-sm text-muted-foreground">A multi-centre, randomised controlled trial evaluating innovative robotic-assisted radical prostatectomy vs standard robotic assisted radical prostatectomy in men with prostate cancer.</p></div>
                      <div className="space-y-2"><h4 className="font-semibold">Required Fields</h4><p className="text-sm text-muted-foreground">Please complete all sections to meet eligibility criteria.</p></div>
                      <div className="space-y-2"><h4 className="font-semibold">Need Help?</h4><p className="text-sm text-muted-foreground">Use the AI assistant below for guidance or to fill fields automatically.</p></div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </>
        )}
      </div>

      {/* AI Assistant */}
      <Chatbot
        initialMessages={[
          { id: 1, text: "Hello! I'm here to help you understand the consent form and clinical trial details. What would you like to know?", isBot: true }
        ]}
        infoText={consentFormText}
        context="form"
        onFieldsPatch={(patch) => {
          setFormData((prev) => ({ ...prev, ...patch }));
        }}
        fields={fields}
      />
    </div>
  );
};

export default ConsentForm;


