import { createBrowserRouter } from 'react-router-dom'

import { Suspense } from 'react'
import { SkeletonCart } from '@/components/app/skeleton'
import { SuspenseElement } from '@/components/app/elements'
import { Role, ROUTE, RoutePermissions } from '@/constants'
import {
  MenuPage,
  StaffLayout,
  LoginPage,
  ConfirmOrderPage,
  TablePage,
  OrderSuccessPage,
  RegisterPage,
  ProductManagementPage,
  LoggerPage,
  ProductDetailPage,
  ProfilePage,
  MenuManagementPage,
  OrderPaymentPage,
  BankConfigPage,
  MenuDetailPage,
  OrderManagementPage,
  OrderHistoryPage,
  OrderDetailPage,
  UserListPage,
  ForgotPasswordPage,
  ConfigPage,
  ForgotPasswordAndResetPasswordPage,
  ClientMenuPage,
  ClientProductDetailPage,
  ClientHomePage,
  ClientCartPage,
} from './loadable'
import ProtectedElement from '@/components/app/elements/protected-element'
import { ClientLandingLayout, ClientLayout } from '@/app/layouts/client'

export const router = createBrowserRouter([
  { path: ROUTE.LOGIN, element: <SuspenseElement component={LoginPage} /> },
  {
    path: ROUTE.REGISTER,
    element: <SuspenseElement component={RegisterPage} />,
  },
  {
    path: ROUTE.FORGOT_PASSWORD,
    element: <SuspenseElement component={ForgotPasswordPage} />,
  },
  {
    path: `${ROUTE.RESET_PASSWORD}`,
    element: <SuspenseElement component={ForgotPasswordAndResetPasswordPage} />,
  },
  {
    path: ROUTE.STAFF_MENU,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={MenuPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_CHECKOUT_ORDER,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={ConfirmOrderPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.ORDER_PAYMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={OrderPaymentPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.ORDER_SUCCESS}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={OrderSuccessPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_ORDER_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.STAFF, Role.CHEF]}
            element={<SuspenseElement component={OrderManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_ORDER_HISTORY,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={OrderHistoryPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_ORDER_HISTORY}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={OrderDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_TABLE_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER, Role.ADMIN]}
            element={<SuspenseElement component={TablePage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_PRODUCT_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.MANAGER]}
            element={<SuspenseElement component={ProductManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_PRODUCT_MANAGEMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.MANAGER]}
            element={<SuspenseElement component={ProductDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_MENU_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={MenuManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_MENU_MANAGEMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.STAFF, Role.CHEF, Role.MANAGER]}
            element={<SuspenseElement component={MenuDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_USER_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]}
            element={<SuspenseElement component={UserListPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_LOG_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]}
            element={<SuspenseElement component={LoggerPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.PROFILE,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[
              Role.CUSTOMER,
              Role.STAFF,
              Role.CHEF,
              Role.MANAGER,
              Role.ADMIN,
              Role.SUPER_ADMIN,
            ]}
            element={<SuspenseElement component={ProfilePage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_BANK_CONFIG}`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN]}
            element={<SuspenseElement component={BankConfigPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.ADMIN_CONFIG}`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN]}
            element={<SuspenseElement component={ConfigPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_HOME,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLandingLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <SuspenseElement component={ClientHomePage} />,
        // element: (
        //   <ProtectedElement
        //     allowedRoles={[Role.CUSTOMER]}
        //     element={<SuspenseElement component={ClientHomePage} />}
        //   />
        // ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_MENU,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientMenuPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.CLIENT_MENU}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientProductDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.CLIENT_CART,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={ClientLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={[Role.CUSTOMER]}
            element={<SuspenseElement component={ClientCartPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.HOME,
    element: <ClientLandingLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            allowedRoles={RoutePermissions[ROUTE.HOME]}
            element={<ClientHomePage />}
          />
        ),
      },
    ],
  },
  // {
  //   path: ROUTE.PERSONAL_ACCOUNT,
  //   element: <SuspenseElement component={DashboardLayout} />,
  //   children: [
  //     {
  //       index: true,
  //       element: (
  //         <ProtectedElement
  //           allowedAuthorities={[Authority.READ_USER]}
  //           element={<SuspenseElement component={PersonalAccountPage} />}
  //         />
  //       )
  //     }
  //   ]
  // },
])
