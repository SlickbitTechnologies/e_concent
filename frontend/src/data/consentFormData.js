// Consent form text content for the AI assistant
export const consentFormText = `
NeuroSAFE PROOF Clinical Trial Consent Form

This is a multi-centre, randomised controlled trial evaluating innovative robotic-assisted radical prostatectomy versus standard robotic assisted radical prostatectomy in men with prostate cancer.

SECTIONS:
1. Basic Information - Personal details including name, date of birth, contact information
2. Emergency Contact - Emergency contact person details and relationship
3. Medical Information - Health conditions, allergies, medications, tetanus vaccination
4. Medical Care Information - Healthcare providers, insurance information
5. Legal Authorization - Medical care authorizations and consent checkboxes
6. Final Consent & Signature - Trial consent declarations and digital signature

IMPORTANT REQUIREMENTS:
- All sections must be completed sequentially
- Required fields are marked with *
- Each section must be marked complete before proceeding to the next
- Final submission requires all sections to be completed
`;

// Form fields configuration for the AI assistant
export const fields = [
  // Section 1: Basic Information
  { name: 'firstName', label: 'First Name', type: 'text', required: true, section: 1 },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, section: 1 },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, section: 1 },
  { name: 'age', label: 'Age', type: 'number', required: true, section: 1 },
  { name: 'sex', label: 'Sex', type: 'select', required: true, section: 1, options: ['Male', 'Female', 'Other'] },
  { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, section: 1 },
  { name: 'email', label: 'Email Address', type: 'email', required: true, section: 1 },
  { name: 'address', label: 'Home Address', type: 'textarea', required: true, section: 1 },

  // Section 2: Emergency Contact
  { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', required: true, section: 2 },
  { name: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'tel', required: true, section: 2 },
  { name: 'emergencyContactRelationship', label: 'Relationship to You', type: 'text', required: true, section: 2 },

  // Section 3: Medical Information
  { name: 'healthConditions', label: 'Current Health Conditions', type: 'textarea', required: false, section: 3 },
  { name: 'allergies', label: 'Allergies', type: 'textarea', required: false, section: 3 },
  { name: 'currentMedications', label: 'Current Medications', type: 'textarea', required: false, section: 3 },
  { name: 'lastTetanusShot', label: 'Last Tetanus Shot', type: 'date', required: false, section: 3 },

  // Section 4: Medical Care Information
  { name: 'physicianName', label: 'Primary Physician Name', type: 'text', required: false, section: 4 },
  { name: 'physicianPhone', label: 'Physician Phone', type: 'tel', required: false, section: 4 },
  { name: 'dentistName', label: 'Dentist Name', type: 'text', required: false, section: 4 },
  { name: 'dentistPhone', label: 'Dentist Phone', type: 'tel', required: false, section: 4 },
  { name: 'preferredHospital', label: 'Preferred Hospital', type: 'text', required: false, section: 4 },
  { name: 'insuranceProvider', label: 'Insurance Provider', type: 'text', required: false, section: 4 },
  { name: 'policyNumber', label: 'Policy Number', type: 'text', required: false, section: 4 },
  { name: 'policyHolder', label: 'Policy Holder', type: 'text', required: false, section: 4 },

  // Section 5: Legal Authorization
  { name: 'emergencyMedicalCare', label: 'Emergency medical care and first aid', type: 'checkbox', required: false, section: 5 },
  { name: 'surgery', label: 'Surgery if deemed necessary by medical professionals', type: 'checkbox', required: false, section: 5 },
  { name: 'bloodTransfusions', label: 'Blood transfusions if medically necessary', type: 'checkbox', required: false, section: 5 },
  { name: 'dentalTreatment', label: 'Emergency dental treatment', type: 'checkbox', required: false, section: 5 },
  { name: 'other', label: 'Other (please specify)', type: 'checkbox', required: false, section: 5 },
  { name: 'otherSpecify', label: 'Please specify other authorizations', type: 'textarea', required: false, section: 5 },

  // Section 6: Final Consent & Signature
  { name: 'hasReceivedInfo', label: 'Yes, I have received and understood the information about this trial', type: 'checkbox', required: true, section: 6 },
  { name: 'consentConsent1', label: 'I consent to participate in the NeuroSAFE PROOF clinical trial', type: 'checkbox', required: true, section: 6 },
  { name: 'consentConsent2', label: 'I understand that my participation is voluntary', type: 'checkbox', required: true, section: 6 },
  { name: 'consentConsent3', label: 'I understand the risks and benefits', type: 'checkbox', required: true, section: 6 },
  { name: 'consentConsent4', label: 'I can withdraw at any time without prejudice to my care', type: 'checkbox', required: true, section: 6 },
  { name: 'consentConsent5', label: 'I consent to data collection and processing for research purposes', type: 'checkbox', required: true, section: 6 },
  { name: 'consentConsent6', label: 'I have received a copy of this consent form and information sheet', type: 'checkbox', required: true, section: 6 },
  { name: 'signature', label: 'Digital Signature', type: 'text', required: true, section: 6 },
  { name: 'consentDate', label: 'Consent Date', type: 'date', required: true, section: 6 },
  { name: 'isUCLAPatient', label: 'Are you a UCLA patient?', type: 'select', required: true, section: 6, options: ['yes', 'no'] },
  { name: 'hospital', label: 'Hospital Location', type: 'select', required: true, section: 6, options: ['uclh', 'guys', 'imperial', 'kings', 'barts'] }
];
