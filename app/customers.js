'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Modal, ConfirmDialog, EmptyState, PageHeader, SearchBar, LoadingSkeleton } from '../../components/ui'
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../lib/firestore'
import toast from 'react-hot-toast'
import { Users, Plus, Pencil, Trash2, Phone, Ruler } from 'lucide-react'

const EMPTY = {
  name:'', phone:'', email:'', address:'',
  measurements:{ chest:'', waist:'', shoulder:'', sleeve:'', neck:'', hip:'', height:'', notes:'' },
}
const MEASUREMENTS = [
  { key:'chest',    label:'Chest',    unit:'in' },
  { key:'waist',    label:'Waist',    unit:'in' },
  { key:'shoulder', label:'Shoulder', unit:'in' },
  { key:'sleeve',   label:'Sleeve',   unit:'in' },
  { key:'neck',     label:'Neck',     unit:'in' },
  { key:'hip',      label:'Hip',      unit:'in' },
  { key:'height',   label:'Height',   unit:'cm' },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDel,   setShowDel]   = useState(false)
  const [editId,    setEditId]    = useState(null)
  const [delId,     setDelId]     = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [tab,       setTab]       = useState('info')

  useEffect(() => { load() }, [])
  useEffect(() => {
    if (!search) { setFiltered(customers); return }
    const t = search.toLowerCase()
    setFiltered(customers.filter(c =>
      c.name?.toLowerCase().includes(t) || c.phone?.includes(t) || c.email?.toLowerCase().includes(t)
    ))
  }, [search, customers])

  const load = async () => {
    try { const d = await getCustomers(); setCustomers(d); setFiltered(d) }
    catch { toast.error('Failed to load customers') }
    finally { setLoading(false) }
  }

  const openAdd  = () => { setEditId(null); setForm(EMPTY); setTab('info'); setShowModal(true) }
  const openEdit = (c) => {
    setEditId(c.id)
    setForm({ name:c.name||'', phone:c.phone||'', email:c.email||'', address:c.address||'',
      measurements:{ ...EMPTY.measurements, ...(c.measurements||{}) } })
    setTab('info'); setShowModal(true)
  }

  const set   = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const setM  = (f, v) => setForm(p => ({ ...p, measurements: { ...p.measurements, [f]: v } }))

  const save = async () => {
    if (!form.name.trim())  { toast.error('Name is required'); return }
    if (!form.phone.trim()) { toast.error('Phone is required'); return }
    setSaving(true)
    try {
      editId ? await updateCustomer(editId, form) : await addCustomer(form)
      toast.success(editId ? 'Customer updated!' : 'Customer added!')
      setShowModal(false); load()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const del = async () => {
    try { await deleteCustomer(delId); toast.success('Deleted'); setShowDel(false); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <DashboardLayout>
      <PageHeader title="Customers" subtitle={`${customers.length} total`}
        action={<button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Customer</button>} />

      <div className="mb-4 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search name, phone..." />
      </div>

      {loading ? <LoadingSkeleton rows={6} /> : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No customers found"
          message={search ? 'Try a different search' : 'Add your first customer'}
          action={!search && <button onClick={openAdd} className="btn-gold text-sm">Add Customer</button>} />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block card p-0 overflow-hidden">
            <table className="w-full table-dark">
              <thead><tr>
                <th className="text-left">Name</th><th className="text-left">Phone</th>
                <th className="text-left">Email</th><th className="text-left">Address</th>
                <th className="text-center">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium text-dark-100">{c.name}</td>
                    <td>{c.phone}</td><td>{c.email||'—'}</td><td>{c.address||'—'}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-dark-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { setDelId(c.id); setShowDel(true) }} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base text-dark-100 font-semibold" style={{ fontFamily:'Playfair Display, serif' }}>{c.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-dark-400 hover:text-gold-500 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { setDelId(c.id); setShowDel(true) }} className="p-1.5 text-dark-400 hover:text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-dark-400 text-sm"><Phone className="w-3.5 h-3.5" /> {c.phone}</div>
                {c.email && <p className="text-dark-500 text-xs mt-1">{c.email}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <Modal title={editId ? 'Edit Customer' : 'Add Customer'} onClose={() => setShowModal(false)} size="lg">
          <div className="flex gap-1 mb-5 bg-dark-900 p-1 rounded-lg">
            {['info','measurements'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-md text-sm capitalize transition-colors ${tab===t ? 'bg-dark-700 text-gold-500 font-semibold' : 'text-dark-400 hover:text-dark-200'}`}>
                {t === 'info' ? '📋 Basic Info' : '📏 Measurements'}
              </button>
            ))}
          </div>

          {tab === 'info' && (
            <div className="space-y-4">
              {[['name','Full Name *','text','Customer name'],['phone','Phone *','tel','9876543210'],['email','Email','email','email@example.com']].map(([f,l,t,p]) => (
                <div key={f}>
                  <label className="block text-dark-300 text-sm mb-1.5">{l}</label>
                  <input className="input-dark" type={t} value={form[f]} onChange={e=>set(f,e.target.value)} placeholder={p} />
                </div>
              ))}
              <div>
                <label className="block text-dark-300 text-sm mb-1.5">Address</label>
                <textarea className="input-dark" rows={2} value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Customer address" />
              </div>
            </div>
          )}

          {tab === 'measurements' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Ruler className="w-4 h-4 text-gold-500" />
                <p className="text-dark-400 text-sm">All in inches unless noted</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {MEASUREMENTS.map(({ key, label, unit }) => (
                  <div key={key}>
                    <label className="block text-dark-300 text-sm mb-1.5">{label} <span className="text-dark-500 text-xs">({unit})</span></label>
                    <input className="input-dark" type="number" step="0.5" value={form.measurements[key]} onChange={e=>setM(key,e.target.value)} placeholder="0" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-dark-300 text-sm mb-1.5">Notes</label>
                <textarea className="input-dark" rows={3} value={form.measurements.notes} onChange={e=>setM('notes',e.target.value)} placeholder="Special instructions..." />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-dark-600 text-dark-300 text-sm">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-gold flex-1 py-2.5 flex items-center justify-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />}
              {editId ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </Modal>
      )}

      {showDel && <ConfirmDialog message="Permanently delete this customer?" onConfirm={del} onCancel={() => setShowDel(false)} />}
    </DashboardLayout>
  )
}
