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
} from "@/app/[locale]/interfaces/interfaces";

import { useTranslations } from "next-intl";

export default function VisitTypeForm({
  initialData,
  isOpen,
  onOpenChange,
  onSave,
}: VisitTypeFormProps) {
  const t = useTranslations("Admin/VisitTypes");

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
            {initialData ? t("Form.ModifyVisitType") : t("Form.AddVisitType")}
          </DialogTitle>
          <DialogDescription>{t("Form.InputVisitType")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="modal-name" className="block text-green-800">
              {t("Form.VisitName")}
            </Label>
            <Input
              id="modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Form.VisitName_PH")}
              required
            />
          </div>
          <div>
            <Label htmlFor="modal-price" className="block text-green-800">
              {t("Form.Price")}
            </Label>
            <Input
              id="modal-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t("Form.Price_PH")}
              required
            />
          </div>
          <div>
            <Label htmlFor="modal-frequency" className="block text-green-800">
              {t("Form.Frequency")}
            </Label>
            <Input
              id="modal-frequency"
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder={t("Form.Frequency_PH")}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="modal-shortDescription"
              className="block text-green-800"
            >
              {t("Form.Description")}
            </Label>
            <Textarea
              id="modal-shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder={t("Form.Description_PH")}
              required
            />
          </div>
          <div>
            <Label htmlFor="modal-features" className="block text-green-800">
              {t("Form.Characteristics")}
            </Label>
            <Textarea
              id="modal-features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={t("Form.Characteristics_PH")}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="modal-active" className="text-green-800">
              {t("Form.Active")}
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
              {initialData ? t("Form.Update") : t("Form.Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
