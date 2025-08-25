import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const PARTICIPANTS_COLLECTION = 'participants';

// Save participant consent form data to Firestore
export const saveParticipantToFirestore = async (participantData) => {
  try {
    const docRef = await addDoc(collection(db, PARTICIPANTS_COLLECTION), {
      ...participantData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Participant saved to Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving participant to Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Get all participants from Firestore
export const getParticipantsFromFirestore = async () => {
  try {
    const q = query(
      collection(db, PARTICIPANTS_COLLECTION), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const participants = [];
    querySnapshot.forEach((doc) => {
      participants.push({
        firestoreId: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString(),
        submissionDate: doc.data().submissionDate || doc.data().createdAt?.toDate().toISOString()
      });
    });
    
    console.log('Retrieved participants from Firestore:', participants.length);
    return { success: true, data: participants };
  } catch (error) {
    console.error('Error getting participants from Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Update participant status in Firestore
export const updateParticipantStatusInFirestore = async (firestoreId, status) => {
  try {
    const participantRef = doc(db, PARTICIPANTS_COLLECTION, firestoreId);
    await updateDoc(participantRef, {
      status: status,
      updatedAt: serverTimestamp(),
      ...(status === 'approved' && { approvedDate: serverTimestamp() }),
      ...(status === 'rejected' && { rejectedDate: serverTimestamp() })
    });
    
    console.log('Participant status updated in Firestore:', firestoreId, status);
    return { success: true };
  } catch (error) {
    console.error('Error updating participant status in Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Delete participant from Firestore
export const deleteParticipantFromFirestore = async (firestoreId) => {
  try {
    await deleteDoc(doc(db, PARTICIPANTS_COLLECTION, firestoreId));
    console.log('Participant deleted from Firestore:', firestoreId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting participant from Firestore:', error);
    return { success: false, error: error.message };
  }
};
