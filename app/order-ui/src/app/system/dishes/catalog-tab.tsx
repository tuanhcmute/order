import { DataTable } from '@/components/ui'
import { useCatalogColumns } from './DataTable/columns'
import { useCatalogs } from '@/hooks'
import { CatalogActionOptions } from './DataTable/actions'

export default function CatalogTab() {
  const { data: catalogs, isLoading } = useCatalogs()
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row gap-2">
      <DataTable
        columns={useCatalogColumns()}
        data={catalogs?.result || []}
        isLoading={isLoading}
        pages={1}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        actionOptions={CatalogActionOptions}
      />
    </div>
  )
}