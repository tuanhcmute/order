import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { DataTable } from '@/components/ui'
import { useUsers, usePagination } from '@/hooks'
import { useUserListColumns } from './DataTable/columns'
import { Role } from '@/constants'
import { CustomerAction } from './DataTable/actions'

export default function CustomerPage() {
  const { t } = useTranslation(['user'])
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination()

  const { data, isLoading } = useUsers({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    order: 'DESC',
    role: Role.CUSTOMER,
  })

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-transparent">
        <span className="flex w-full items-center justify-start gap-1 text-lg">
          <SquareMenu />
          {t('users.title')}
        </span>
      </div>
      <div className="grid h-full grid-cols-1 gap-2">
        <DataTable
          columns={useUserListColumns()}
          data={data?.result.items || []}
          isLoading={isLoading}
          pages={data?.result.totalPages || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          actionOptions={CustomerAction}
        />
      </div>
    </div>
  )
}