import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import GoogleMap from './google-map';
import { Logo } from '@/assets/images'
import { ROUTE } from '@/constants'
import { Mail, Phone } from 'lucide-react';

export function ClientFooter() {
  const { t } = useTranslation('sidebar')
  const navigator = useNavigate()
  const mail: string = "trend.coffee.tea@gmail.com"
  return (
    <footer className="text-white bg-primary">
      <div className="container pt-6 pb-6 md:pb-2">
        <div className="grid items-start grid-cols-2 gap-5 lg:grid-cols-4">
          <div className="flex flex-col items-start justify-center gap-2 w-fit">
            <span className="font-bold">
              {t('footer.introduction')}
            </span>
            <span className="text-sm cursor-pointer hover:underline" onClick={() => navigator(ROUTE.HOME)}> {t('footer.home')}</span>
            <span className="text-sm cursor-pointer hover:underline" onClick={() => navigator(ROUTE.CLIENT_MENU)}> {t('footer.menu')}</span>
            <span className="text-sm cursor-pointer hover:underline" onClick={() => navigator(ROUTE.ABOUT)}> {t('footer.aboutMe')}</span>
          </div>
          <div className="flex flex-col items-start justify-center gap-2 w-fit">
            <span className="font-bold">{t('footer.policy')}</span>
            <span className="text-sm cursor-pointer" onClick={() => navigator(ROUTE.POLICY)}>{t('footer.securityTerm')}</span>
         
          </div>
          <div className="flex flex-col items-start justify-center gap-4 w-fit">
            <div className='flex gap-4'> <Phone /> <span className='cursor-pointer'>{t('footer.contact')}: <b>0888022200</b></span></div>
            <div className='flex gap-4'>
              <Mail />
              <span className='cursor-pointer hover:underline' onClick={() => window.location.href = `mailto:${mail}`}>
                <b>{mail}</b>
              </span>
            </div>


            {/* <span className="text-sm">Chính sách bảo mật</span> */}
          </div>
          <div className="relative flex flex-col items-start justify-center col-span-1 gap-4">
            <div className="relative w-[85%]">
              <div className='w-full h-48 rounded-sm'>
                <GoogleMap />
              </div>
              <img
                src={Logo}
                alt="logo"
                className="absolute top-0 left-0 w-auto h-5 m-2" // Đặt Logo ở góc trên trái với margin
              />
            </div>
            {/* <div className="flex gap-2">
              <NavLink
                to={`https://www.facebook.com/thangquyet0501/`}
                className="flex items-center justify-center px-2 text-xs transition-all duration-200 rounded-md hover:scale-105 hover:bg-primary/20 hover:text-primary sm:text-sm"
              >
                <FacebookIcon />
              </NavLink>
              <NavLink
                to={`https://www.youtube.com/@KhoaiLangThang`}
                className="flex items-center justify-center px-2 text-xs transition-all duration-200 rounded-md hover:scale-105 hover:bg-primary/20 hover:text-primary sm:text-sm"
              >
                <YoutubeIcon />
              </NavLink>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
