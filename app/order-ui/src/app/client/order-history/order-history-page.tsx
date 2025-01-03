import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import OrderTabs from './order-tabs'

export default function OrderHistoryPage() {
  const { t } = useTranslation(['menu'])

  return (
    <div className="container py-5">
      <div className="sticky -top-1 z-10 flex flex-col items-center bg-white">
        <span className="flex w-full items-center justify-start gap-1 text-lg">
          <SquareMenu />
          {t('order.title')}
        </span>
      </div>
      <OrderTabs />
    </div>
  )
}
