import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "@/app/lib/firebase";

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Reference to the user's document in Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // If the user does not exist in Firestore, create it with the default role "user"
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        role: "user",
      });
    }

    return user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
}

export async function saveUserToFirestore(
  user: User,
  additionalData?: Record<string, unknown>
) {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      email: user.email,
      name: user.displayName || "",
      role: "user",
      ...additionalData,
    });
  }
}
