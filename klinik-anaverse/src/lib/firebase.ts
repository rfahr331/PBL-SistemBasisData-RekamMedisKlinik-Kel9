import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User,
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0895002843",
  appId: "1:838179196751:web:bd86978181cd6ea997ff3a",
  apiKey: "AIzaSyBV-LXi8eDWc4G0j8wtc0uowGTRtSdAzA4",
  authDomain: "gen-lang-client-0895002843.firebaseapp.com",
  storageBucket: "gen-lang-client-0895002843.firebasestorage.app",
  messagingSenderId: "838179196751",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

provider.setCustomParameters({
  prompt: 'select_account'
});

export const googleSignIn = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const emailSignIn = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.warn('Email sign in info/error:', error);
    throw error;
  }
};

export const emailSignUp = async (email: string, password: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.warn('Email sign up info/error:', error);
    throw error;
  }
};

export { onAuthStateChanged };
export type { User };
