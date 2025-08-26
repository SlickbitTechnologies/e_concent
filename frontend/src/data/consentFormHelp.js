// Consent form field help content for chatbot guidance
export const consentFormHelp = {
  // Personal Information Section
  firstName: {
    section: "Personal Information",
    guidance: "Enter your legal first name as it appears on your government-issued ID. This should match your medical records and insurance information.",
    example: "Example: John, Mary, Michael"
  },
  lastName: {
    section: "Personal Information", 
    guidance: "Enter your legal last name (surname/family name) as it appears on your government-issued ID.",
    example: "Example: Smith, Johnson, Williams"
  },
  email: {
    section: "Personal Information",
    guidance: "Provide a valid email address where you can receive study updates, appointment reminders, and important communications.",
    example: "Example: john.smith@email.com"
  },
  phoneNumber: {
    section: "Personal Information",
    guidance: "Enter your primary phone number including area code. This will be used for appointment scheduling and urgent communications.",
    example: "Example: (555) 123-4567"
  },
  age: {
    section: "Personal Information",
    guidance: "Enter your current age in years. This helps determine study eligibility and appropriate care protocols.",
    example: "Example: 25, 45, 67"
  },
  sex: {
    section: "Personal Information",
    guidance: "Select your biological sex. This information is needed for medical safety and study requirements.",
    example: "Options: Male, Female, Other"
  },
  dateOfBirth: {
    section: "Personal Information",
    guidance: "Enter your date of birth in MM/DD/YYYY format. This helps verify your identity and determine study eligibility.",
    example: "Example: 01/15/1985"
  },
  address: {
    section: "Personal Information",
    guidance: "Provide your complete current address including street, city, state, and ZIP code for study correspondence.",
    example: "Example: 123 Main St, Anytown, ST 12345"
  },

  // Medical History Section
  healthConditions: {
    section: "Medical History",
    guidance: "List any current or past significant medical conditions, chronic illnesses, or ongoing health issues. Include conditions like diabetes, heart disease, mental health conditions, etc. If none, write 'None' or 'No significant medical conditions'.",
    example: "Example: Type 2 diabetes, hypertension, anxiety disorder"
  },
  allergies: {
    section: "Medical History", 
    guidance: "List all known allergies including medications, foods, environmental allergens, or materials. Include the type of reaction if known. If no allergies, write 'None' or 'No known allergies'.",
    example: "Example: Penicillin (rash), peanuts (anaphylaxis), seasonal pollen"
  },
  currentMedications: {
    section: "Medical History",
    guidance: "List all medications you currently take including prescription drugs, over-the-counter medications, vitamins, and supplements. Include dosages if known. If none, write 'None'.",
    example: "Example: Metformin 500mg twice daily, Vitamin D 1000IU daily"
  },
  lastTetanusShot: {
    section: "Medical History",
    guidance: "Enter the date of your last tetanus vaccination. This is important for safety during medical procedures.",
    example: "Example: 2020-03-15 or approximate year if unsure"
  },
  physicianName: {
    section: "Healthcare Providers",
    guidance: "Enter the name of your primary care physician or family doctor.",
    example: "Example: Dr. Sarah Johnson, Dr. Michael Chen"
  },
  physicianPhone: {
    section: "Healthcare Providers",
    guidance: "Enter your primary physician's office phone number.",
    example: "Example: (555) 123-4567"
  },
  dentistName: {
    section: "Healthcare Providers",
    guidance: "Enter the name of your dentist if you have one.",
    example: "Example: Dr. Robert Smith, Dr. Lisa Brown"
  },
  dentistPhone: {
    section: "Healthcare Providers",
    guidance: "Enter your dentist's office phone number.",
    example: "Example: (555) 987-6543"
  },
  preferredHospital: {
    section: "Healthcare Providers",
    guidance: "Enter your preferred hospital for emergency care or procedures.",
    example: "Example: City General Hospital, St. Mary's Medical Center"
  },
  insuranceProvider: {
    section: "Insurance Information",
    guidance: "Enter the name of your health insurance company.",
    example: "Example: Blue Cross Blue Shield, Aetna, Kaiser Permanente"
  },
  policyNumber: {
    section: "Insurance Information",
    guidance: "Enter your insurance policy or member ID number.",
    example: "Example: ABC123456789"
  },
  policyHolder: {
    section: "Insurance Information",
    guidance: "Enter the name of the person who holds the insurance policy (may be yourself or a family member).",
    example: "Example: John Smith, Mary Johnson"
  },

  // Emergency Contact Section
  emergencyContactName: {
    section: "Emergency Contact",
    guidance: "Provide the full name of someone who can be contacted in case of emergency during the study. This should be a family member or close friend.",
    example: "Example: Jane Smith (spouse), Robert Johnson (brother)"
  },
  emergencyContactPhone: {
    section: "Emergency Contact",
    guidance: "Enter the phone number of your emergency contact. Make sure this person is aware they are listed as your emergency contact.",
    example: "Example: (555) 987-6543"
  },
  emergencyContactRelationship: {
    section: "Emergency Contact",
    guidance: "Specify your relationship to the emergency contact person.",
    example: "Example: Spouse, Parent, Sibling, Friend"
  },

  // Legal Authorization Section
  emergencyMedicalCare: {
    section: "Legal Authorization",
    guidance: "Check this box to authorize emergency medical care if needed during the study. This allows medical staff to provide immediate care.",
    required: false
  },
  surgery: {
    section: "Legal Authorization",
    guidance: "Check this box to authorize surgical procedures if medically necessary during the study.",
    required: false
  },
  bloodTransfusions: {
    section: "Legal Authorization",
    guidance: "Check this box to authorize blood transfusions if medically necessary during the study.",
    required: false
  },
  dentalTreatment: {
    section: "Legal Authorization",
    guidance: "Check this box to authorize emergency dental treatment if needed during the study.",
    required: false
  },
  other: {
    section: "Legal Authorization",
    guidance: "Check this box if you want to authorize other specific medical procedures. Please specify in the text field below.",
    required: false
  },
  otherSpecify: {
    section: "Legal Authorization",
    guidance: "If you checked 'Other' above, please specify what other medical procedures you authorize.",
    example: "Example: Physical therapy, diagnostic imaging"
  },
  // Final Consent Section
  isUCLAPatient: {
    section: "Final Consent",
    guidance: "Select whether you are currently a UCLA patient. This helps determine your care coordination.",
    example: "Options: Yes or No"
  },
  hospital: {
    section: "Final Consent",
    guidance: "Select the hospital where you will participate in this study.",
    example: "Choose from the available hospital options"
  },
  hasReceivedInfo: {
    section: "Final Consent",
    guidance: "Check this box to confirm you have received and read all study information materials.",
    required: true
  },
  consentConsent1: {
    section: "Final Consent",
    guidance: "Check this box to give your informed consent to participate in this clinical trial.",
    required: true
  },
  consentConsent2: {
    section: "Final Consent",
    guidance: "Check this box to confirm you understand that participation is voluntary.",
    required: true
  },
  consentConsent3: {
    section: "Final Consent",
    guidance: "Check this box to confirm you understand the risks and benefits of the study.",
    required: true
  },
  consentConsent4: {
    section: "Final Consent",
    guidance: "Check this box to confirm you understand your right to withdraw from the study at any time.",
    required: true
  },
  consentConsent5: {
    section: "Final Consent",
    guidance: "Check this box to give consent for data collection and use for research purposes.",
    required: true
  },
  consentConsent6: {
    section: "Final Consent",
    guidance: "Check this box to confirm you have received a copy of this consent form.",
    required: true
  },
  signature: {
    section: "Final Consent",
    guidance: "Enter your full legal name as your digital signature to complete the consent process.",
    example: "Example: John Michael Smith",
    required: true
  },
  consentDate: {
    section: "Final Consent",
    guidance: "This is automatically set to today's date when you submit the form.",
    required: true
  },

  // Study-Specific Information
  participationReason: {
    section: "Study Information",
    guidance: "Briefly explain why you are interested in participating in this clinical trial. What motivated you to join this study?",
    example: "Example: Interested in contributing to medical research, seeking new treatment options"
  },
  availabilitySchedule: {
    section: "Study Information", 
    guidance: "Describe your general availability for study visits and procedures. Include preferred days/times and any scheduling constraints.",
    example: "Example: Available weekday mornings, prefer Tuesday/Thursday appointments"
  }
};

