import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Card } from '@/components/ui/card'
import CardContentComponent from './card-content-component'

interface Visit {
  id: string
  name: string
  shortDescription: string
  price: number
  frequency: string
  features: string[]
  active: boolean
}

interface CardItemProps {
  visit: Visit
  showButton?: boolean
  setIsModalOpen: (isOpen: boolean) => void
}

export default function CardItem({ visit, showButton = true, setIsModalOpen }: CardItemProps) {
  const [showMore, setShowMore] = useState(false)

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowMore(false)
      setIsModalOpen(false)
    }
  }

  const handleShowMore = () => {
    setShowMore(true)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card
        className="px-6 bg-white shadow-lg border border-gray-200 flex flex-col h-full rounded-lg max-w-sm w-full mx-auto"
        style={{ cursor: 'default', maxWidth: '384px' }}
      >
        <CardContentComponent
          visit={visit}
          showButton={showButton}
          handleShowMore={handleShowMore}
        />
      </Card>

      {showMore &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <Card
              className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer click dentro
            >
              <CardContentComponent
                visit={visit}
                showButton={showButton}
                handleClose={() => {
                  setShowMore(false)
                  setIsModalOpen(false)
                }}
              />
            </Card>
          </div>,
          document.body,
        )}
    </>
  )
}
