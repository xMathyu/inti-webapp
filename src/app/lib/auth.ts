import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "@/app/lib/firebase";

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Referencia al documento del usuario en Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Si el usuario no existe en Firestore, lo creamos con el rol "user" por defecto
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
