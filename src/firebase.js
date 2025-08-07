// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDM3i689ESBlBx2pEEy05MZ5c3IY3PQp3w',
  authDomain: 'my-workout-tracker-app-d8d61.firebaseapp.com',
  databaseURL: 'https://my-workout-tracker-app-d8d61-default-rtdb.firebaseio.com',
  projectId: 'my-workout-tracker-app-d8d61',
  storageBucket: 'my-workout-tracker-app-d8d61.appspot.com',
  messagingSenderId: '321079278500',
  appId: '1:321079278500:web:587525f6cea6829745df31'
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);