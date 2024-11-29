import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/components/ui'
import { CreateOrderTrackingByStaffForm } from '@/components/app/form'

export default function CreateOrderTrackingByStaffDialog() {
  const { t } = useTranslation(['menu'])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex justify-start" asChild>
        <Button className="gap-1 text-sm" onClick={() => setIsOpen(true)}>
          {t('order.createOrderTrackingByStaff')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[18rem] overflow-hidden rounded-lg transition-all duration-300 hover:overflow-y-auto sm:max-h-[32rem] sm:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle>{t('order.confirmOrderTrackingByStaff')}</DialogTitle>
          <DialogDescription>
            {t('order.createOrderTrackingByStaffDescription')}
          </DialogDescription>
        </DialogHeader>
        <CreateOrderTrackingByStaffForm onSubmit={setIsOpen} />
      </DialogContent>
    </Dialog>
  )
}
