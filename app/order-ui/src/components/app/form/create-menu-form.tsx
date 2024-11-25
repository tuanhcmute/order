import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { CalendarIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAllMenus } from '@/hooks'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Calendar,
  Form,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui'
import { createMenuSchema, TCreateMenuSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ICreateMenuRequest } from '@/types'
import { useCreateMenu } from '@/hooks'
import { showToast } from '@/utils'
import { BranchSelect } from '@/components/app/select'
import { cn } from '@/lib'

interface IFormCreateMenuProps {
  onSubmit: (isOpen: boolean) => void
}

export const CreateMenuForm: React.FC<IFormCreateMenuProps> = ({
  onSubmit,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['menu'])
  const { mutate: createMenu } = useCreateMenu()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const form = useForm<TCreateMenuSchema>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      date: '',
      branchSlug: '',
    },
  })
  const { data: menuData } = useAllMenus()

  // Get existing menu dates
  const existingMenuDates =
    menuData?.result.map((menu) => moment(menu.date).format('YYYY-MM-DD')) || []

  // Function to disable dates
  const disabledDays = [
    { before: new Date() }, // Disable past dates
    ...existingMenuDates.map((date) => new Date(date)), // Disable dates with menus
  ]

  // Custom modifier for dates with menus
  const modifiers = {
    booked: existingMenuDates.map((date) => new Date(date)),
  }

  const handleSubmit = (data: ICreateMenuRequest) => {
    createMenu(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['menus'],
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.createMenuSuccess'))
      },
    })
  }

  const formFields = {
    date: (
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.date')}</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        field.value
                      ) : (
                        <span>{t('menu.chooseDate')}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      if (newDate) {
                        const formattedDate =
                          moment(newDate).format('YYYY-MM-DD')
                        setDate(newDate)
                        field.onChange(formattedDate)
                      }
                    }}
                    disabled={disabledDays}
                    modifiers={modifiers}
                    modifiersClassNames={{
                      booked:
                        'relative before:absolute before:bottom-0.5 before:left-1/2 before:-translate-x-1/2 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full',
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    branchSlug: (
      <FormField
        control={form.control}
        name="branchSlug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.branchSlug')}</FormLabel>
            <FormControl>
              <BranchSelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
  }

  return (
    <div className="mt-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(formFields).map((key) => (
              <React.Fragment key={key}>
                {formFields[key as keyof typeof formFields]}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-end">
            <Button className="flex justify-end" type="submit">
              {t('menu.create')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}