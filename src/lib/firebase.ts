import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import type { City, Entry } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);

// Cities
export async function getCities(): Promise<City[]> {
  const snap = await getDocs(collection(db, "cities"));
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() ?? new Date(),
  })) as City[];
}

export async function addCity(city: Omit<City, "id" | "createdAt" | "entryCount">) {
  const docRef = await addDoc(collection(db, "cities"), {
    ...city,
    entryCount: 0,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Entries
export async function getEntries(cityId?: string): Promise<Entry[]> {
  const q = cityId
    ? query(collection(db, "entries"), where("cityId", "==", cityId), orderBy("visitDate", "desc"))
    : query(collection(db, "entries"), orderBy("visitDate", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    visitDate: d.data().visitDate?.toDate() ?? new Date(),
    createdAt: d.data().createdAt?.toDate() ?? new Date(),
  })) as Entry[];
}

export async function addEntry(
  entry: Omit<Entry, "id" | "createdAt">,
) {
  const docRef = await addDoc(collection(db, "entries"), {
    ...entry,
    visitDate: Timestamp.fromDate(entry.visitDate),
    createdAt: Timestamp.now(),
  });
  // Increment city entry count
  const cityRef = doc(db, "cities", entry.cityId);
  await updateDoc(cityRef, { entryCount: increment(1) });
  return docRef.id;
}

// Image upload
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
