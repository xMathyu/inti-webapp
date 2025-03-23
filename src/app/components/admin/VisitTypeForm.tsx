"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  VisitTypeFormData,
  VisitTypeFormProps,
} from "@/app/interfaces/interfaces";

export default function VisitTypeForm({
  initialData,
  isOpen,
  onOpenChange,
  onSave,
}: VisitTypeFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(
    initialData ? initialData.price.toString() : ""
  );
  const [frequency, setFrequency] = useState(initialData?.frequency || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [features, setFeatures] = useState(
    initialData ? initialData.features.join("\n") : ""
  );
  const [active, setActive] = useState(initialData?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // If initialData changes, update the fields
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setFrequency(initialData.frequency);
      setShortDescription(initialData.shortDescription);
      setFeatures(initialData.features.join("\n"));
      setActive(initialData.active);
    }
  }, [initialData]);

  // If the modal is opened in "Add" mode (without initialData), reset the form
  useEffect(() => {
    if (isOpen && !initialData) {
      setName("");
      setPrice("");
      setFrequency("");
      setShortDescription("");
      setFeatures("");
      setActive(true);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) {
      setLocalError("El precio debe ser un número válido.");
      setLoading(false);
      return;
    }
    const featuresArray = features
      .split("\n")
      .filter((line) => line.trim() !== "");
    const formData: VisitTypeFormData = {
      name,
      price: priceNumber,
      frequency,
      shortDescription,
      features: featuresArray,
			active,
			stripeProductId: initialData?.stripeProductId,
			stripePriceId: initialData?.stripePriceId,
    };
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message || "Error al guardar.");
      } else {
        setLocalError("Error al guardar.");
      }
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Tipo de Visita" : "Agregar Tipo de Visita"}
          </DialogTitle>
          <DialogDescription>
            Ingresa la información del tipo de visita.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="modal-name" className="block text-green-800">
              Nombre de Visita:
            </Label>
            <Input
              id="modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Visita guidata"
              required
            />
          </div>
          <div>
            <Label htmlFor="modal-price" className="block text-green-800">
              Precio:
            </Label>
            <Input
              id="modal-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 10"
              required
            />
          </div>
          <div>
            <Label htmlFor="modal-frequency" className="block text-green-800">
              Frecuencia:
            </Label>
            <Input
              id="modal-frequency"
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Ej: per visita"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="modal-shortDescription"
              className="block text-green-800"
            >
              Descripción Corta:
            </Label>
            <Textarea
              id="modal-shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ej: Esperienza completa con video e degustazione di tè."
              required
            />
          </div>
          <div>
            <Label htmlFor="modal-features" className="block text-green-800">
              Características (una por línea):
            </Label>
            <Textarea
              id="modal-features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Ingresa cada característica en una línea"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="modal-active" className="text-green-800">
              Activo:
            </Label>
            <Switch
              id="modal-active"
              checked={active}
              onCheckedChange={(_checked: boolean) => setActive(_checked)}
            />
          </div>
          {localError && <p className="text-red-500">{localError}</p>}
          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {initialData ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
