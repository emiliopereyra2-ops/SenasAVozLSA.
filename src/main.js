import { CameraPreview } from '@capacitor-community/camera-preview';
import { Capacitor } from '@capacitor/core';
const status=document.getElementById('cameraStatus');
let started=false,position='front',motionTimer=null,lastFrame=null,motionN=0;
const native=Capacitor.isNativePlatform();
async function startCamera(){
 if(!native){status.textContent='Instalá la APK para usar la cámara nativa.';return;}
 try{
  status.textContent='Solicitando permiso…';
  if(CameraPreview.requestPermissions){const p=await CameraPreview.requestPermissions();if(p?.camera==='denied'||p?.camera==='deniedForever'){status.textContent='Permiso de cámara denegado';return;}}
  if(started){stopMotion();await CameraPreview.stop();started=false;}
  await CameraPreview.start({position,width:window.screen.width,height:window.screen.height,x:0,y:0,toBack:true,enableOpacity:true,enableZoom:true,disableAudio:true});
  started=true;status.textContent='Cámara activa '+position;startMotion();
 }catch(e){started=false;status.textContent='Error cámara: '+(e.message||e);}
}
function stopMotion(){clearTimeout(motionTimer);motionTimer=null;lastFrame=null;document.getElementById('motionStatus').textContent='Detenido';}
async function motionSample(){
 if(!started||motionTimer===null)return;
 try{
  const r=await CameraPreview.captureSample({quality:20});
  const image=new Image();image.src='data:image/jpeg;base64,'+r.value;
  await new Promise((ok,no)=>{image.onload=ok;image.onerror=no;});
  const canvas=document.createElement('canvas');canvas.width=32;canvas.height=24;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,32,24);
  const d=ctx.getImageData(0,0,32,24).data;const cur=new Uint8Array(768);
  for(let i=0,j=0;i<d.length;i+=4,j++)cur[j]=(d[i]+d[i+1]+d[i+2])/3;
  if(lastFrame){let sum=0;for(let i=0;i<cur.length;i++)sum+=Math.abs(cur[i]-lastFrame[i]);const score=sum/cur.length;
   document.getElementById('motionScore').textContent=score.toFixed(1);
   if(score>12){document.getElementById('motionStatus').textContent='Movimiento detectado';motionN++;document.getElementById('motionCount').textContent=motionN;}
   else document.getElementById('motionStatus').textContent='Sin movimiento significativo';
  }lastFrame=cur;
 }catch(e){document.getElementById('motionStatus').textContent='Error detector: '+(e.message||e);}
 motionTimer=setTimeout(motionSample,900);
}
function startMotion(){stopMotion();motionTimer=1;document.getElementById('motionStatus').textContent='Analizando imagen…';motionSample();}
document.getElementById('cam').onclick=startCamera;
document.getElementById('stop').onclick=async()=>{stopMotion();try{if(started)await CameraPreview.stop();}catch{}started=false;status.textContent='Cámara detenida';};
document.getElementById('flip').onclick=async()=>{if(!native)return;try{if(started&&CameraPreview.flip){stopMotion();await CameraPreview.flip();position=position==='front'?'rear':'front';status.textContent='Cámara activa '+position;startMotion();}else{position=position==='front'?'rear':'front';if(started)await startCamera();}}catch(e){status.textContent='Error cambio cámara: '+(e.message||e);}};
const input=document.getElementById('txt'),large=document.getElementById('large');
document.getElementById('show').onclick=()=>large.textContent=input.value;
document.getElementById('speak').onclick=()=>{if(!input.value.trim())return;const u=new SpeechSynthesisUtterance(input.value);u.lang='es-AR';speechSynthesis.cancel();speechSynthesis.speak(u);};
['Hola','Gracias','Por favor','Necesito ayuda','Sí','No','¿Cómo estás?','No entiendo'].forEach(p=>{const b=document.createElement('button');b.textContent=p;b.onclick=()=>{input.value=p;large.textContent=p;};document.getElementById('phrases').append(b);});
window.addEventListener('pagehide',()=>{stopMotion();if(started)CameraPreview.stop().catch(()=>{});});
