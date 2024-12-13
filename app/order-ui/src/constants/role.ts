import { ROUTE } from './route'

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  CHEF = 'CHEF',
  CUSTOMER = 'CUSTOMER',
}

// Định nghĩa quyền truy cập cho từng route
export const RoutePermissions: Record<string, Role[]> = {
  // Admin routes
  [ROUTE.STAFF_HOME]: [Role.SUPER_ADMIN, Role.ADMIN, Role.CUSTOMER],
  [ROUTE.STAFF_ORDER_MANAGEMENT]: [Role.SUPER_ADMIN, Role.ADMIN],
  [ROUTE.STAFF_ORDER_HISTORY]: [Role.SUPER_ADMIN, Role.ADMIN],
  [ROUTE.STAFF_USER_MANAGEMENT]: [Role.SUPER_ADMIN, Role.ADMIN],
  [ROUTE.STAFF_LOG_MANAGEMENT]: [Role.SUPER_ADMIN, Role.ADMIN],
  [ROUTE.STAFF_BANK_CONFIG]: [Role.SUPER_ADMIN, Role.ADMIN],

  // Manager routes
  [ROUTE.STAFF_ORDER_MANAGEMENT]: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  [ROUTE.STAFF_ORDER_HISTORY]: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  [ROUTE.STAFF_PRODUCT_MANAGEMENT]: [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.MANAGER,
  ],
  [ROUTE.STAFF_MENU_MANAGEMENT]: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],

  // Staff routes
  [ROUTE.STAFF_MENU]: [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.MANAGER,
    Role.CUSTOMER,
    Role.STAFF,
  ],
  [ROUTE.STAFF_CHECKOUT_ORDER]: [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.MANAGER,
    Role.STAFF,
    Role.CUSTOMER,
  ],
  [ROUTE.STAFF_TABLE_MANAGEMENT]: [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.MANAGER,
    Role.STAFF,
  ],

  // Chef routes
  [ROUTE.STAFF_ORDER_MANAGEMENT]: [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.MANAGER,
    Role.CHEF,
  ],
}