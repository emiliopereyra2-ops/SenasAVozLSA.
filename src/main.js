import { CameraPreview } from '@capacitor-community/camera-preview';
import { Capacitor } from '@capacitor/core';

const status = document.getElementById('cameraStatus');
let started = false;
let position = 'front';
const native = Capacitor.isNativePlatform();

async function startCamera() {
  if (!native) {
    status.textContent = 'La vista nativa de cámara requiere la APK instalada.';
    return;
  }
  try {
    status.textContent = 'Solicitando permiso de cámara…';
    // Some plugin releases expose permission methods; if available, request them explicitly.
    if (typeof CameraPreview.requestPermissions === 'function') {
      const perm = await CameraPreview.requestPermissions();
      const cameraStatus = perm?.camera;
      if (cameraStatus === 'denied' || cameraStatus === 'deniedForever') {
        status.textContent = 'Permiso denegado. Android Ajustes > Apps > Señas a Voz LSA > Permisos > Cámara > Permitir.';
        return;
      }
    }
    if (started) {
      await CameraPreview.stop();
      started = false;
    }
    await CameraPreview.start({
      position,
      width: Math.round(window.screen.width),
      height: Math.round(window.screen.height),
      x: 0, y: 0,
      toBack: true,
      enableOpacity: true,
      enableZoom: true,
      disableAudio: true
    });
    started = true;
    status.textContent = 'Cámara activa (' + (position === 'front' ? 'frontal' : 'trasera') + ')';
  } catch (e) {
    started = false;
    const message = e?.message || String(e);
    status.textContent = 'No se pudo abrir cámara: ' + message;
    alert('Error al abrir la cámara: ' + message + '\n\nVerificá permiso en Ajustes > Aplicaciones > Señas a Voz LSA > Permisos > Cámara.');
  }
}
document.getElementById('cam').addEventListener('click', startCamera);
document.getElementById('stop').addEventListener('click', async () => {
  try { if (started) await CameraPreview.stop(); } catch (_) {}
  started = false; status.textContent = 'Cámara detenida';
});
document.getElementById('flip').addEventListener('click', async () => {
  if (!native) return;
  try {
    if (started && typeof CameraPreview.flip === 'function') {
      await CameraPreview.flip();
      position = position === 'front' ? 'rear' : 'front';
      status.textContent = 'Cámara activa (' + (position === 'front' ? 'frontal' : 'trasera') + ')';
    } else {
      position = position === 'front' ? 'rear' : 'front';
      if (started) await startCamera();
    }
  } catch (e) { status.textContent = 'No se pudo cambiar cámara: ' + (e?.message || e); }
});
const input = document.getElementById('txt');
const large = document.getElementById('large');
document.getElementById('show').onclick = () => { large.textContent = input.value; };
document.getElementById('speak').onclick = () => {
  if (!input.value.trim()) return;
  const utterance = new SpeechSynthesisUtterance(input.value);
  utterance.lang = 'es-AR';
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};
['Hola','Gracias','Por favor','Necesito ayuda','Sí','No','¿Cómo estás?','No entiendo'].forEach(phrase => {
  const button = document.createElement('button');
  button.className = 'alt';
  button.textContent = phrase;
  button.onclick = () => { input.value = phrase; large.textContent = phrase; };
  document.getElementById('phrases').append(button);
});
window.addEventListener('pagehide', () => { if (started) CameraPreview.stop().catch(() => {}); });
