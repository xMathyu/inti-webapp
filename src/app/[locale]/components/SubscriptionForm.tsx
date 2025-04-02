'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslations } from 'next-intl'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Mail, Phone, FileText, Send, ArrowRight } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
})

export default function SubscriptionForm() {
  const t = useTranslations('SubscriptionForm')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [userData, setUserData] = useState<{ name: string; email: string; phone: string }>()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (data: { name: string; email: string; phone: string }) => {
    setIsSubmitting(true)
    try {
      setUserData({
        name: data.name,
        email: data.email,
        phone: data.phone,
      })

      console.log('Form data:', data, 'File:', file)
      setIsSubmitted(true)
      toast.success(t('Toast.Success'))
      form.reset()
      setFile(null)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(t('Toast.Error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-green-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-green-800">{t('Title')}</CardTitle>
          <CardDescription>{t('Description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center">
                <div className="bg-green-100 rounded-full p-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-800">{t('Success.Title')}</h3>

              <div className="rounded-lg bg-amber-50 p-5 border border-amber-200 mt-4">
                <h4 className="font-bold text-amber-800 mb-3 text-lg">
                  {t('Success.Instructions.Title')}
                </h4>
                <ol className="text-left text-amber-700 space-y-3 pl-1">
                  <li className="flex items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </span>
                    <span>{t('Success.Instructions.Step1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </span>
                    <span>{t('Success.Instructions.Step2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      3
                    </span>
                    <span>{t('Success.Instructions.Step3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      4
                    </span>
                    <span>{t('Success.Instructions.Step4')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-amber-200 text-amber-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      5
                    </span>
                    <span>{t('Success.Instructions.Step5')}</span>
                  </li>
                </ol>
              </div>

              <p className="text-gray-600 mt-5 font-medium">{t('Success.Continue')}:</p>

              <a
                // TODO: Replace with the actual phone number
                href={`https://wa.me/39XXXXXXXXX?text=Ciao! Ho appena compilato il modulo di iscrizione.%0A%0ANome: ${userData?.name}%0AEmail: ${userData?.email}%0ATelefono: ${userData?.phone}%0A%0ASto per inviarti il modulo PDF compilato come allegato.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] mt-5 flex items-center justify-center text-white font-medium py-3 px-4 rounded-md transition-colors duration-300"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 0 1 7.022 2.91 9.788 9.788 0 0 1 2.914 6.93c-.004 5.445-4.455 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                </svg>
                {t('Success.Continue')} <ArrowRight className="ml-2 h-4 w-4" />
              </a>

              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full mt-4 border-gray-300 hover:bg-gray-50"
              >
                {t('Success.NewForm')}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-1 rounded-full mb-5">
                  <div className="h-1 bg-green-600 rounded-full" style={{ width: '0%' }}></div>
                </div>

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-gray-700">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        {t('Form.Name')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder={t('Form.Name_Placeholder')}
                        />
                      </FormControl>
                      <FormMessage>{t('Validation.NameRequired')}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-green-600" />
                        {t('Form.Email')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder={t('Form.Email_Placeholder')}
                        />
                      </FormControl>
                      <FormMessage>{t('Validation.EmailRequired')}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-green-600" />
                        {t('Form.Phone')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          {...field}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder={t('Form.Phone_Placeholder')}
                        />
                      </FormControl>
                      <FormMessage>{t('Validation.PhoneRequired')}</FormMessage>
                    </FormItem>
                  )}
                />

                <div className="mt-5 pt-3 border-t border-gray-200">
                  <div className="mt-3 text-sm text-gray-600 flex items-center">
                    <a
                      href="https://github.com/user-attachments/files/19410790/Modulo.tesseramento.%2B.tessera.associativa.pdf"
                      download
                      className="text-green-600 hover:text-green-700 hover:underline flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" /> {t('Form.DownloadForm')}
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center py-2.5 mt-6 text-base transition-colors duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      {t('Form.Submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      {t('Form.Submit')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
