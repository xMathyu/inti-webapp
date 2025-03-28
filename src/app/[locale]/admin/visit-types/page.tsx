'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import { toast } from 'sonner'
import { db } from '@/app/[locale]/lib/firebase'
import { VisitType, VisitTypeFormData } from '@/app/[locale]/interfaces/interfaces'
import VisitTypeForm from '@/app/[locale]/components/admin/VisitTypeForm'
import VisitTypeCard from '@/app/[locale]/components/admin/VisitTypeCard'
import {
  createStripeProduct,
  updateStripeProduct,
  deleteStripeProduct,
} from '@/app/[locale]/lib/stripe/products'
import { useTranslations } from 'next-intl'

export default function AdminVisitTypesPanel() {
  const t = useTranslations('Admin/VisitTypes')

  const [visitTypes, setVisitTypes] = useState<VisitType[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<VisitType | null>(null)

  // Initial load (only once)
  const fetchVisitTypes = useCallback(async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'visitTypes'))
      const types: VisitType[] = []
      querySnapshot.forEach((docSnap) => {
        types.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<VisitType, 'id'>),
        })
      })
      setVisitTypes(types)
    } catch {
      toast.error(t('ToastMessages.Error'))
    }
    setLoading(false)
  }, [t])

  useEffect(() => {
    fetchVisitTypes()
  }, [fetchVisitTypes])

  const handleSave = async (data: VisitTypeFormData) => {
    try {
      const docId = selectedVisit ? selectedVisit.id : data.name

      // Si es una actualización
      if (selectedVisit) {
        const updatedStripeData = await updateStripeProduct({
          id: data.stripeProductId || '',
          name: data.name,
          shortDescription: data.shortDescription,
          price: data.price,
          features: data.features,
          frequency: data.frequency,
        })

        // Si hay un nuevo priceId, actualizamos los datos
        if (updatedStripeData?.priceId) {
          data = {
            ...data,
            stripePriceId: updatedStripeData.priceId,
          }
        }
      } else {
        // Si es una nueva visita
        const stripeProduct = await createStripeProduct({
          name: data.name,
          shortDescription: data.shortDescription,
          price: data.price,
          features: data.features,
          frequency: data.frequency,
        })

        // Guardar los IDs de Stripe en Firestore junto con los datos de la visita
        data = {
          ...data,
          stripeProductId: stripeProduct.productId,
          stripePriceId: stripeProduct.priceId,
        }
      }

      await setDoc(doc(db, 'visitTypes', docId), { ...data }, { merge: true })
      toast.success(t('ToastMessages.SaveSuccess'))
      setModalOpen(false)
      // Update local state without reloading all data:
      setVisitTypes((prev) => {
        const newItem = { id: docId, ...data }
        if (selectedVisit) {
          // Update the existing item
          return prev.map((item) => (item.id === selectedVisit.id ? newItem : item))
        } else {
          // Add the new item (at the beginning)
          return [newItem, ...prev]
        }
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || t('ToastMessages.UnexpectedError'))
      } else {
        toast.error(t('ToastMessages.UnexpectedError'))
      }
    }
  }

  const handleDelete = async (visit: VisitType) => {
    try {
      // Primero desactivar el producto en Stripe
      await deleteStripeProduct(visit.stripeProductId!)

      // Luego eliminar de Firestore
      await deleteDoc(doc(db, 'visitTypes', visit.id))
      toast.success(t('ToastMessages.DeleteSuccess'))
      // Remove the item from the local state
      setVisitTypes((prev) => prev.filter((item) => item.id !== visit.id))
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('ToastMessages.UnexpectedError')
      toast.error(errorMessage)
    }
  }

  const handleToggleActive = async (visit: VisitType) => {
    try {
      const newStatus = !visit.active
      await setDoc(doc(db, 'visitTypes', visit.id), { active: newStatus }, { merge: true })
      // Update local state for that item without showing toast
      setVisitTypes((prev) =>
        prev.map((item) => (item.id === visit.id ? { ...item, active: newStatus } : item)),
      )
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('ToastMessages.UnexpectedError')
      toast.error(errorMessage)
    }
  }

  const openModalForNew = () => {
    setSelectedVisit(null)
    setModalOpen(true)
  }

  const openModalForEdit = (visit: VisitType) => {
    setSelectedVisit(visit)
    setModalOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-green-50 rounded shadow relative">
      {/* Header with unique title and button on the rights */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">{t('Title')}</h1>
        <Button
          onClick={openModalForNew}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Plus size={20} />
        </Button>
      </div>

      <VisitTypeForm
        initialData={
          selectedVisit
            ? {
                name: selectedVisit.name,
                price: selectedVisit.price,
                frequency: selectedVisit.frequency,
                shortDescription: selectedVisit.shortDescription,
                features: selectedVisit.features,
                active: selectedVisit.active,
                stripeProductId: selectedVisit.stripeProductId,
                stripePriceId: selectedVisit.stripePriceId,
              }
            : undefined
        }
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />

      <hr className="my-4" />

      {loading ? (
        <p>{t('Loading')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visitTypes.map((visit) => (
            <VisitTypeCard
              key={visit.id}
              visit={visit}
              onEdit={openModalForEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  )
}
