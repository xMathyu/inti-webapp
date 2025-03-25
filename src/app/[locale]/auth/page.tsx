"use client";

import React, { useState, Suspense } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Loader } from "lucide-react";
import { auth } from "../lib/firebase";
import { signInWithGoogle, saveUserToFirestore } from "../lib/auth";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FirebaseError } from "firebase/app";
import { AuthError } from "../interfaces/interfaces";

import { useTranslations } from "next-intl";

function AuthForm() {
  const t = useTranslations("SignIn/Register");
  const [isRegister, setIsRegister] = useState(false);

  // Common fields for both modes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Additional fields for registration
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, { displayName: `${firstName} ${lastName}` });
        await saveUserToFirestore(user, { phone });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push(redirect || "/");
    } catch (err) {
      const errorTyped = err as FirebaseError | AuthError;

      switch (errorTyped.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Email o password errata.");
          break;
        case "auth/email-already-in-use":
          setError("Questa e-mail è già registrata.");
          break;
        case "auth/invalid-email":
          setError("L'e-mail non è valida.");
          break;
        default:
          setError("Si è verificato un errore. Si prega di riprovare.");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      router.push(redirect || "/");
    } catch (err) {
      const errorTyped = err as FirebaseError | AuthError;
      setError(errorTyped.message || "Si è verificato un errore con Google.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md shadow-xl rounded-3xl p-4">
      <CardHeader className="flex flex-col items-center gap-4">
        <Image
          src="/logos/logos_pequeno.svg"
          alt="Inti Logo"
          width={80}
          height={80}
        />
        <CardTitle className="text-green-800 text-2xl font-bold">
        {isRegister ? t("Register") : t("SignIn")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-sm text-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence initial={false} mode="wait">
            {isRegister && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
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
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-green-800">
                  {t("Last_Name")}
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("Last_Name_PH")}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-green-800">
                  {t("Telephone")}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("Telephone_PH")}
                    required
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Label htmlFor="email" className="text-green-800">
              {t("Email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Email_PH")}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-green-800">
              {t("Password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Password_PH")}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : isRegister ? (
              t("Register_AccessButton")
            ) : (
              t("Login_AccessButton")
            )}
          </Button>
        </form>

        <Separator className="my-4" />

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <FcGoogle className="w-5 h-5" />
              <span>{t("Google_AccessButton")}</span>
            </>
          )}
        </Button>

        <div className="mt-4 text-center">
          <motion.button
            type="button"
            className="text-green-700 hover:underline text-sm"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            disabled={isLoading}
            whileTap={{ scale: 0.95 }}
          >
            {isRegister
              ? t("AlreadyRegistered")
              : t("NotRegistered")}
          </motion.button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthPage() {
  const t = useTranslations("SignIn/Register");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-50 p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader className="h-8 w-8 animate-spin text-green-800" />
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </div>
  );
}
