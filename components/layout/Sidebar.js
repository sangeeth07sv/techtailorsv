'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import toast from 'react-hot-toast'
import { LayoutDashboard, Users, FileText, Package, Settings, LogOut, Scissors, X, Menu } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers',  icon: Users },
  { href: '/billing',   label: 'Billing',    icon: FileText },
  { href: '/orders',    label: 'Orders',     icon: Package },
  { href: '/settings',  label: 'Settings',   icon: Settings },
]

function NavLinks({ pathname, onClose }) {
  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
              active ? 'nav-active font-semibold' : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700/50'
            }`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try { await logout(); toast.success('Logged out'); router.replace('/login') }
    catch { toast.error('Logout failed') }
  }

  const Logo = () => (
    <div className="p-6 border-b border-dark-700">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
          <Scissors className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-sm font-bold gold-text leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>SANKIRTHI</h1>
          <p className="text-dark-400 text-xs">DESIGNERS</p>
        </div>
      </div>
    </div>
  )

  const LogoutBtn = () => (
    <div className="p-4 border-t border-dark-700">
      <button onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-sm">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-800 border-b border-dark-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-gold-500" />
          <span className="text-sm font-bold gold-text" style={{ fontFamily: 'Playfair Display, serif' }}>SANKIRTHI DESIGNERS</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-dark-300 hover:text-gold-500 p-1">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-dark-800 border-r border-dark-700 flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Logo />
        <NavLinks pathname={pathname} onClose={() => setOpen(false)} />
        <LogoutBtn />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed top-0 left-0 bottom-0 bg-dark-800 border-r border-dark-700 z-30">
        <Logo />
        <NavLinks pathname={pathname} onClose={() => {}} />
        <LogoutBtn />
      </aside>
    </>
  )
}
