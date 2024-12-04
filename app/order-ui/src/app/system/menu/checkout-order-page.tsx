import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { CartToggleButton, QuantitySelector } from '@/components/app/button'
import { ScrollArea, useSidebar } from '@/components/ui'
import {
  CheckoutCart,
  // PaymentMethodSelect,
  TableSelect,
} from '@/app/system/menu'
import { useCartItemStore } from '@/stores'
import { CartNoteInput } from '@/components/app/input'
import { DeleteCartItemDialog } from '@/components/app/dialog'
import { publicFileURL } from '@/constants'
import { useIsMobile } from '@/hooks'
import { CheckoutCartDrawer } from '@/components/app/drawer'

export default function ConfirmOrderPage() {
  const { t } = useTranslation('menu')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { getCartItems } = useCartItemStore()
  const { state } = useSidebar()
  const isMobile = useIsMobile()
  const isCollapsed = state === 'collapsed'

  const cartItems = getCartItems()

  return (
    <div className="flex flex-row h-full gap-2">
      <div
        className={`flex flex-col ${isCartOpen && !isMobile ? 'w-full md:w-[70%]' : 'w-full'
          } ${isCollapsed ? 'pl-2' : ''}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-end gap-2 py-3 pr-4 bg-white">
          {!isMobile && (
            <CartToggleButton
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          )}
          {isMobile && <CheckoutCartDrawer />}
        </div>
        <ScrollArea className="flex flex-col gap-2 pb-4">
          <div className="grid grid-cols-7 px-4 py-3 mb-4 text-sm font-thin rounded-md bg-muted/60">
            <span className="col-span-2">{t('order.product')}</span>
            <span className="col-span-2 text-center">
              {t('order.quantity')}
            </span>
            <span className="col-span-2 text-center">
              {t('order.grandTotal')}
            </span>
            <span className="flex justify-center col-span-1">
              <Trash2 size={18} />
            </span>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="flex flex-col border rounded-md">
            {cartItems?.orderItems.map((item) => (
              <div
                key={item.slug}
                className="grid items-center w-full gap-4 p-4 pb-4 rounded-md"
              >
                <div
                  key={`${item.slug}`}
                  className="grid flex-row items-center w-full grid-cols-7"
                >
                  <div className="flex w-full col-span-2 gap-2">
                    <div className="flex flex-col items-center justify-start gap-2 sm:flex-row sm:justify-center">
                      <img
                        src={`${publicFileURL}/${item.image}`}
                        alt={item.name}
                        className="object-cover w-20 h-12 rounded-lg sm:h-16 sm:w-24"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold truncate">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {`${(item.price || 0).toLocaleString('vi-VN')}đ`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center col-span-2">
                    <QuantitySelector cartItem={item} />
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-semibold text-primary">
                      {`${((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="flex justify-center col-span-1">
                    <DeleteCartItemDialog cartItem={item} />
                  </div>
                </div>
                <CartNoteInput cartItem={item} />
              </div>
            ))}
          </div>
          <TableSelect />
        </ScrollArea>
      </div>

      {/* Cart Section - Fixed */}
      <div
        className={`fixed right-0 h-[calc(100vh-6.5rem)] border-l bg-background transition-all duration-300 ease-in-out ${isCartOpen && !isMobile ? 'w-[25%]' : 'w-0 opacity-0'
          }`}
      >
        {isCartOpen && !isMobile && <CheckoutCart />}
      </div>
    </div>
  )
}
