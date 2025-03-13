import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface ReservationFormProps {
  index: number;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ index }) => {
  const [formData, setFormData] = useState({
    dni: "",
    email: "",
    phone: "",
    dob: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "reservations"), formData);
      alert("Reserva guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la reserva: ", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="w-full p-6 border rounded-2xl shadow-lg bg-green-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-800">
            Asistente {index + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor={`dni-${index}`} className="text-green-700 font-medium">
              DNI (CIE)
            </Label>
            <Input 
              id={`dni-${index}`} 
              name="dni"
              type="text" 
              placeholder="Ingrese su DNI" 
              className="border-green-300 focus:ring-green-500 focus:border-green-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor={`email-${index}`} className="text-green-700 font-medium">
              Correo Electrónico
            </Label>
            <Input 
              id={`email-${index}`} 
              name="email"
              type="email" 
              placeholder="Ingrese su correo" 
              className="border-green-300 focus:ring-green-500 focus:border-green-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor={`phone-${index}`} className="text-green-700 font-medium">
              Número de Teléfono
            </Label>
            <Input 
              id={`phone-${index}`} 
              name="phone"
              type="tel" 
              placeholder="Ingrese su teléfono" 
              className="border-green-300 focus:ring-green-500 focus:border-green-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor={`dob-${index}`} className="text-green-700 font-medium">
              Fecha de Nacimiento
            </Label>
            <Input 
              id={`dob-${index}`} 
              name="dob"
              type="date" 
              className="border-green-300 focus:ring-green-500 focus:border-green-500"
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
            Guardar Reserva
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationForm;