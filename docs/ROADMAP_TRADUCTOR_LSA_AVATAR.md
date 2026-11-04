# Señas a Voz LSA — roadmap de traducción conversacional

## Objetivo de producto
Aplicación Android para comunicación en Lengua de Señas Argentina (LSA), con dos modos:
- **LSA → español:** cámara en flujo continuo, detección de pose/manos, traducción progresiva a texto y estabilidad temporal para evitar duplicados.
- **Español → LSA:** texto completo introducido por el usuario, botón «Traducir», salida de secuencia LSA en avatar 3D o clips de señas validados.

## Principio de honestidad
La cámara nativa actualmente funciona, pero el reconocimiento LSA y el avatar traductor todavía no están implementados. No presentar como traducción funcional ninguna salida que sea texto repetido, gestos genéricos o señas inventadas.

## Arquitectura propuesta
1. Android camera-preview (actual) con captura continua de frames.
2. Detector de pose y manos (landmarks) con timestamp; reducir resolución/frame rate para móvil.
3. Buffer temporal de landmarks, segmentación de señas y estabilización de resultados.
4. Modelo LSA continuo basado en corpus LSA-T / proyecto LSApp, evaluando licencia, dependencias y ejecución (backend inicial o modelo móvil).
5. API de inferencia: clips/frames de landmarks → hipótesis de texto, con confidence, timestamps y estado de stream.
6. Interfaz de subtítulos en vivo: texto incremental, botón limpiar, indicador de confianza y cámara.
7. Español → LSA: parser de frases y diccionario de unidades/frases LSA validadas; salida de animación/avatar mediante secuencia de unidades de señas. No usar traducción literal palabra-por-palabra.
8. Avatar: reproductor de animaciones LSA (gestos de manos, brazos, torso, expresión facial y sincronización), no avatar parlante de lip-sync genérico.
9. Tests con señantes nativos LSA, diversidad de iluminación, distancia, fondos, velocidad y ángulos; medición de latencia y precisión.

## Fases de entrega
- Fase A: UX de cámara continua y subtítulos (sin falsa detección).
- Fase B: integración real del modelo LSA y pruebas con clips de referencia.
- Fase C: salida español → LSA con vocabulario validado y clips/avatar.
- Fase D: optimización de latencia y pruebas Android; APK sólo después de validar cada función.

## Criterios de aceptación
- La cámara puede permanecer abierta y traducir sin botón por seña.
- No duplica palabras sólo por mantener una seña.
- Las pausas no cortan arbitrariamente una frase.
- El texto a LSA produce señas verificadas por usuarios competentes en LSA.
- Mostrar estado de conexión/modelo y no simular traducción cuando no hay modelo disponible.
