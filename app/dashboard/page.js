'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard, LoadingSkeleton, StatusBadge } from '../../components/ui'
import { getDashboardStats, getInvoices, getOrders } from '../../lib/firestore'
import { Users, FileText, IndianRupee, Clock, Package, TrendingUp } from 'lucide-react'
import Link from 'next/link'

function fmtCurrency(n) {
  return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n||0)
}
function fmtDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

export default function DashboardPage() {
  const [stats, setStats]               = useState(null)
  const [recentInvoices, setInvoices]   = useState([])
  const [recentOrders, setOrders]       = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getInvoices(), getOrders()])
      .then(([s, inv, ord]) => {
        setStats(s)
        setInvoices(inv.slice(0, 5))
        setOrders(ord.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-100" style={{ fontFamily:'Playfair Display, serif' }}>Dashboard</h1>
        <p className="text-dark-400 text-sm mt-1">Welcome back — here&apos;s what&apos;s happening today</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-xl shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Customers"  value={stats?.totalCustomers||0}       icon={Users}        color="gold" />
          <StatCard title="Orders"     value={stats?.totalOrders||0}           icon={Package}      color="blue" />
          <StatCard title="Revenue"    value={fmtCurrency(stats?.totalRevenue)} icon={IndianRupee}  color="green" />
          <StatCard title="Pending"    value={stats?.pendingDeliveries||0}     icon={Clock}        color="orange" />
        </div>
      )}

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-dark-100" style={{ fontFamily:'Playfair Display, serif' }}>Recent Invoices</h2>
            <Link href="/billing" className="text-gold-500 text-sm hover:text-gold-400">View all →</Link>
          </div>
          {loading ? <LoadingSkeleton rows={4} /> : recentInvoices.length === 0 ? (
            <p className="text-dark-400 text-sm text-center py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                  <div>
                    <p className="text-dark-100 text-sm font-medium">{inv.customerName}</p>
                    <p className="text-dark-400 text-xs">{inv.invoiceNumber} · {fmtDate(inv.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-500 text-sm font-semibold">{fmtCurrency(inv.grandTotal)}</p>
                    <StatusBadge status={inv.paymentStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-dark-100" style={{ fontFamily:'Playfair Display, serif' }}>Recent Orders</h2>
            <Link href="/orders" className="text-gold-500 text-sm hover:text-gold-400">View all →</Link>
          </div>
          {loading ? <LoadingSkeleton rows={4} /> : recentOrders.length === 0 ? (
            <p className="text-dark-400 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
                  <div>
                    <p className="text-dark-100 text-sm font-medium">{o.customerName}</p>
                    <p className="text-dark-400 text-xs">Due: {o.deliveryDate || '—'}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href:'/customers', label:'Add Customer', icon: Users },
          { href:'/billing',   label:'New Invoice',  icon: FileText },
          { href:'/orders',    label:'Add Order',    icon: Package },
          { href:'/settings',  label:'Settings',     icon: TrendingUp },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className="card flex items-center gap-3 hover:border-gold-500/40 transition-all group p-4">
            <Icon className="w-4 h-4 text-gold-500 group-hover:scale-110 transition-transform" />
            <span className="text-dark-200 text-sm">{label}</span>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
