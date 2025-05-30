import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { useTables } from '@/hooks'
import { useUserStore } from '@/stores'
import { useTableColumns } from './DataTable/columns'
import { DataTable } from '@/components/ui'
import { TableAction } from './DataTable/actions'
import { ITable } from '@/types'

export default function TablePage() {
  const { t } = useTranslation(['table'])
  const { t: tHelmet } = useTranslation('helmet')
  const { getUserInfo } = useUserStore()
  const [tableName, setTableName] = useState<string>('')
  const [filteredTables, setFilteredTables] = useState<ITable[]>([])
  const { data: tables, isLoading } = useTables(getUserInfo()?.branch?.slug || '')

  useEffect(() => {
    if (!tables?.result) return;

    if (tableName === '') {
      setFilteredTables(tables.result);
      return;
    }

    const filtered = tables.result.filter((table: ITable) =>
      table.name.toLowerCase().includes(tableName.toLowerCase())
    );
    setFilteredTables(filtered);
  }, [tableName, tables?.result])

  const handleSearchChange = (value: string) => {
    setTableName(value)
  }

  return (
    <div className="flex flex-col flex-1 w-full">
      <Helmet>
        <meta charSet='utf-8' />
        <title>
          {tHelmet('helmet.table.title')}
        </title>
        <meta name='description' content={tHelmet('helmet.table.title')} />
      </Helmet>
      <span className="flex gap-1 items-center text-lg">
        <SquareMenu />
        {t('table.tableTitle')}
      </span>
      <div className="grid grid-cols-1 gap-2 mt-4 h-full">
        <DataTable
          columns={useTableColumns()}
          data={filteredTables || []}
          isLoading={isLoading}
          pages={1}
          hiddenInput={false}
          onInputChange={handleSearchChange}
          actionOptions={TableAction}
          onPageChange={() => { }}
          onPageSizeChange={() => { }}
        />
      </div>
    </div>
    // <div className="pb-4">
    //   <div className="flex gap-2 justify-end items-center py-4">
    //     <CreateTableDialog />
    //   </div>
    //   <div className="rounded-md border">
    //     <div className="flex gap-4 p-4">
    //       <div className="gap-2 flex-center">
    //         <div className="w-4 h-4 rounded-sm border bg-muted-foreground/10" />
    //         <span className="text-sm">{t('table.available')}</span>
    //       </div>
    //       <div className="gap-2 flex-center">
    //         <div className="w-4 h-4 rounded-sm bg-primary" />
    //         <span className="text-sm">{t('table.reserved')}</span>
    //       </div>
    //     </div>
    //     <div className="flex flex-row flex-wrap gap-4 p-4 w-full h-full">
    //       {tables?.result.map((table) => (
    //         <TableItem key={table.slug} table={table} />
    //       ))}
    //     </div>
    //   </div>
    // </div>
  )
}
