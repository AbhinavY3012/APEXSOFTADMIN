import { useState, useEffect, useCallback } from 'react';
import dataService from '../services/dataService';

// Generic hook for fetching data
export const useFirebaseData = (collectionName, orderByField = 'createdAt') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await dataService.getAll(collectionName, orderByField);
    
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error);
      setData([]);
    }
    
    setLoading(false);
  }, [collectionName, orderByField]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Hook for real-time data
export const useFirebaseRealtimeData = (collectionName, orderByField = 'createdAt') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = dataService.onSnapshot(
      collectionName,
      (result) => {
        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.error);
          setData([]);
        }
        setLoading(false);
      },
      orderByField
    );

    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return { data, loading, error };
};

// Specific hooks for different collections
export const useContacts = (realtime = false) => {
  const collectionName = dataService.collections.CONTACTS;
  const realtimeData = useFirebaseRealtimeData(collectionName, 'submittedAt');
  const staticData = useFirebaseData(collectionName, 'submittedAt');
  
  return realtime ? realtimeData : staticData;
};

export const useJobOpenings = (realtime = false) => {
  const collectionName = dataService.collections.JOB_OPENINGS;
  const realtimeData = useFirebaseRealtimeData(collectionName);
  const staticData = useFirebaseData(collectionName);
  
  return realtime ? realtimeData : staticData;
};

export const useJobApplications = (jobId = null, realtime = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await dataService.getJobApplications(jobId);
    
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error);
      setData([]);
    }
    
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    if (!realtime) {
      fetchData();
    }
  }, [fetchData, realtime]);

  useEffect(() => {
    if (realtime) {
      setLoading(true);
      const unsubscribe = dataService.onSnapshotJobApplications(
        (result) => {
          if (result.success) {
            let filteredData = result.data;
            if (jobId) {
              filteredData = result.data.filter(app => app.jobId === jobId);
            }
            setData(filteredData);
            setError(null);
          } else {
            setError(result.error);
            setData([]);
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [jobId, realtime]);

  const refetch = useCallback(() => {
    if (!realtime) {
      fetchData();
    }
  }, [fetchData, realtime]);

  return { data, loading, error, refetch };
};

// Hook for internship applications
export const useInternshipApplications = (realtime = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await dataService.getInternshipApplications();
    
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error);
      setData([]);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!realtime) {
      fetchData();
    }
  }, [fetchData, realtime]);

  useEffect(() => {
    if (realtime) {
      setLoading(true);
      const unsubscribe = dataService.onSnapshotInternshipApplications(
        (result) => {
          if (result.success) {
            setData(result.data);
            setError(null);
          } else {
            setError(result.error);
            setData([]);
          }
          setLoading(false);
        }
      );

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [realtime]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for CRUD operations
export const useFirebaseCRUD = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    const result = await dataService.create(collectionName, data);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [collectionName]);

  const update = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    
    const result = await dataService.update(collectionName, id, data);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [collectionName]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    const result = await dataService.delete(collectionName, id);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [collectionName]);

  return { create, update, remove, loading, error };
};

// Hook for app development requests
export const useAppDevelopmentRequests = (realtime = false) => {
  const collectionName = dataService.collections.APP_DEVELOPMENT_REQUESTS;
  const realtimeData = useFirebaseRealtimeData(collectionName, 'submittedAt');
  const staticData = useFirebaseData(collectionName, 'submittedAt');
  
  return realtime ? realtimeData : staticData;
};

// Hook for iOS development requests
export const useIOSDevelopmentRequests = (realtime = false) => {
  const collectionName = dataService.collections.IOS_DEVELOPMENT_REQUESTS;
  const realtimeData = useFirebaseRealtimeData(collectionName, 'submittedAt');
  const staticData = useFirebaseData(collectionName, 'submittedAt');
  
  return realtime ? realtimeData : staticData;
};

// Hook for Web development requests
export const useWebDevelopmentRequests = (realtime = false) => {
  const collectionName = dataService.collections.WEB_DEVELOPMENT_REQUESTS;
  const realtimeData = useFirebaseRealtimeData(collectionName, 'submittedAt');
  const staticData = useFirebaseData(collectionName, 'submittedAt');
  
  return realtime ? realtimeData : staticData;
};
