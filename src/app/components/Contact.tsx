// app/components/Contact.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Instagram, PhoneCall, Mail } from "lucide-react";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative py-20 overflow-hidden bg-gradient-to-r from-green-100 to-green-50"
    >
      {/* Ola superior */}
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

      {/* Ola inferior */}
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
        className="
          relative 
          max-w-6xl 
          mx-auto 
          px-4 
          z-10
        "
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* Título y Subtítulo */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-green-800">
            Contáctanos
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-2">
            ¿Dudas o comentarios? ¡Estamos aquí para ayudarte!
          </p>
        </div>

        {/* Contenedor “Glass” en 2 columnas */}
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
          {/* Columna Izquierda: Info de Contacto */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-green-800 mb-2">
                Información de Contacto
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Puedes comunicarte con nuestro equipo a través de los siguientes
                medios. ¡Estaremos encantados de ayudarte con cualquier consulta!
              </p>
            </div>

            {/* Teléfono / Email */}
            <div className="space-y-3">
              <div className="flex items-center text-green-800 font-medium">
                <PhoneCall className="mr-2" /> +1 234 567 890
              </div>
              <div className="flex items-center text-green-800 font-medium">
                <Mail className="mr-2" /> contacto@inti.org
              </div>
            </div>

            {/* Redes Sociales */}
            <div>
              <p className="text-gray-700 mb-1">Síguenos en redes sociales:</p>
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
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-700 transition-colors"
                >
                  <Twitter size={24} />
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

            {/* Extra: Horario (ejemplo) */}
            <div>
              <h4 className="text-green-800 font-semibold mb-1">Horario</h4>
              <p className="text-sm text-gray-700">Lunes - Viernes: 9:00 - 18:00</p>
              <p className="text-sm text-gray-700">Sábados: 10:00 - 14:00</p>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 lg:p-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Envíanos un Mensaje
            </h3>
            <form className="space-y-4">
              {/* Nombre y Email en 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-medium text-gray-700">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
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
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Asunto */}
              <div>
                <Label htmlFor="subject" className="font-medium text-gray-700">
                  Asunto
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Motivo de tu mensaje"
                  required
                  className="mt-1"
                />
              </div>

              {/* Teléfono (Opcional) */}
              <div>
                <Label htmlFor="phone" className="font-medium text-gray-700">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej: +1 234 567 890"
                  className="mt-1"
                />
              </div>

              {/* Mensaje */}
              <div>
                <Label htmlFor="message" className="font-medium text-gray-700">
                  Mensaje
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Escribe tu mensaje..."
                  className="mt-1"
                />
              </div>

              {/* Botón Enviar */}
              <Button
                className="bg-green-600 hover:bg-green-700 w-full text-lg mt-2"
                type="submit"
              >
                Enviar
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
