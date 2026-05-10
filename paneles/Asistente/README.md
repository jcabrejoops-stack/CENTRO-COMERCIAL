# Asistente - Centro Comercial SaaS

Bienvenido al repositorio del panel **Asistente**. Este es un software diseñado para ser rentado a clientes bajo un modelo SaaS, enfocado en el scraping de datos y gestión de prospectos con Inteligencia Artificial.

## Características
- **UI Liquid Glass**: Interfaz moderna optimizada para dispositivos móviles.
- **Seguridad SaaS**: Sistema de login integrado con Supabase Auth.
- **Mapa Satelital**: Visualización de ubicación en tiempo real.
- **Motor de Scraping**: Preparado para conectar con n8n y Google Gemini.
- **Mensajería**: Interfaz estilo WhatsApp para gestión de contactos.

## Configuración Técnica

### 1. Base de Datos (Supabase)
Ejecuta el script SQL que se encuentra en `antigravity/database_setup.sql` dentro del editor SQL de tu panel de Supabase para crear las tablas de Perfiles, Prospectos y Listas.

### 2. Integración n8n
En el archivo `js/app.js`, busca la variable `N8N_WEBHOOK_URL` y coloca la URL de tu flujo de n8n. Este flujo debe recibir el rubro y la ciudad, realizar el scraping y devolver los datos procesados por Gemini.

### 3. Despliegue
Este proyecto está listo para ser desplegado en **Vercel**. Simplemente conecta este repositorio a un nuevo proyecto en Vercel y se publicará automáticamente.

---
*Desarrollado con el apoyo de Antigravity IA.*
