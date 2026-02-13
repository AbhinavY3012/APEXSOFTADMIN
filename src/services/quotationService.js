import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'quotations';

export const saveQuotation = async (quotationData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...quotationData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving quotation: ", error);
    throw error;
  }
};

export const getQuotations = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching quotations: ", error);
    throw error;
  }
};

export const deleteQuotation = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting quotation: ", error);
    throw error;
  }
};

export const updateQuotation = async (id, quotationData) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), quotationData);
  } catch (error) {
    console.error("Error updating quotation: ", error);
    throw error;
  }
};
