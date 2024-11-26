import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Form,
  Button,
  ScrollArea,
} from '@/components/ui'
import { IAddMenuItemRequest } from '@/types'
import { useAddMenuItems } from '@/hooks'
import { showToast } from '@/utils'
import { useMenuItemStore } from '@/stores'

interface IFormAddMenuMultipleItemsProps {
  products: IAddMenuItemRequest[]
  onSubmit: (isOpen: boolean) => void
}

type TFormData = {
  [key: string]: number
}

export const AddMenuMultipleItemsForm: React.FC<
  IFormAddMenuMultipleItemsProps
> = ({ products, onSubmit }) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['menu'])
  const { mutate: addMenuItems } = useAddMenuItems()
  const { clearMenuItems } = useMenuItemStore()

  // Tạo defaultValues với defaultStock cho từng sản phẩm
  const defaultValues = products.reduce((acc, product) => {
    return {
      ...acc,
      [product.productSlug]: 50,
    }
  }, {})

  const form = useForm<TFormData>({
    defaultValues,
  })

  const handleSubmit = (data: TFormData) => {
    const itemsToAdd = products.map((product) => ({
      ...product,
      defaultStock: data[product.productSlug],
    }))

    addMenuItems(itemsToAdd, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['specific-menu'],
        })
        clearMenuItems()
        onSubmit(false)
        showToast(t('toast.addMenuItemSuccess'))
      },
    })
  }

  // Tạo formFields động dựa trên products
  const formFields = products.reduce((acc, product) => {
    return {
      ...acc,
      [product.productSlug]: (
        <div className="flex items-center justify-between gap-2 rounded-md p-2">
          <FormLabel className="w-full rounded-md border p-2 text-sm">
            {product.productName}
          </FormLabel>
          <FormField
            control={form.control}
            name={product.productSlug}
            render={({ field }) => (
              <FormItem className="w-32 flex-shrink-0">
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const valueAsNumber =
                        e.target.value === '' ? '' : Number(e.target.value)
                      field.onChange(valueAsNumber)
                    }}
                    placeholder={t('menu.enterDefaultStock')}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
    }
  }, {})

  return (
    <div className="mt-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              <h3 className="mb-4 font-medium">{t('menu.selectedProducts')}</h3>
              {Object.keys(formFields).map((key) => (
                <React.Fragment key={key}>
                  {formFields[key as keyof typeof formFields]}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end">
            <Button type="submit">{t('menu.addMenuItem')}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}