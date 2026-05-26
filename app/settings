'use client'
import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageHeader } from '../../components/ui'
import { getSettings, saveSettings } from '../../lib/firestore'
import { uploadLogo, uploadQRCode } from '../../lib/storage'
import toast from 'react-hot-toast'
import { Upload, CheckCircle, Scissors } from 'lucide-react'

export default function SettingsPage() {
  const [form,    setForm]    = useState({ shopName:'SANKIRTHI DESIGNERS', ownerName:'VASANTHAMANI S', gstNumber:'9785425325605', phone:'9787384280', address:'Coimbatore', email:'vasanthamani420@gmail.com', taxPercent:5, logoUrl:'', qrCodeUrl:'' })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [upLogo,  setUpLogo]  = useState(false)
  const [upQR,    setUpQR]    = useState(false)
  const [logoP,   setLogoP]   = useState('')
  const [qrP,     setQrP]     = useState('')
  const logoRef = useRef()
  const qrRef   = useRef()

  useEffect(() => {
    getSettings().then(d => {
      setForm(d)
      if (d.logoUrl)   setLogoP(d.logoUrl)
      if (d.qrCodeUrl) setQrP(d.qrCodeUrl)
    }).catch(()=>toast.error('Failed to load settings'))
    .finally(()=>setLoading(false))
  }, [])

  const set = (f,v) => setForm(p=>({...p,[f]:v}))

  const handleLogo = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogoP(ev.target.result)
    reader.readAsDataURL(file)
    setUpLogo(true)
    try { const url=await uploadLogo(file); setForm(f=>({...f,logoUrl:url})); toast.success('Logo uploaded!') }
    catch { toast.error('Logo upload failed') }
    finally { setUpLogo(false) }
  }

  const handleQR = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setQrP(ev.target.result)
    reader.readAsDataURL(file)
    setUpQR(true)
    try { const url=await uploadQRCode(file); setForm(f=>({...f,qrCodeUrl:url})); toast.success('QR Code uploaded!') }
    catch { toast.error('QR upload failed') }
    finally { setUpQR(false) }
  }

  const handleSave = async () => {
    if (!form.shopName) { toast.error('Shop name required'); return }
    setSaving(true)
    try { await saveSettings(form); toast.success('Settings saved!') }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  if (loading) return <DashboardLayout><div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-32 rounded-xl shimmer"/>)}</div></DashboardLayout>

  const Field = ({f,label,type='text',placeholder}) => (
    <div>
      <label className="block text-dark-300 text-sm mb-1.5">{label}</label>
      <input className="input-dark" type={type} value={form[f]||''} onChange={e=>set(f,type==='number'?Number(e.target.value):e.target.value)} placeholder={placeholder} />
    </div>
  )

  return (
    <DashboardLayout>
      <PageHeader title="Settings" subtitle="Manage shop information and preferences" />
      <div className="max-w-2xl space-y-6">

        {/* Shop Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Scissors className="w-4 h-4 text-gold-500" />
            <h2 className="text-lg text-dark-100" style={{ fontFamily:'Playfair Display, serif' }}>Shop Information</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field f="shopName"   label="Shop Name"   placeholder="Shop name" />
              <Field f="ownerName"  label="Owner Name"  placeholder="Owner name" />
              <Field f="gstNumber"  label="GST Number"  placeholder="GST number" />
              <Field f="phone"      label="Phone"       type="tel" placeholder="Phone number" />
              <Field f="email"      label="Email"       type="email" placeholder="Email" />
              <Field f="taxPercent" label="Default GST %" type="number" placeholder="5" />
            </div>
            <div>
              <label className="block text-dark-300 text-sm mb-1.5">Address</label>
              <textarea className="input-dark" rows={2} value={form.address||''} onChange={e=>set('address',e.target.value)} placeholder="Shop address" />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-4 h-4 text-gold-500" />
            <h2 className="text-lg text-dark-100" style={{ fontFamily:'Playfair Display, serif' }}>Shop Logo</h2>
          </div>
          <p className="text-dark-400 text-sm mb-4">Appears on all printed invoices. PNG with transparent background recommended.</p>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-xl border border-dark-600 flex items-center justify-center bg-dark-700 overflow-hidden flex-shrink-0">
              {logoP ? <img src={logoP} alt="Logo" className="w-full h-full object-contain p-2" /> : <Scissors className="w-8 h-8 text-dark-500" />}
            </div>
            <div>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              <button onClick={()=>logoRef.current?.click()} disabled={upLogo}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dark-600 text-dark-300 text-sm hover:border-gold-500/40 hover:text-gold-400 transition-colors">
                {upLogo ? <div className="w-4 h-4 border-2 border-dark-400 border-t-transparent rounded-full animate-spin"/> : <Upload className="w-4 h-4"/>}
                {logoP ? 'Replace Logo' : 'Upload Logo'}
              </button>
              {form.logoUrl && <p className="text-green-400 text-xs mt-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/>Saved to cloud</p>}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-4 h-4 text-gold-500" />
            <h2 className="text-lg text-dark-100" style={{ fontFamily:'Playfair Display, serif' }}>Payment QR Code</h2>
          </div>
          <p className="text-dark-400 text-sm mb-4">Your UPI QR code appears on every invoice. Upload your GPay, PhonePe, or bank QR image.</p>
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-xl border border-dark-600 flex items-center justify-center bg-dark-700 overflow-hidden flex-shrink-0">
              {qrP ? <img src={qrP} alt="QR Code" className="w-full h-full object-contain p-2" /> : <div className="text-center p-2"><p className="text-dark-500 text-xs">No QR Code</p></div>}
            </div>
            <div>
              <input ref={qrRef} type="file" accept="image/*" onChange={handleQR} className="hidden" />
              <button onClick={()=>qrRef.current?.click()} disabled={upQR}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dark-600 text-dark-300 text-sm hover:border-gold-500/40 hover:text-gold-400 transition-colors">
                {upQR ? <div className="w-4 h-4 border-2 border-dark-400 border-t-transparent rounded-full animate-spin"/> : <Upload className="w-4 h-4"/>}
                {qrP ? 'Replace QR Code' : 'Upload QR Code'}
              </button>
              {form.qrCodeUrl && <p className="text-green-400 text-xs mt-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/>Appears on all invoices</p>}
              <p className="text-dark-500 text-xs mt-2">Supports JPG, PNG, WebP</p>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="btn-gold w-full py-3 flex items-center justify-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"/> : <CheckCircle className="w-4 h-4"/>}
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </DashboardLayout>
  )
}
