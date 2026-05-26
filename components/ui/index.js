'use client'
// Reusable UI components

import { X, AlertTriangle, Inbox, Search } from 'lucide-react'

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, size = 'md' }) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-dark-800 rounded-xl border border-dark-700 shadow-2xl max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-5 border-b border-dark-700 flex-shrink-0">
          <h2 className="text-lg text-dark-100" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-100 hover:bg-dark-700 p-1.5 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Confirm Delete Dialog ──────────────────────────────────────────────────
export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-dark-800 rounded-xl border border-dark-700 shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base text-dark-100" style={{ fontFamily: 'Playfair Display, serif' }}>Confirm Delete</h3>
            <p className="text-dark-400 text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg border border-dark-600 text-dark-300 hover:text-dark-100 text-sm transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-semibold transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ── Status Badge ───────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const styles = {
    paid:      'badge-paid',
    pending:   'badge-pending',
    partial:   'badge-partial',
    cutting:   'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    stitching: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
    trial:     'bg-orange-500/15 text-orange-400 border border-orange-500/20',
    ready:     'bg-green-500/15 text-green-400 border border-green-500/20',
    delivered: 'bg-dark-600/50 text-dark-300 border border-dark-600',
  }
  return (
    <span className={`badge ${styles[status] || 'badge-pending'}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'}
    </span>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-dark-700 mb-4">
        <Icon className="w-6 h-6 text-dark-400" />
      </div>
      <h3 className="text-lg text-dark-200 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h3>
      <p className="text-dark-400 text-sm mb-6 max-w-xs mx-auto">{message}</p>
      {action}
    </div>
  )
}

// ── Loading Skeleton ───────────────────────────────────────────────────────
export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-lg shimmer" />
      ))}
    </div>
  )
}

// ── Page Header ────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl text-dark-100 font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h1>
        {subtitle && <p className="text-dark-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// ── Stat Card ──────────────────────────────────────────────────────────────
export function StatCard({ title, value, icon: Icon, color = 'gold' }) {
  const colors = {
    gold:   'text-gold-500 bg-gold-500/10 border-gold-500/20',
    green:  'text-green-400 bg-green-500/10 border-green-500/20',
    blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  }
  return (
    <div className="card hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-xs uppercase tracking-widest mb-2">{title}</p>
          <p className="text-2xl font-bold text-dark-100" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

// ── Search Bar ─────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className="input-dark pl-9 w-full" />
    </div>
  )
}
