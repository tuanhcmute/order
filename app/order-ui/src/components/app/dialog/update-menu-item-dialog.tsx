import { useState } from 'react'
import { PenSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IMenuItem } from '@/types'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  ScrollArea,
} from '@/components/ui'
import { UpdateMenuItemForm } from '@/components/app/form'

interface UpdateMenuItemDialogProps {
  menuItem: IMenuItem
}

export default function UpdateMenuItemDialog({
  menuItem,
}: UpdateMenuItemDialogProps) {
  const { t } = useTranslation(['menu'])
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-1 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <PenSquare className="icon" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-0 sm:max-w-[44rem]">
        <DialogHeader className="px-6">
          <DialogTitle>{t('menu.updateMenuItem')}</DialogTitle>
          <DialogDescription>
            {t('menu.updateMenuItemDescription')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[24rem] px-6">
          <UpdateMenuItemForm onSubmit={handleSubmit} menuItem={menuItem} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}