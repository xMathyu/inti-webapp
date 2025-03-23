import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "@/app/lib/firebase";
import { createStripeCustomer } from "./stripe";

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Reference to the user's document in Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Si el usuario no existe, creamos el Customer en Stripe
      const stripeCustomerId = await createStripeCustomer(
        user.email || "",
        user.uid || ""
      );

      // Guardamos el usuario en Firestore con su Stripe Customer ID
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        role: "user",
        stripeCustomerId
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
    // Crear el Customer en Stripe
    const stripeCustomerId = await createStripeCustomer(
      user.email || "",
      user.uid || ""
    );

    // Guardar el usuario en Firestore con su Stripe Customer ID
    await setDoc(userRef, {
      email: user.email,
      name: user.displayName || "",
      role: "user",
      stripeCustomerId,
      ...additionalData
    });
  }
}
