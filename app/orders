'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Modal, ConfirmDialog, EmptyState, PageHeader, StatusBadge, SearchBar, LoadingSkeleton } from '../../components/ui'
import { getOrders, addOrder, updateOrder, deleteOrder, getCustomers } from '../../lib/firestore'
import toast from 'react-hot-toast'
import { Package, Plus, Pencil, Trash2, MessageCircle } from 'lucide-react'

const STATUSES = ['cutting','stitching','trial','ready','delivered']
const WA_MSG = {
  cutting:   '✂️ Your order is being cut and prepared.',
  stitching: '🧵 Your garment is currently being stitched.',
  trial:     '👗 Your garment is ready for a trial fitting.',
  ready:     '✅ Your order is ready for pickup!',
  delivered: '🎉 Your order has been delivered. Thank you!',
}
const EMPTY = { customerId:'', customerName:'', customerPhone:'', description:'', status:'cutting', deliveryDate:'', notes:'' }

export default function OrdersPage() {
  const [orders,    setOrders]    = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [customers, setCusts]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDel,   setShowDel]   = useState(false)
  const [editId,    setEditId]    = useState(null)
  const [delId,     setDelId]     = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => { loadAll() }, [])
  useEffect(() => {
    let r = orders
    if (filter !== 'all') r = r.filter(o => o.status === filter)
    if (search) { const t=search.toLowerCase(); r=r.filter(o=>o.customerName?.toLowerCase().includes(t)||o.description?.toLowerCase().includes(t)) }
    setFiltered(r)
  }, [search, filter, orders])

  const loadAll = async () => {
    try { const [o,c]=await Promise.all([getOrders(),getCustomers()]); setOrders(o); setFiltered(o); setCusts(c) }
    catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const pickCust = (id) => {
    const c = customers.find(c=>c.id===id)
    if (!c) return
    setForm(f=>({...f,customerId:id,customerName:c.name,customerPhone:c.phone||''}))
  }

  const openAdd  = () => { setEditId(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (o) => { setEditId(o.id); setForm({ customerId:o.customerId||'', customerName:o.customerName||'', customerPhone:o.customerPhone||'', description:o.description||'', status:o.status||'cutting', deliveryDate:o.deliveryDate||'', notes:o.notes||'' }); setShowModal(true) }

  const save = async () => {
    if (!form.customerId)  { toast.error('Select a customer'); return }
    if (!form.description) { toast.error('Description required'); return }
    setSaving(true)
    try {
      editId ? await updateOrder(editId,form) : await addOrder(form)
      toast.success(editId ? 'Order updated!' : 'Order added!')
      setShowModal(false); loadAll()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const del = async () => {
    try { await deleteOrder(delId); toast.success('Deleted'); setShowDel(false); loadAll() }
    catch { toast.error('Delete failed') }
  }

  const quickStatus = async (id, status) => {
    try { await updateOrder(id,{status}); toast.success(`Status: ${status}`); loadAll() }
    catch { toast.error('Update failed') }
  }

  const sendWA = (o) => {
    const phone = o.customerPhone?.replace(/\D/g,'')
    if (!phone) { toast.error('No phone number'); return }
    const msg = encodeURIComponent(`Hello ${o.customerName},\n\n${WA_MSG[o.status]||'Order status updated.'}\n\nOrder: ${o.description}${o.deliveryDate?`\nDelivery: ${o.deliveryDate}`:''}\n\nThank you,\nSankirthi Designers\n📞 9787384280`)
    window.open(`https://wa.me/91${phone}?text=${msg}`,'_blank')
  }

  return (
    <DashboardLayout>
      <PageHeader title="Orders" subtitle={`${orders.length} total`}
        action={<button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>Add Order</button>} />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Search orders..." /></div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all',...STATUSES].map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap transition-colors ${filter===s ? 'bg-gold-500 text-dark-900 font-semibold' : 'border border-dark-700 text-dark-400 hover:border-dark-500 hover:text-dark-200'}`}>
              {s==='all'?'All':s}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSkeleton rows={6} /> : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No orders found"
          message={search||filter!=='all' ? 'Try different filters' : 'Add your first order'}
          action={!search&&filter==='all'&&<button onClick={openAdd} className="btn-gold text-sm">Add Order</button>} />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block card p-0 overflow-hidden">
            <table className="w-full table-dark">
              <thead><tr>
                <th className="text-left">Customer</th><th className="text-left">Description</th>
                <th className="text-left">Status</th><th className="text-left">Delivery</th>
                <th className="text-center">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(o=>(
                  <tr key={o.id}>
                    <td><p className="text-dark-100 font-medium">{o.customerName}</p><p className="text-dark-500 text-xs">{o.customerPhone}</p></td>
                    <td className="text-dark-200">{o.description}</td>
                    <td>
                      <select value={o.status} onChange={e=>quickStatus(o.id,e.target.value)}
                        className="bg-dark-700 border border-dark-600 text-dark-200 rounded-lg px-2 py-1 text-xs cursor-pointer capitalize">
                        {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td>{o.deliveryDate||'—'}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={()=>sendWA(o)} className="p-1.5 text-dark-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="WhatsApp"><MessageCircle className="w-4 h-4"/></button>
                        <button onClick={()=>openEdit(o)} className="p-1.5 text-dark-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"><Pencil className="w-4 h-4"/></button>
                        <button onClick={()=>{setDelId(o.id);setShowDel(true)}} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map(o=>(
              <div key={o.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div><p className="text-dark-100 font-medium text-sm">{o.customerName}</p><p className="text-dark-400 text-xs">{o.customerPhone}</p></div>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-dark-300 text-sm mb-2">{o.description}</p>
                {o.deliveryDate && <p className="text-dark-500 text-xs mb-3">📅 {o.deliveryDate}</p>}
                <div className="flex gap-2">
                  <button onClick={()=>sendWA(o)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5"/>WhatsApp
                  </button>
                  <button onClick={()=>openEdit(o)} className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-dark-600 text-dark-400 text-xs hover:border-gold-500/40 hover:text-gold-400 transition-colors"><Pencil className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>{setDelId(o.id);setShowDel(true)}} className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <Modal title={editId?'Edit Order':'Add Order'} onClose={()=>setShowModal(false)} size="md">
          <div className="space-y-4">
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Customer *</label>
              <select className="input-dark" value={form.customerId} onChange={e=>pickCust(e.target.value)}>
                <option value="">Choose a customer...</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Description *</label>
              <input className="input-dark" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Saree blouse, Men's suit..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-300 text-sm mb-1.5">Status</label>
                <select className="input-dark" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-dark-300 text-sm mb-1.5">Delivery Date</label>
                <input type="date" className="input-dark" value={form.deliveryDate} onChange={e=>setForm(f=>({...f,deliveryDate:e.target.value}))} />
              </div>
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Notes</label>
              <textarea className="input-dark" rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Special instructions..." />
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-dark-600 text-dark-300 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-gold flex-1 py-2.5 flex items-center justify-center gap-2">
                {saving&&<div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"/>}
                {editId?'Save Changes':'Add Order'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showDel&&<ConfirmDialog message="Permanently delete this order?" onConfirm={del} onCancel={()=>setShowDel(false)} />}
    </DashboardLayout>
  )
}
