import { useTranslation } from 'react-i18next'

import { IOrder } from '@/types'
import OrderItemDetail from './order-item-detail'
import { publicFileURL } from '@/constants'
import { ScrollArea } from '@/components/ui'

interface IOrderItemListProps {
  orderDetailData: IOrder
}

export default function OrderItemList({
  orderDetailData,
}: IOrderItemListProps) {
  const { t } = useTranslation(['menu'])
  return (
    <div className="flex flex-col gap-1">
      <span className="px-4 py-1 text-lg font-semibold">
        {t('order.orderDetail')}
      </span>
      <div className="flex flex-col w-full gap-2">
        <ScrollArea className="h-[24rem] px-4">
          {orderDetailData?.orderItems?.map((item) => (
            <div
              key={item.slug}
              className="grid items-center w-full gap-4 py-4 border-b-2"
            >
              <div
                key={`${item.slug}`}
                className="grid flex-row items-center w-full grid-cols-4"
              >
                <div className="flex justify-start w-full col-span-2">
                  <div className="flex flex-col items-center w-full gap-4 sm:flex-row">
                    <div className="relative">
                      <img
                        src={`${publicFileURL}/${item.variant.product.image}`}
                        alt={item.variant.product.name}
                        className="object-cover w-20 h-12 rounded-lg sm:h-16 sm:w-24"
                      />
                      <span className="absolute flex items-center justify-center text-xs text-white rounded-full -bottom-2 -right-2 h-7 w-7 bg-primary">
                        x{item.quantity}
                      </span>
                    </div>

                    <div className="flex flex-col items-start h-full">
                      <span className="font-bold truncate">
                        {item.variant.product.name}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {`${(item.variant.price || 0).toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end col-span-2">
                  <span className="text-sm font-semibold text-primary">
                    {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                                <NotepadText
                                  size={24}
                                  className="text-muted-foreground"
                                />
                                <Input value={item.note} readOnly />
                              </div> */}
              <OrderItemDetail order={item} />
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
