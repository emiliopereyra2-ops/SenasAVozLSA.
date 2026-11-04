# Señas a Voz LSA

Prototipo para comunicación accesible: cámara (preview), texto grande y síntesis de voz en español.

## Generar APK desde el teléfono
1. Abrí la pestaña **Actions** del repositorio.
2. Si aparece un aviso de workflows, presioná **I understand my workflows, go ahead and enable them**.
3. Elegí **Build Android APK** y tocá **Run workflow** > **Run workflow**.
4. Esperá que el run termine en verde.
5. Abrí ese run y bajá **SenasAVoz-debug-apk** en Artifacts. Extraé el ZIP y dentro está `app-debug.apk`.

## Limitación importante
Esta versión NO detecta ni traduce automáticamente señas de LSA desde la cámara. La cámara solo muestra video; la comunicación se realiza escribiendo, mostrando texto y usando voz sintetizada. La IA de reconocimiento LSA es una etapa posterior que requiere datos/modelo validado.
