'use client'

import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { useTranslations } from 'next-intl'
import { ReservationDetails } from '../interfaces/interfaces'

interface QRCodePDFGeneratorProps {
  reservationId: string | null
  reservationDetails: ReservationDetails | null
}

export function QRCodePDFGenerator({ reservationId, reservationDetails }: QRCodePDFGeneratorProps) {
  const t = useTranslations('ClientConfirmationPage')

  const generatePDF = async () => {
    if (!reservationDetails) return

    // Crear QR con la información
    const qrData = `
        ${t('ReservationNumber')} ${reservationId}\n
        `
    const qrImage = await QRCode.toDataURL(qrData)

    // Crear documento PDF
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`${t('ReservationDetails')}`, 20, 10)
    // Obtener el ancho del texto para calcular el subrayado
    const textWidth = doc.getTextWidth(`${t('ReservationDetails')}`)
    doc.line(20, 12, 20 + textWidth, 12) // Dibujar la línea de subrayado
    // Restablecer la fuente a normal si es necesario
    doc.setFont('helvetica', 'normal')
    doc.text(`${t('ReservationType')} ${reservationDetails?.visitTypeId || 'N/A'}`, 20, 20)
    doc.text(`${t('TicketNumber')} ${reservationDetails?.numPeople || 0}`, 20, 30)
    doc.text(
      `${t('Date')} ${reservationDetails?.createdAt?.toDate().toLocaleDateString() || 'N/A'}`,
      20,
      40,
    )
    doc.text(
      `${t('TotalPrice')} ${
        reservationDetails?.totalAmount ? reservationDetails.totalAmount / 100 : '0.00'
      } ${reservationDetails?.currency?.toUpperCase()}`,
      20,
      50,
    )

    doc.setTextColor(255, 0, 0) // Establecer color rojo
    doc.text(`${t('TextScan')}`, 20, 70)

    // Restablecer el color si es necesario para los siguientes textos
    doc.setTextColor(0, 0, 0)

    doc.addImage(qrImage, 'PNG', 20, 80, 100, 100) // Agregar el QR

    // Descargar el PDF
    doc.save('reservation.pdf')
  }

  return (
    <button
      onClick={generatePDF}
      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
    >
      {t('Download')}
    </button>
  )
}
