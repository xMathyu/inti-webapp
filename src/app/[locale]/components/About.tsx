// app/components/About.tsx

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GiForestCamp, GiButterfly } from 'react-icons/gi'
import { AiOutlineCheck } from 'react-icons/ai'

import { useTranslations } from 'next-intl'

export function About() {
  const t = useTranslations('LandingPage.Section')
  return (
    <section
      id="about"
      className="relative overflow-hidden py-20 bg-gradient-to-r from-green-100 to-green-50"
    >
      {/* Top wave */}
      <div className="pointer-events-none absolute top-0 left-0 w-full -translate-y-full">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L80,197.3C160,171,320,117,480,106.7C640,96,800,128,960,154.7C1120,181,1280,203,1360,213.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Bottom wave */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full translate-y-full rotate-180">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L80,197.3C160,171,320,117,480,106.7C640,96,800,128,960,154.7C1120,181,1280,203,1360,213.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Main container */}
      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div
          className="backdrop-blur-md bg-white/60 shadow-xl rounded-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Main title */}
          <h2 className="text-3xl md:text-4xl font-semibold text-green-800 mb-6 text-center">
            {t('About.Title')}
          </h2>

          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-green-200 text-green-800">
              {t('About.Visitors')}
            </Badge>
          </div>

          {/* Grid with 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card: Park History */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <GiForestCamp className="w-6 h-6 mr-2 text-green-600" />
                <h3 className="text-xl font-semibold text-green-800">
                  {t('About.Park_History.Title')}
                </h3>
              </div>
              <ul className="list-none space-y-2">
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Park_History.Paragraph_1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Park_History.Paragraph_2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Park_History.Paragraph_3')}
                  </span>
                </li>
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Park_History.Paragraph_4')}
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Card: Inti History */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <GiButterfly className="w-6 h-6 mr-2 text-green-600" />
                <h3 className="text-xl font-semibold text-green-800">
                  {t('About.Inty History.Title')}
                </h3>
              </div>
              <ul className="list-none space-y-2">
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Inty History.Paragraph_1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Inty History.Paragraph_2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Inty History.Paragraph_3')}
                  </span>
                </li>
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Inty History.Paragraph_4')}
                  </span>
                </li>
                <li className="flex items-start">
                  <AiOutlineCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span
                    className="text-gray-700 text-sm md:text-base"
                    style={{ textAlign: 'justify' }}
                  >
                    {t('About.Inty History.Paragraph_5')}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Main button */}
          <div className="mt-8 flex justify-center">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => alert('Grazie per il tuo interesse in INTI!')}
            >
              {t('About.MoreButton')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
