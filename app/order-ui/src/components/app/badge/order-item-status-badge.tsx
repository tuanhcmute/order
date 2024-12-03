import { useTranslation } from 'react-i18next'

import { OrderStatus } from '@/types'

interface IOrderItemStatusBadgeProps {
  status: OrderStatus
}

export default function OrderItemStatusBadge({
  status,
}: IOrderItemStatusBadgeProps) {
  const { t } = useTranslation(['menu'])

  const getBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'border-yellow-500 bg-yellow-50 border text-yellow-500 font-semibold'
      case OrderStatus.COMPLETED:
        return 'border-green-500 bg-green-50 border text-green-500 font-semibold'
      case OrderStatus.SHIPPING:
        return 'border-blue-500 bg-blue-50 border text-blue-500 font-semibold'
      case OrderStatus.CANCEL:
        return 'border-destructive bg-destructive/20 border text-destructive'
    }
  }

  const getBadgeText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return t('order.pending')
      case OrderStatus.SHIPPING:
        return t('order.running')
      case OrderStatus.COMPLETED:
        return t('order.completed')
      case OrderStatus.CANCEL:
        return t('order.failed')
    }
  }
  // Ensure the component returns valid JSX
  return (
    <span
      className={`inline-block w-fit px-2 py-1 text-center font-beVietNam text-[0.5rem] ${getBadgeColor(
        status,
      )} rounded-full`}
    >
      {getBadgeText(status)}
    </span>
  )
}
