// app/components/Contact.tsx

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  return (
    <section
      id="contact"
      className="
        py-20 
        bg-gradient-to-r 
        from-green-100 
        to-green-50 
      "
    >
      <motion.div
        className="max-w-3xl mx-auto px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">
          Contáctanos
        </h2>
        <p className="text-center text-lg mb-8 text-gray-700">
          Si tienes dudas o quieres más información, ¡escríbenos!
        </p>

        {/* Formulario */}
        <form className="max-w-xl mx-auto space-y-6 bg-white p-6 rounded shadow">
          <div>
            <Label htmlFor="name" className="font-medium text-gray-700">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              className="mt-1"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="mt-1"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="message" className="font-medium text-gray-700">
              Mensaje
            </Label>
            <Textarea
              id="message"
              className="mt-1"
              rows={5}
              placeholder="Escribe tu mensaje..."
            />
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 w-full text-lg"
            type="submit"
          >
            Enviar
          </Button>
        </form>

        {/* Info adicional */}
        <div className="text-center mt-8 text-gray-700">
          <p className="mb-2">También puedes llamarnos o escribirnos a:</p>
          <p>
            <strong>Teléfono:</strong> +1 234 567 890
          </p>
          <p>
            <strong>Email:</strong> contacto@inti.org
          </p>
        </div>
      </motion.div>
    </section>
  );
}
