'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { VisitTypeCardProps } from '@/app/[locale]/interfaces/interfaces'

import { useTranslations } from 'next-intl'

export default function VisitTypeCard({
  visit,
  onEdit,
  onDelete,
  onToggleActive,
}: VisitTypeCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const t = useTranslations('Admin/VisitTypes')

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-2xl font-bold text-green-800">{visit.name}</h3>
        <p className="text-green-700 font-medium">
          €{visit.price} <span className="text-sm font-normal">- {visit.frequency}</span>
        </p>
      </div>
      <p className="text-gray-600 mb-3">{visit.shortDescription}</p>
      <ul className="list-disc pl-5 space-y-1 mb-4 text-gray-600">
        {visit.features.map((feat, idx) => (
          <li key={idx}>{feat}</li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id={`switch-${visit.id}`}
            checked={visit.active}
            onCheckedChange={() => onToggleActive(visit)}
          />
          <span className="text-sm font-medium text-green-800">
            {visit.active ? t('Card.Active') : t('Card.Inactive')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => onEdit(visit)}>
            {t('Card.Edit')}
          </Button>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive"> {t('Card.Delete')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('Card.ConfirmDelete')}</DialogTitle>
                <DialogDescription>{t('Card.DeleteConfirmation')}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                  {t('Card.Cancel')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(visit)
                    setConfirmOpen(false)
                  }}
                >
                  {t('Card.Delete')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
