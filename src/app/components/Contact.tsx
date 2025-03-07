"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, PhoneCall, Mail } from "lucide-react";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative py-20 overflow-hidden bg-gradient-to-r from-green-100 to-green-50"
    >
      {/* Onda superiore */}
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

      {/* Onda inferiore */}
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
        {/* Titolo e Sottotitolo */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-green-800">
            Contattaci
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-2">
            Dubbi o commenti? Siamo qui per aiutarti!
          </p>
        </div>

        {/* Contenitore "Glass" in 2 colonne */}
        <div
          className="
            backdrop-blur-md 
            bg-white/60
            shadow-lg 
            rounded-xl 
            border border-white/20
            p-6
            md:p-10
            grid 
            grid-cols-1 
            md:grid-cols-2 
            gap-8
          "
        >
          {/* Colonna Sinistra: Informazioni di Contatto */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-green-800 mb-2">
                Informazioni di Contatto
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Puoi contattare il nostro staff tramite i nostri contatti.
                Saremo felici di aiutarti!
              </p>
            </div>

            {/* Telefono / Email */}
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
              <p className="text-gray-700 mb-1">Seguici sui social:</p>
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

          {/* Colonna Destra: Formulario */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Inviaci un Messaggio
            </h3>
            <form className="space-y-4">
              {/* Nome ed Email in 2 colonne */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Il tuo nome"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tuaemail@esempio.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Oggetto */}
              <div>
                <Label htmlFor="subject" className="font-medium text-gray-700">
                  Oggetto
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Motivo del tuo messaggio"
                  required
                  className="mt-1"
                />
              </div>

              {/* Telefono (Opzionale) */}
              <div>
                <Label htmlFor="phone" className="font-medium text-gray-700">
                  Telefono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Es: 3477930530"
                  className="mt-1"
                />
              </div>

              {/* Messaggio */}
              <div>
                <Label htmlFor="message" className="font-medium text-gray-700">
                  Messaggio
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Scrivi il tuo messaggio..."
                  className="mt-1"
                />
              </div>

              {/* Bottone Invia */}
              <Button
                className="bg-green-600 hover:bg-green-700 w-full text-lg mt-2"
                type="submit"
              >
                Invia
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
