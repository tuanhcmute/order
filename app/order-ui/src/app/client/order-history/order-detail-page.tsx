import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'
import moment from 'moment'

import {
  Button,
  Separator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { useOrderBySlug } from '@/hooks'
import { publicFileURL } from '@/constants'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
import { IOrderType } from '@/types'
import PaymentStatusBadge from '@/components/app/badge/payment-status-badge'

export default function OrderDetailPage() {
  const { t } = useTranslation(['menu'])
  const { slug } = useParams()
  const { data: orderDetail } = useOrderBySlug(slug as string)
  const navigate = useNavigate()

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-2 px-2">
        {/* Title */}
        <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-gray-50">
          <span className="flex items-center justify-start w-full gap-1 text-lg">
            <SquareMenu />
            {t('order.orderDetail')}{' '}
            <span className="text-muted-foreground">
              #{orderDetail?.result?.slug}
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Left, info */}
          <div className="flex flex-col w-full gap-4 lg:w-3/4">
            {/* Order info */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-sm bg-slate-100">
              <div className="">
                <p className="flex items-center gap-2 pb-2">
                  <span className="font-bold">Đơn hàng:</span>{' '}
                  <span className="text-primary">
                    {orderDetail?.result?.slug}
                  </span>
                  <OrderStatusBadge order={orderDetail?.result || undefined} />
                </p>
                <div className="flex flex-col gap-1 text-sm font-thin sm:items-center sm:flex-row">
                  <p>
                    {moment(orderDetail?.result?.createdAt).format(
                      'hh:mm:ss DD/MM/YYYY',
                    )}
                  </p>{' '}
                  <div className='hidden sm:block'>
                    |
                  </div>
                  <p className="flex items-center gap-1">
                    <span>Thu ngân:</span>
                    <span className="text-muted-foreground">
                      {`${orderDetail?.result?.owner?.firstName} ${orderDetail?.result?.owner?.lastName} - ${orderDetail?.result?.owner?.phonenumber}`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* Order owner info */}
            <div className="flex gap-2">
              <div className="w-1/2 border border-gray-200 rounded-sm">
                <div className="px-3 py-2 font-bold uppercase bg-slate-100">
                  Khách hàng
                </div>
                <div className="px-3 py-2 text-xs">
                  <p className="font-bold">
                    {`${orderDetail?.result?.owner?.firstName} ${orderDetail?.result?.owner?.lastName}`}
                  </p>
                  <p className="text-sm">
                    {orderDetail?.result?.owner?.phonenumber}
                  </p>
                </div>
              </div>
              <div className="w-1/2 border border-gray-200 rounded-sm">
                <div className="px-3 py-2 font-bold uppercase bg-slate-100">
                  Loại đơn hàng
                </div>
                <div className="px-3 py-2 text-sm">
                  <p>
                    {orderDetail?.result?.type === IOrderType.AT_TABLE
                      ? t('order.dineIn')
                      : t('order.takeAway')}
                  </p>
                  <p className="flex gap-1">
                    <span className="col-span-2">{t('order.tableNumber')}</span>
                    <span className="col-span-1">
                      {orderDetail?.result?.table?.name}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* Order table */}
            <div className="overflow-x-auto">
              <Table className="min-w-full border border-collapse border-gray-300 table-auto">
                <TableCaption>A list of orders.</TableCaption>
                <TableHeader className="bg-gray-200 rounded">
                  <TableRow>
                    <TableHead className="">{t('order.product')}</TableHead>
                    <TableHead>{t('order.quantity')}</TableHead>
                    <TableHead className="text-right">
                      {t('order.unitPrice')}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('order.grandTotal')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetail?.result.orderItems?.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell className="flex flex-col gap-1 font-bold sm:flex-row sm:items-center">
                        <img
                          src={`${publicFileURL}/${item.variant.product.image}`}
                          alt={item.variant.product.image}
                          className="object-cover w-20 h-12 rounded-lg sm:h-16 sm:w-24"
                        />
                        <span className='text-xs sm:text-sm'>{item.variant.product.name} - Size {(item.variant.size.name).toUpperCase()}</span>
                      </TableCell>
                      <TableCell className='text-center'>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {`${orderDetail.result.subtotal.toLocaleString('vi-VN')}đ`}
                      </TableCell>
                      <TableCell className="text-right">
                        {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right, payment*/}
          <div className="flex flex-col w-full gap-2 lg:w-1/4">
            {/* Payment method, status */}
            <div className="border border-gray-200 rounded-sm">
              <div className="px-3 py-2 font-bold uppercase bg-slate-100">
                Phương thức thanh toán
              </div>
              <div className="px-3 py-2">
                <p className="flex items-center gap-1 pb-2">
                  <span className="col-span-1 text-xs font-semibold">
                    {t('paymentMethod.title')}
                  </span>
                  <span className="text-xs">
                    {orderDetail?.result?.payment?.paymentMethod && (
                      <>
                        {orderDetail?.result?.payment.paymentMethod ===
                          'bank-transfer' && (
                            <span>{t('paymentMethod.bankTransfer')}</span>
                          )}
                        {orderDetail?.result?.payment.paymentMethod ===
                          'cash' && <span>{t('paymentMethod.cash')}</span>}
                      </>
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  <span className="col-span-1 text-xs font-semibold">
                    {t('paymentMethod.status')}
                  </span>
                  <span className="col-span-1 text-xs">
                    {orderDetail?.result?.payment && (
                      <PaymentStatusBadge
                        status={orderDetail?.result?.payment?.statusCode}
                      />
                    )}
                  </span>
                </p>
              </div>
            </div>
            {/* Total */}
            <div className="flex flex-col gap-2 p-2 border border-gray-200 rounded-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Tạm tính</p>
                <p>{`${(orderDetail?.result?.subtotal || 0).toLocaleString('vi-VN')}đ`}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Thành tiền</p>
                <p>{`${(orderDetail?.result?.subtotal || 0).toLocaleString('vi-VN')}đ`}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Cần thanh toán</p>
                <p className="text-2xl font-bold text-primary">{`${(orderDetail?.result?.subtotal || 0).toLocaleString('vi-VN')}đ`}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  ({orderDetail?.result?.orderItems?.length} sản phẩm )
                </p>
                <p className="text-sm">(Đã bao gồm VAT)</p>
              </div>
            </div>
            {/* Return order button */}
            <Button
              className="w-full bg-primary"
              onClick={() => {
                navigate('/order-history')
              }}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
