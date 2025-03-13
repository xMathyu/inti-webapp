"use client";

import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../lib/firebase";
import { signInWithGoogle, saveUserToFirestore } from "../lib/auth";

export default function AuthPage() {
  // Controla si el usuario está en modo registro o login
  const [isRegister, setIsRegister] = useState(false);

  // Campos comunes para ambos modos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos adicionales para el registro
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      try {
        // Crea la cuenta con email y password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Actualiza el perfil con nombre y apellido
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        // Guarda el usuario en Firestore utilizando la función común
        await saveUserToFirestore(user, { phone });

        router.push("/");
      } catch (err: unknown) {
        setError((err as Error).message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      } catch (err: unknown) {
        setError((err as Error).message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-800">
            {isRegister ? "Registrati" : "Accedi"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <Label htmlFor="firstName" className="text-green-800">
                    Nome
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Inserisci il tuo nome"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-green-800">
                    Cognome
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Inserisci il tuo cognome"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-green-800">
                    Telefono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Inserisci il tuo numero di telefono"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email" className="text-green-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inserisci la tua email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-green-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la tua password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isRegister ? "Registrati con Email" : "Accedi con Email"}
            </Button>
          </form>
          <Separator className="my-4" />
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white border-transparent"
          >
            <FcGoogle size={20} />
            {isRegister ? "Registrati con Google" : "Accedi con Google"}
          </Button>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-green-600 hover:underline"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister
                ? "Hai già un account? Accedi"
                : "Non hai un account? Registrati"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