// Section descriptions for general guidance
export const sectionDescriptions = {
  "Personal Information": "This section collects your basic contact and identification information needed for study enrollment and communication.",
  "Medical History": "This section gathers information about your health background to ensure the study is safe for you and to understand any factors that might affect the research.",
  "Emergency Contact": "This section identifies someone we can contact in case of emergency during your participation in the study.",
  "Healthcare Providers": "This section collects information about your current healthcare providers for coordination of care during the study.",
  "Insurance Information": "This section gathers your health insurance details for billing and coverage coordination.",
  "Legal Authorization": "This section contains authorizations for various medical procedures that may be needed during the study.",
  "Final Consent": "This section contains the final consent agreements and your digital signature to complete enrollment."
};

// Quick help responses for common questions
export const quickResponses = {
  "what information do i need": "You'll need: personal contact information, medical history including current medications and allergies, emergency contact details, and to review consent agreements.",
  "how long does this take": "The consent form typically takes 15-20 minutes to complete thoroughly. Take your time to read each section carefully.",
  "is my information secure": "Yes, all your information is encrypted and stored securely. Only authorized research staff will have access to your data for study purposes.",
  "can i save and continue later": "Yes, your progress is automatically saved as you complete each section. You can return to finish the form later.",
  "what if i have questions": "You can ask me about any section or field, contact the research team directly, or speak with a study coordinator before signing.",
  "can i change my mind": "Yes, participation is voluntary. You can withdraw from the study at any time without affecting your medical care."
};
