import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";

const db = getFirestore();

export async function signInWithGoogle() {
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
  } catch (error: unknown) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
}
