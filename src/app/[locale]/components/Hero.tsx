'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('LandingPage.Section')
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-[90vh] overflow-hidden"
    >
      {/* Background image with Parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/domo.jpg')`,
        }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 text-center text-white max-w-2xl mx-auto flex flex-col items-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold drop-shadow-lg mb-2 sm:mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            background: 'linear-gradient(to right, #ffffff, #b2f5ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('Hero.Title')}
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl md:text-2xl mt-2 sm:mt-4 drop-shadow"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {t('Hero.Description')}
        </motion.p>
        <motion.p
          className="text-base sm:text-lg md:text-xl mt-2 italic drop-shadow"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          # {t('Hero.Phrase')}
        </motion.p>

        <motion.div
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-4 sm:px-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Button
            className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-semibold bg-green-600 hover:bg-green-700 border-none"
            onClick={() => {
              const aboutSection = document.getElementById('about')
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            {t('Hero.Button1')}
          </Button>
          <Button
            variant="outline"
            className="
        w-full
        sm:w-auto
        px-6 
        py-3 
        text-base
        sm:text-lg 
        font-semibold 
        text-white 
        border-white
        bg-transparent 
        hover:bg-white 
        hover:text-green-700
        "
            onClick={() => {
              const tariffeSection = document.getElementById('tariffe')
              if (tariffeSection) {
                tariffeSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            {t('Hero.Button2')}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
