'use client'

import React from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { format } from 'date-fns'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Attendee } from '../interfaces/interfaces'
import { useTranslations } from 'next-intl'

export interface FormData {
  attendees: Attendee[]
}

export interface ConfirmationFormProps {
  numPeople: number
  onSubmit: SubmitHandler<FormData>
}

const ConfirmationForm = ({ numPeople, onSubmit }: ConfirmationFormProps) => {
  const t = useTranslations('Rates.BookingForm')
  const form = useForm<FormData>({
    defaultValues: {
      attendees: Array.from({ length: numPeople }, () => ({
        firstName: '',
        lastName: '',
        documentType: 'CIE',
        documentNumber: '',
        phone: '',
        email: '',
        birthDate: '',
      })),
    },
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="max-w-4xl mx-auto p-6 bg-green-50 rounded-xl shadow-lg">
          <h1 className="text-2xl font-extrabold text-green-800 mb-2 text-center">{t('Title')}</h1>
          <p className="text-green-700 text-center mb-6">{t('Subtitle')}</p>

          <div className="space-y-6">
            {form.watch('attendees').map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 border border-gray-200 transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-semibold text-green-800 mb-4">
                  {t('Participant')} {index + 1}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Name')}</FormLabel>
                        <FormControl>
                          <Input {...field} required placeholder={t('Name_PH')} />
                        </FormControl>
                        <FormDescription>{t('NameDescription')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('LastName')}</FormLabel>
                        <FormControl>
                          <Input {...field} required placeholder={t('LastName_PH')} />
                        </FormControl>
                        <FormDescription>{t('LastNameDescription')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.documentType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('DocumentType')}</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={t('Document_PH')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CIE">CIE</SelectItem>
                              <SelectItem value="Passaporto">{t('Passport')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.documentNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('DocumentNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            placeholder={
                              form.watch(`attendees.${index}.documentType`) === 'CIE'
                                ? t('DocumentNumber_PH_1')
                                : t('DocumentNumber_PH_2')
                            }
                            pattern={
                              form.watch(`attendees.${index}.documentType`) === 'CIE'
                                ? '[A-Z]\\d{8}'
                                : undefined
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          {form.watch(`attendees.${index}.documentType`) === 'CIE'
                            ? t('DocumentNumberDescription1')
                            : t('DocumentNumberDescription2')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Telephone')}</FormLabel>
                        <FormControl>
                          <Input {...field} required placeholder={t('Telephone_PH')} />
                        </FormControl>
                        <FormDescription>{t('TelephoneDescription')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.email`}
                    rules={{
                      required: t('RequiredEmail'),
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: t('EmailDescription'),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="esempio@mail.com" />
                        </FormControl>
                        <FormDescription>{t('EmailDescription')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attendees.${index}.birthDate`}
                    render={({ field }) => {
                      const selectedDate = field.value ? new Date(field.value) : undefined
                      return (
                        <FormItem>
                          <FormLabel>{t('Birthdate')}</FormLabel>
                          <FormControl>
                            <DateTimePicker
                              onChange={(date) => {
                                field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                              }}
                              value={selectedDate}
                              className="bg-white"
                              hideTime
                            />
                          </FormControl>
                          <FormDescription>{t('Birthdate_PH')}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center mt-8">
            <Button
              type="submit"
              className="w-auto bg-green-600 hover:bg-green-700 text-white py-3 transition-colors"
            >
              {t('Button')}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default ConfirmationForm
