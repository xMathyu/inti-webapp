'use client'

import { motion } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { AiOutlineCheck } from 'react-icons/ai'
import Image from 'next/image'

import { useTranslations } from 'next-intl'
import { Guide } from '../interfaces/interfaces'

// Guides data
// const guides = [
//   {
//     name: "Valentina Di Carlo",
//     specialty:
//       "Documentarista, giardiniere d'arte, educatrice, allevatrice di bruchi e farfalle – Racconti e curiosità sul mondo delle piante e delle farfalle",
//     image: "/valentina.jpg",
//     bio: "Appassionata del mondo naturale, capace di accompagnare i visitatori in un viaggio alla scoperta dei tesori nascosti della flora e della fauna. La sua missione è sensibilizzare ed educare il pubblico alla bellezza e importanza dell'ambiente naturale.",
//   },
//   {
//     name: "Lorenzo",
//     specialty:
//       "Cuoco, giardiniere d'arte, agricoltore, allevatore di bruchi e farfalle – Una ricetta perfetta per scoprire curiosità su piante e piatti",
//     image: "/lorenzo.jpg",
//     bio: "Passione per la cucina e profondo rispetto per la terra, una figura capace di raccontarvi e preparare piatti che testimoniano un legame profondo con la natura e il ciclo delle stagioni.",
//   },
// ];

export function Guides() {
  const t = useTranslations('LandingPage.Section.Guides')
  const guides = t.raw('GuidesList')
  return (
    <section
      id="guides"
      className="relative py-20 overflow-hidden bg-gradient-to-r from-green-100 to-green-50"
    >
      {/* Top wave */}
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

      {/* Bottom wave */}
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

      {/* Main container */}
      <div className="relative max-w-6xl mx-auto px-4 z-10">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-green-800 mb-12"
        >
          {t('Title')}
        </motion.h2>

        {/* Guides grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guides.map((guide: Guide, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="transform transition-transform hover:-translate-y-2"
            >
              <Card className="shadow-md border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-xl h-full flex flex-col">
                {/* Guide image */}
                <div className="flex justify-center mt-6">
                  <Image
                    src={guide.image}
                    alt={guide.name}
                    width={144}
                    height={144}
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white ring-offset-4 ring-offset-green-100 transition-transform hover:scale-105"
                  />
                </div>

                {/* Card header */}
                <CardHeader className="pt-4 pb-2 text-center">
                  <CardTitle className="text-2xl text-green-800 font-bold">{guide.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium">
                    {guide.specialty}
                  </CardDescription>
                </CardHeader>

                {/* Content: Biography in bullet points */}
                <CardContent className="px-6 pb-6 flex-1">
                  <ul className="list-none space-y-2">
                    {guide.bio
                      .split('. ')
                      .filter((sentence: string) => sentence.trim().length > 0)
                      .map((sentence: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                          <span
                            className="text-gray-700 text-sm md:text-base"
                            style={{ textAlign: 'justify' }}
                          >
                            {sentence.trim()}
                            {!sentence.trim().endsWith('.') && '.'}
                          </span>
                        </li>
                      ))}
                  </ul>
                </CardContent>

                {/* Footer: Button */}
                <CardFooter className="flex justify-center pb-6">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
                    onClick={() => alert(`${t('MoreInfo')} ${guide.name}`)}
                  >
                    {t('MoreButton')}
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
