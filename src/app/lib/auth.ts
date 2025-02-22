// lib/auth.ts
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // Puedes acceder a la información del usuario en result.user
    return result.user;
  } catch (error: unknown) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
}
