import {
  Banknote,
  Bolt,
  ClipboardList,
  CookingPot,
  FileChartColumnIncreasing,
  FileText,
  Grid2x2,
  LayoutGrid,
  SquareTerminalIcon,
  Users,
} from 'lucide-react'

import type { ISidebarRoute } from '@/types'
import { Role, ROUTE } from '@/constants'

export const sidebarRoutes: ISidebarRoute[] = [
  {
    title: 'sidebar.dashboard',
    path: ROUTE.DASHBOARD,
    icon: SquareTerminalIcon,
    roles: [Role.MANAGER],
  },
  {
    title: 'sidebar.menu',
    path: ROUTE.STAFF_MENU,
    icon: LayoutGrid,
    roles: [Role.STAFF, Role.CHEF, Role.MANAGER],
  },
  {
    title: 'sidebar.orderManagement',
    path: ROUTE.STAFF_ORDER_MANAGEMENT,
    roles: [Role.STAFF, Role.CHEF, Role.MANAGER],
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.orderHistory',
    path: ROUTE.STAFF_ORDER_HISTORY,
    roles: [Role.STAFF, Role.CHEF, Role.MANAGER],
    icon: FileText,
  },
  {
    title: 'sidebar.tableManagement',
    path: ROUTE.STAFF_TABLE_MANAGEMENT,
    roles: [Role.STAFF, Role.CHEF, Role.MANAGER, Role.ADMIN],
    icon: Grid2x2,
  },
  {
    title: 'sidebar.menuManagement',
    path: ROUTE.STAFF_MENU_MANAGEMENT,
    roles: [Role.STAFF, Role.CHEF, Role.MANAGER],
    icon: ClipboardList,
  },
  {
    title: 'sidebar.dishManagement',
    path: ROUTE.STAFF_PRODUCT_MANAGEMENT,
    roles: [Role.MANAGER],
    icon: CookingPot,
  },
  {
    title: 'sidebar.userManagement',
    path: ROUTE.STAFF_USER_MANAGEMENT,
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    icon: Users,
  },
  {
    title: 'sidebar.logManagement',
    path: ROUTE.STAFF_LOG_MANAGEMENT,
    roles: [Role.ADMIN, Role.SUPER_ADMIN],
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.bankConfig',
    path: ROUTE.STAFF_BANK_CONFIG,
    roles: [Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN],
    icon: Banknote,
  },
  {
    title: 'sidebar.config',
    path: ROUTE.ADMIN_CONFIG,
    roles: [Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN],
    icon: Bolt,
  },
]
