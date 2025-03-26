'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/app/[locale]/lib/firebase'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import CardItem from '@/components/ui/card-item'
import { Card } from '@/components/ui/card'

interface Visit {
  id: string
  name: string
  shortDescription: string
  price: number
  frequency: string
  features: string[]
  active: boolean
  order: string
}

/* ------------------ Hook para tamaño de ventana ------------------ */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return windowSize
}

export function VisitsPricing() {
  const router = useRouter()
  const { width } = useWindowSize()

  const [visits, setVisits] = useState<Visit[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // --- Estados para lógica "responsive" y dimensiones
  const [visibleCards, setVisibleCards] = useState(3)
  const [cardWidth, setCardWidth] = useState(314)
  const [arrowSize, setArrowSize] = useState(24)
  const [gap, setGap] = useState(32)

  /* Ajustar layout según ancho de ventana */
  useEffect(() => {
    if (width < 768) {
      setVisibleCards(1)
      setArrowSize(16)
      setGap(16)
      // Aseguramos un ancho mínimo
      const newWidth = width - 120 > 200 ? width - 120 : 200
      setCardWidth(newWidth)
    } else {
      setVisibleCards(3)
      setArrowSize(24)
      setGap(32)
      setCardWidth(314)
    }
  }, [width])

  /* Cargar visitas desde Firebase */
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'visitTypes'))
        const data: Visit[] = []
        querySnapshot.forEach((docSnap) => {
          const visit = docSnap.data() as Omit<Visit, 'id'>
          data.push({ id: docSnap.id, ...visit })
        })
        const activeVisits = data.filter((v) => v.active)
        // Ordenar por 'order'
        activeVisits.sort((a, b) => parseInt(a.order) - parseInt(b.order))
        // Tomamos máximo 4 (3 + "Ver más")
        setVisits(activeVisits.slice(0, 4))
      } catch (error) {
        console.error('Error al cargar los tipos de visita:', error)
      }
    }
    fetchVisits()
  }, [])

  // Si hay >= 3 visitas, tendremos 4 "cards": 3 de visitas + 1 "Ver más"
  const totalCards = visits.length >= 3 ? 4 : visits.length
  const maxSlide = totalCards - visibleCards

  // Ancho total visible = tarjetas visibles * anchoTarjeta + espacio entre ellas
  const visibleWidth = visibleCards * cardWidth + (visibleCards - 1) * gap

  // Funciones para moverse en el carrusel
  const goPrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0))
  const goNext = () => setCurrentSlide((prev) => Math.min(prev + 1, maxSlide))

  // Swipes táctiles / mouse
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
  })

  return (
    <section id="tariffe" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-green-800 mb-12">
          Tipi di Visita e Tariffe
        </h2>

        <div className="flex items-center justify-center relative">
          {/* Flecha izquierda */}
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="bg-white rounded-full shadow p-1 hover:bg-green-100 disabled:opacity-50 absolute left-0"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronLeft size={arrowSize} className="text-green-600" />
          </button>

          {/* Contenedor visible del carrusel */}
          <div className="overflow-hidden" style={{ width: visibleWidth }} {...swipeHandlers}>
            {/* Interior desplazable */}
            <div
              className="flex"
              style={{
                transform: `translateX(-${currentSlide * (cardWidth + gap)}px)`,
                transition: 'transform 0.5s ease',
              }}
            >
              {/* Render de hasta 3 visitas */}
              {visits.slice(0, 3).map((visit, index) => {
                const isLast = index === visits.slice(0, 3).length - 1
                return (
                  <div
                    key={visit.id}
                    className="flex-shrink-0"
                    style={{
                      width: cardWidth,
                      marginRight: isLast && visits.length < 3 ? 0 : gap,
                    }}
                  >
                    <CardItem visit={visit} showButton={true} setIsModalOpen={() => {}} />
                  </div>
                )
              })}

              {/* 4ta tarjeta: "Ver más" si tenemos al menos 3 visitas */}
              {visits.length >= 3 && (
                <div className="flex-shrink-0" style={{ width: cardWidth, marginRight: 0 }}>
                  <Card className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center p-6 gap-6 w-full">
                      <p className="text-gray-700 text-base font-normal">
                        Descubre todas las opciones y tarifas disponibles.
                      </p>
                      <Button
                        className="bg-green-600 hover:bg-green-700 w-full text-white text-lg"
                        onClick={() => router.push('/visits-prices')}
                      >
                        Ver más
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Flecha derecha */}
          <button
            onClick={goNext}
            disabled={currentSlide >= maxSlide || maxSlide < 0}
            className="bg-white rounded-full shadow p-1 hover:bg-green-100 disabled:opacity-50 absolute right-0"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronRight size={arrowSize} className="text-green-600" />
          </button>
        </div>
      </div>
    </section>
  )
}
