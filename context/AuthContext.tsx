import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile as firebaseUpdateProfile, signInAnonymously, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginAnonymously: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin Email Configuration
  const ADMIN_EMAIL = 'mdmahbubsite@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if admin
        const isUserAdmin = firebaseUser.email === ADMIN_EMAIL;
        setIsAdmin(isUserAdmin);

        if (firebaseUser.isAnonymous) {
             const guestUser: User = {
                uid: firebaseUser.uid,
                name: 'Guest',
                email: 'guest@nexustools.com',
                plan: 'free',
                memberSince: new Date().toISOString()
             };
             setUser(guestUser);
             setLoading(false);
             return;
        }

        // Fetch user profile from Firestore
        const docRef = doc(db, 'users', firebaseUser.uid);
        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUser({ uid: firebaseUser.uid, ...docSnap.data() } as User);
            } else {
              // Create default doc if it doesn't exist (e.g. first social login)
              const basicUser: User = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=random`,
                plan: 'free',
                memberSince: new Date().toISOString()
              };
              
              await setDoc(docRef, basicUser);
              setUser(basicUser);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Fallback for permission errors or network issues
             const basicUser: User = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                plan: 'free',
                memberSince: new Date().toISOString()
              };
              setUser(basicUser);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(cred.user, { displayName: name });
      
      // Create Firestore Document
      const newUser: User = {
          uid: cred.user.uid,
          name: name,
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=0ea5e9&color=fff`,
          plan: 'free',
          memberSince: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', cred.user.uid), newUser);
      setUser(newUser);
  };

  const loginAnonymously = async () => {
      await signInAnonymously(auth);
  };

  const loginWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
  };

  const loginWithGithub = async () => {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
        const updated = { ...user, ...data };
        setUser(updated);
        // Sync with Firestore (optimistic update)
        if(user.uid && !user.uid.startsWith('mock')) {
            setDoc(doc(db, 'users', user.uid), data, { merge: true });
        }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, loginAnonymously, loginWithGoogle, loginWithGithub, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};