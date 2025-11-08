import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      addLog('Starting Firebase connection test...');
      
      // Test 1: Check Firebase instance
      addLog(`Firebase DB instance: ${db ? 'OK' : 'FAILED'}`);
      if (!db) {
        setStatus('FAILED: No Firebase DB instance');
        return;
      }

      // Test 2: Check app configuration
      addLog(`Firebase app ID: ${db.app.options.projectId}`);
      addLog(`Firebase app auth domain: ${db.app.options.authDomain}`);

      // Test 3: Try to create a collection reference
      const contactsRef = collection(db, 'contacts');
      addLog(`Collection reference created: ${contactsRef ? 'OK' : 'FAILED'}`);

      // Test 4: Try to read from collection
      addLog('Attempting to read from contacts collection...');
      const snapshot = await getDocs(contactsRef);
      addLog(`Read operation: SUCCESS`);
      addLog(`Documents found: ${snapshot.size}`);

      // Test 5: List all documents
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          addLog(`Document ID: ${doc.id}`);
          addLog(`Document data: ${JSON.stringify(doc.data())}`);
        });
      } else {
        addLog('No documents found in collection');
      }

      setStatus('ALL TESTS PASSED');
      
    } catch (error) {
      addLog(`ERROR: ${error.code} - ${error.message}`);
      setStatus(`FAILED: ${error.message}`);
    }
  };

  const addTestDocument = async () => {
    try {
      addLog('Adding test document...');
      const docRef = await addDoc(collection(db, 'contacts'), {
        name: 'Firebase Test Contact',
        email: 'test@firebase.com',
        subject: 'Firebase Connection Test',
        message: 'This is a test message to verify Firebase connectivity',
        status: 'new',
        submittedAt: new Date(),
        source: 'firebase-test'
      });
      addLog(`Test document added with ID: ${docRef.id}`);
      
      // Re-run the connection test
      await testFirebaseConnection();
    } catch (error) {
      addLog(`Error adding test document: ${error.code} - ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Firebase Connection Test
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Connection Status
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.includes('PASSED') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : status.includes('FAILED')
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}>
              {status}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={testFirebaseConnection}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Re-test Connection
            </button>
            <button
              onClick={addTestDocument}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Add Test Document
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Logs
          </h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {logs.join('\n')}
            </pre>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
            Troubleshooting Steps:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Check if Firebase project is properly configured</li>
            <li>2. Verify Firestore database is created in Firebase Console</li>
            <li>3. Check Firestore security rules allow read/write operations</li>
            <li>4. Ensure internet connection is working</li>
            <li>5. Check browser console for additional error details</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
