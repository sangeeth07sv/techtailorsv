// lib/storage.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadLogo(file) {
  const snap = await uploadBytes(ref(storage, 'shop/logo'), file)
  return getDownloadURL(snap.ref)
}

export async function uploadQRCode(file) {
  const snap = await uploadBytes(ref(storage, 'shop/qrcode'), file)
  return getDownloadURL(snap.ref)
}
