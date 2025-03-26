"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, PhoneCall, Mail } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

import { useTranslations } from "next-intl";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          phone: formData.phone,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      toast.success("Messaggio inviato con successo!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        "Errore nell'invio del messaggio. Per favore riprova più tardi."
      );
      console.error("EmailJS Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const t = useTranslations("LandingPage.Section.Contact");
  return (
    <section
      id="contact"
      className="relative py-20 overflow-hidden bg-gradient-to-r from-green-100 to-green-50"
    >
      {/* Upper wave */}
      <div className="pointer-events-none absolute top-0 left-0 w-full -translate-y-full z-[1]">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            d="M0,224L80,202.7C160,181,320,139,480,133.3C640,128,800,160,960,186.7C1120,213,1280,235,1360,245.3L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Lower wave */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full translate-y-full rotate-180 z-[1]">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            d="M0,224L80,202.7C160,181,320,139,480,133.3C640,128,800,160,960,186.7C1120,213,1280,235,1360,245.3L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-4 z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* Title and Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-green-800">
            {t("Title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-2">
            {t("Subtitle")}
          </p>
        </div>

        {/* "Glass" container in 2 columns */}
        <div className="backdrop-blur-md bg-white/60 shadow-lg rounded-xl border border-white/20 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Contact Information */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-green-800 mb-2">
                {t("Information")}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {t("Description")}
              </p>
            </div>

            {/* Phone / Email */}
            <div className="space-y-3">
              <div className="flex items-center text-green-800 font-medium">
                <PhoneCall className="mr-2" /> 3477930530
              </div>
              <div className="flex items-center text-green-800 font-medium">
                <Mail className="mr-2" /> ass.inticastelgrandegmail.com
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-gray-700 mb-1">{t("Social")}</p>
              <div className="flex space-x-6 text-gray-600">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-700 transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-700 transition-colors"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              {t("Form.Title")}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name and Email in 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    {t("Form.Name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("Form.Name_PH")}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-medium text-gray-700">
                    {t("Form.Email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("Form.Email_PH")}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="subject" className="font-medium text-gray-700">
                  {t("Form.Subject")}
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t("Form.Subject_PH")}
                  required
                  className="mt-1"
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <Label htmlFor="phone" className="font-medium text-gray-700">
                  {t("Form.Telephone")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("Form.Telephone_PH")}
                  className="mt-1"
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="font-medium text-gray-700">
                  {t("Form.Message")}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("Form.Message_PH")}
                  className="mt-1"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                className="bg-green-600 hover:bg-green-700 w-full text-lg mt-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("Form.Submitting") : t("Form.Submit")}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
