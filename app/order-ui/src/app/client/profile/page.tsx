import { useTranslation } from 'react-i18next'

import { ProfilePicture } from '@/components/app/avatar'
import { useUploadProfilePicture } from '@/hooks'
import { useUserStore } from '@/stores'
import { publicFileURL } from '@/constants'
import { showToast } from '@/utils'
import { CustomerProfileTabs } from '@/components/app/tabs'

export default function ProfilePage() {
  const { t } = useTranslation(['profile'])
  const { userInfo, setUserInfo } = useUserStore()
  const { mutate: uploadProfilePicture } = useUploadProfilePicture()
  const fullname = userInfo?.firstName + ' ' + userInfo?.lastName

  const handleUploadProfilePicture = (file: File) => {
    uploadProfilePicture(file, {
      onSuccess: (data) => {
        showToast(t('toast.uploadProfilePictureSuccess'))
        setUserInfo(data.result)
      },
    })
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-start gap-10 lg:flex-row">
          {/* ProfilePicture */}
          <div className="w-full rounded-sm bg-white shadow-lg lg:w-1/4">
            <div className="flex flex-row p-2">
              <ProfilePicture
                height={70}
                width={70}
                src={
                  userInfo?.image
                    ? `${publicFileURL}/${userInfo?.image}`
                    : 'https://github.com/shadcn.png'
                }
                onUpload={handleUploadProfilePicture}
              />
              <div className="ml-4 flex flex-col justify-center">
                <span className="font-bold">{fullname}</span>
                <div className="text-description flex items-center text-[13px]">
                  {userInfo?.phonenumber}
                </div>
              </div>
            </div>
          </div>
          {/* Info */}
          <div
            className={`w-full rounded-sm bg-white px-5 py-4 shadow-lg transition-all duration-300 ease-in-out lg:w-3/4`}
          >
            <CustomerProfileTabs />
          </div>
        </div>
      </div>
    </div>
  )
}