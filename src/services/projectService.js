import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';

const COLLECTION_NAME = 'projects';

export const saveProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving project: ", error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...projectData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating project: ", error);
    throw error;
  }
};

export const getProjectsByStatus = async (status) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME), 
            where("status", "==", status),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching projects by status: ", error);
        throw error;
    }
};
