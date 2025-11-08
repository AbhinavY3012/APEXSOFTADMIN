import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query, 
  where,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase.js';

class DataService {
  constructor() {
    this.collections = {
      CONTACTS: 'contacts',
      JOB_OPENINGS: 'jobOpenings',
      JOB_APPLICATIONS: 'jobApplications',
      INTERNSHIP_PROGRAMS: 'internshipPrograms',
      INTERNSHIP_APPLICATIONS: 'internshipApplications',
      PORTFOLIO_ITEMS: 'portfolioItems',
      BLOG_POSTS: 'blogPosts',
      SERVICES: 'services',
      TESTIMONIALS: 'testimonials',
      TEAM_MEMBERS: 'teamMembers',
      SETTINGS: 'settings',
      APP_DEVELOPMENT_REQUESTS: 'appDevelopmentRequests',
      IOS_DEVELOPMENT_REQUESTS: 'iosDevelopmentRequests',
      WEB_DEVELOPMENT_REQUESTS: 'webDevelopmentRequests'
    };
  }

  // Generic CRUD operations
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  async getAll(collectionName, orderByField = 'createdAt', orderDirection = 'desc') {
    try {
      let q;
      try {
        q = query(collection(db, collectionName), orderBy(orderByField, orderDirection));
      } catch (orderError) {
        console.warn(`OrderBy failed for ${collectionName}, trying without ordering:`, orderError);
        q = collection(db, collectionName);
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
        });
      });
      
      return { success: true, data: documents };
    } catch (error) {
      console.error(`Error fetching documents from ${collectionName}:`, error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          success: true,
          data: {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
          }
        };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      console.error(`Error fetching document ${id} from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  }

  async getWhere(collectionName, field, operator, value, orderByField = 'createdAt') {
    try {
      const q = query(
        collection(db, collectionName),
        where(field, operator, value),
        orderBy(orderByField, 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        documents.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
        });
      });
      
      return { success: true, data: documents };
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // Real-time listener
  onSnapshot(collectionName, callback, orderByField = 'createdAt') {
    try {
      let q;
      try {
        q = query(collection(db, collectionName), orderBy(orderByField, 'desc'));
      } catch (orderError) {
        q = collection(db, collectionName);
      }
      
      return onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          documents.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
          });
        });
        callback({ success: true, data: documents });
      }, (error) => {
        console.error(`Error in snapshot listener for ${collectionName}:`, error);
        callback({ success: false, error: error.message, data: [] });
      });
    } catch (error) {
      console.error(`Error setting up snapshot listener for ${collectionName}:`, error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  onSnapshotJobApplications(callback) {
    console.log('Setting up job applications real-time listener...');
    try {
      const q = collection(db, this.collections.JOB_APPLICATIONS);
      
      return onSnapshot(q, (querySnapshot) => {
        console.log('Job applications snapshot received, size:', querySnapshot.size);
        const documents = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Job application document:', doc.id, data);
          documents.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
          });
        });
        
        // Sort in memory by submittedAt descending
        documents.sort((a, b) => b.submittedAt - a.submittedAt);
        
        console.log('Processed job applications:', documents.length, documents);
        callback({ success: true, data: documents });
      }, (error) => {
        console.error('Job applications real-time listener error:', error);
        callback({ success: false, error: error.message, data: [] });
      });
    } catch (error) {
      console.error('Error setting up job applications real-time listener:', error);
      callback({ success: false, error: error.message, data: [] });
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Contacts
  async getContacts() {
    return this.getAll(this.collections.CONTACTS, 'submittedAt');
  }

  async createContact(contactData) {
    return this.create(this.collections.CONTACTS, {
      ...contactData,
      submittedAt: serverTimestamp(),
      status: 'new'
    });
  }

  async updateContactStatus(contactId, status) {
    return this.update(this.collections.CONTACTS, contactId, { status });
  }

  // Job Openings
  async getJobOpenings() {
    return this.getAll(this.collections.JOB_OPENINGS);
  }

  async createJobOpening(jobData) {
    return this.create(this.collections.JOB_OPENINGS, {
      ...jobData,
      status: 'active',
      applicationsCount: 0
    });
  }

  async updateJobOpening(jobId, jobData) {
    return this.update(this.collections.JOB_OPENINGS, jobId, jobData);
  }

  async deleteJobOpening(jobId) {
    return this.delete(this.collections.JOB_OPENINGS, jobId);
  }

  // Job Applications
  async getJobApplications(jobId = null) {
    console.log('getJobApplications called with jobId:', jobId);
    if (jobId) {
      return this.getWhere(this.collections.JOB_APPLICATIONS, 'jobId', '==', jobId);
    }
    // Get all applications without ordering to avoid index issues
    try {
      const q = collection(db, this.collections.JOB_APPLICATIONS);
      console.log('Fetching from collection:', this.collections.JOB_APPLICATIONS);
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot size:', querySnapshot.size);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Document found:', doc.id, data);
        documents.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
        });
      });
      
      // Sort in memory by submittedAt descending
      documents.sort((a, b) => b.submittedAt - a.submittedAt);
      
      console.log('Returning job applications:', documents.length, documents);
      return { success: true, data: documents };
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async createJobApplication(applicationData) {
    return this.create(this.collections.JOB_APPLICATIONS, {
      ...applicationData,
      status: 'pending'
    });
  }

  async updateApplicationStatus(applicationId, status) {
    return this.update(this.collections.JOB_APPLICATIONS, applicationId, { status });
  }

  // Internship Applications
  async getInternshipApplications() {
    console.log('getInternshipApplications called');
    try {
      const q = collection(db, this.collections.INTERNSHIP_APPLICATIONS);
      console.log('Fetching from collection:', this.collections.INTERNSHIP_APPLICATIONS);
      const querySnapshot = await getDocs(q);
      console.log('Internship applications query snapshot size:', querySnapshot.size);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Internship application document found:', doc.id, data);
        documents.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
        });
      });
      
      // Sort in memory by submittedAt descending
      documents.sort((a, b) => b.submittedAt - a.submittedAt);
      
      console.log('Returning internship applications:', documents.length, documents);
      return { success: true, data: documents };
    } catch (error) {
      console.error('Error fetching internship applications:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  onSnapshotInternshipApplications(callback) {
    console.log('Setting up internship applications real-time listener...');
    try {
      const q = collection(db, this.collections.INTERNSHIP_APPLICATIONS);
      
      return onSnapshot(q, (querySnapshot) => {
        console.log('Internship applications snapshot received, size:', querySnapshot.size);
        const documents = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Internship application document:', doc.id, data);
          documents.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate() || new Date()
          });
        });
        
        // Sort in memory by submittedAt descending
        documents.sort((a, b) => b.submittedAt - a.submittedAt);
        
        console.log('Processed internship applications:', documents.length, documents);
        callback({ success: true, data: documents });
      }, (error) => {
        console.error('Internship applications real-time listener error:', error);
        callback({ success: false, error: error.message, data: [] });
      });
    } catch (error) {
      console.error('Error setting up internship applications real-time listener:', error);
      callback({ success: false, error: error.message, data: [] });
      return () => {}; // Return empty unsubscribe function
    }
  }

  async createInternshipApplication(applicationData) {
    return this.create(this.collections.INTERNSHIP_APPLICATIONS, {
      ...applicationData,
      status: 'pending'
    });
  }

  async updateInternshipApplicationStatus(applicationId, status) {
    return this.update(this.collections.INTERNSHIP_APPLICATIONS, applicationId, { status });
  }

  // App Development Requests
  async getAppDevelopmentRequests() {
    return this.getAll(this.collections.APP_DEVELOPMENT_REQUESTS, 'submittedAt');
  }

  async createAppDevelopmentRequest(requestData) {
    return this.create(this.collections.APP_DEVELOPMENT_REQUESTS, {
      ...requestData,
      submittedAt: serverTimestamp(),
      status: 'new',
      priority: 'medium'
    });
  }

  async updateAppDevelopmentRequestStatus(requestId, status) {
    return this.update(this.collections.APP_DEVELOPMENT_REQUESTS, requestId, { status });
  }

  async updateAppDevelopmentRequestPriority(requestId, priority) {
    return this.update(this.collections.APP_DEVELOPMENT_REQUESTS, requestId, { priority });
  }

  // iOS Development Requests
  async getIOSDevelopmentRequests() {
    return this.getAll(this.collections.IOS_DEVELOPMENT_REQUESTS, 'submittedAt');
  }

  async createIOSDevelopmentRequest(requestData) {
    return this.create(this.collections.IOS_DEVELOPMENT_REQUESTS, {
      ...requestData,
      submittedAt: serverTimestamp(),
      status: 'new',
      priority: 'medium'
    });
  }

  async updateIOSDevelopmentRequestStatus(requestId, status) {
    return this.update(this.collections.IOS_DEVELOPMENT_REQUESTS, requestId, { status });
  }

  async updateIOSDevelopmentRequestPriority(requestId, priority) {
    return this.update(this.collections.IOS_DEVELOPMENT_REQUESTS, requestId, { priority });
  }

  // Web Development Requests
  async getWebDevelopmentRequests() {
    return this.getAll(this.collections.WEB_DEVELOPMENT_REQUESTS, 'submittedAt');
  }

  async createWebDevelopmentRequest(requestData) {
    return this.create(this.collections.WEB_DEVELOPMENT_REQUESTS, {
      ...requestData,
      submittedAt: serverTimestamp(),
      status: 'new',
      priority: 'medium'
    });
  }

  async updateWebDevelopmentRequestStatus(requestId, status) {
    return this.update(this.collections.WEB_DEVELOPMENT_REQUESTS, requestId, { status });
  }

  async updateWebDevelopmentRequestPriority(requestId, priority) {
    return this.update(this.collections.WEB_DEVELOPMENT_REQUESTS, requestId, { priority });
  }
}

// Export singleton instance
const dataService = new DataService();
export default dataService;
