import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Subject, Topic, Priority } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { subjectsCollection, topicsCollection } from '../lib/firebase';

interface StoreContextType {
  subjects: Subject[];
  topics: Topic[];
  addSubject: (name: string, priority?: Priority) => void;
  updateSubjectPriority: (id: string, priority: Priority) => void;
  deleteSubject: (id: string) => void;
  addTopic: (subjectId: string, name: string, date?: string) => void;
  scheduleTopicSession: (id: string, date: string) => void;
  removeTopicSession: (topicId: string, date: string) => void;
  setTopicSessions: (topicId: string, dates: string[]) => void;
  deleteTopic: (id: string) => void;
  toggleTopicCompletion: (topicId: string, date: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subjectsLoaded = false;
    let topicsLoaded = false;

    const checkLoaded = () => {
      if (subjectsLoaded && topicsLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeSubjects = onSnapshot(subjectsCollection, (snapshot) => {
      const fetchedSubjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
      setSubjects(fetchedSubjects);
      
      if (!subjectsLoaded) {
        subjectsLoaded = true;
        checkLoaded();
      }
    });

    const unsubscribeTopics = onSnapshot(topicsCollection, (snapshot) => {
      const fetchedTopics = snapshot.docs.map(doc => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          ...data,
          scheduledSessions: data.scheduledSessions || []
        } as Topic;
      });
      setTopics(fetchedTopics);
      
      if (!topicsLoaded) {
        topicsLoaded = true;
        checkLoaded();
      }
    });

    return () => {
      unsubscribeSubjects();
      unsubscribeTopics();
    };
  }, []);

  const addSubject = async (name: string, priority: Priority = 'Medium') => {
    const newId = uuidv4();
    await setDoc(doc(subjectsCollection, newId), { id: newId, name, priority });
  };

  const updateSubjectPriority = async (id: string, priority: Priority) => {
    await updateDoc(doc(subjectsCollection, id), { priority });
  };

  const deleteSubject = async (id: string) => {
    await deleteDoc(doc(subjectsCollection, id));
    // Cascade delete topics
    topics.filter(t => t.subjectId === id).forEach(async (t) => {
      await deleteDoc(doc(topicsCollection, t.id));
    });
  };

  const addTopic = async (subjectId: string, name: string, date?: string) => {
    const newId = uuidv4();
    const scheduledSessions = date ? [{ date, isCompleted: false }] : [];
    await setDoc(doc(topicsCollection, newId), { id: newId, subjectId, name, scheduledSessions });
  };

  const scheduleTopicSession = async (id: string, date: string) => {
    const topic = topics.find(t => t.id === id);
    if (!topic) return;
    if (!topic.scheduledSessions.find(s => s.date === date)) {
      const newSessions = [...topic.scheduledSessions, { date, isCompleted: false }];
      await updateDoc(doc(topicsCollection, id), { scheduledSessions: newSessions });
    }
  };

  const removeTopicSession = async (topicId: string, date: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const newSessions = topic.scheduledSessions.filter(s => s.date !== date);
    await updateDoc(doc(topicsCollection, topicId), { scheduledSessions: newSessions });
  };

  const setTopicSessions = async (topicId: string, dates: string[]) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const newSessions = dates.map(d => {
      const existing = topic.scheduledSessions.find(s => s.date === d);
      return existing ? existing : { date: d, isCompleted: false };
    });
    await updateDoc(doc(topicsCollection, topicId), { scheduledSessions: newSessions });
  };

  const deleteTopic = async (id: string) => {
    await deleteDoc(doc(topicsCollection, id));
  };

  const toggleTopicCompletion = async (topicId: string, date: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const newSessions = topic.scheduledSessions.map(s => 
      s.date === date ? { ...s, isCompleted: !s.isCompleted } : s
    );
    await updateDoc(doc(topicsCollection, topicId), { scheduledSessions: newSessions });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950">
        <div className="spinner-fluffy"></div>
      </div>
    );
  }

  return (
    <StoreContext.Provider
      value={{
        subjects,
        topics,
        addSubject,
        updateSubjectPriority,
        deleteSubject,
        addTopic,
        scheduleTopicSession,
        removeTopicSession,
        setTopicSessions,
        deleteTopic,
        toggleTopicCompletion,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
