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

    if (isRegister) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        await saveUserToFirestore(user, { phone });

        router.push(redirect || "/");
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push(redirect || "/");
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      router.push(redirect || "/");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-green-800">
          {isRegister ? t("Register") : t("SignIn")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <Label htmlFor="firstName" className="text-green-800">
                  {t("Name")}
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("Name_PH")}
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
            </>
          )}
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
            className="w-full bg-green-600 hover:bg-green-700 text-white relative"
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
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg py-2.5 px-4 mt-2 relative"
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
          <button
            type="button"
            className="text-green-600 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            disabled={isLoading}
          >
            {isRegister ? t("AlreadyRegistered") : t("NotRegistered")}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthPage() {
  const t = useTranslations("SignIn/Register");
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Suspense fallback={<div>{t("Loading")}</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
