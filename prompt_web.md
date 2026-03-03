Perfecto. Te voy a redactar un **prompt técnico, estructurado y claro**, listo para dárselo a tu IA de programación. Está pensado para que respete arquitectura, no rompa lo existente y construya algo escalable (considerando que vas a usar Supabase).

Puedes copiarlo tal cual 👇

---

# PROMPT PARA IA DE PROGRAMACIÓN

Estoy desarrollando una aplicación web llamada **AIDA – Orientación Educativa** en Next.js. Actualmente ya existe un dashboard base, pero el diseño no coincide con el mockup aprobado y visualmente no es atractivo.

Necesito que realices los siguientes cambios y desarrollos SIN romper la estructura actual del proyecto y manteniendo buenas prácticas (clean architecture, componentes reutilizables, separación UI/lógica).

---

# 1️⃣ REESTRUCTURACIÓN VISUAL (ALTA PRIORIDAD)

## Objetivo:

Ajustar completamente los estilos para que el dashboard se parezca al mockup aprobado.

## Problemas actuales:

* El diseño actual se ve plano.
* Colores incorrectos.
* Espaciados y sombras no coinciden.
* Sidebar visualmente muy oscura.
* Cards sin profundidad ni diseño moderno.
* Tipografía poco estilizada.

## Cambios requeridos:

### 🎨 Diseño general:

* Aplicar diseño moderno, limpio, minimalista.
* Colores suaves azulados.
* Bordes redondeados (border-radius grande).
* Sombras suaves tipo neumorfismo ligero.
* Mejor espaciado interno (padding generoso).
* Layout más aireado.

### 📌 Sidebar:

* Fondo claro (no tan oscuro).
* Iconos modernos.
* Estado activo con fondo resaltado suave.
* Sección de perfil del usuario mejor estilizada.

### 📌 Dashboard:

* Cards con:

  * Icono grande
  * Número destacado
  * Texto secundario
  * Botón con estilo redondeado
* Hero section con fondo degradado suave.
* Imagen ilustrativa alineada correctamente.

⚠️ IMPORTANTE:
No eliminar lógica existente. Solo modificar estilos y estructura visual.

---

# 2️⃣ IMPLEMENTAR LOGIN BÁSICO CON SUPABASE

Necesito que se implemente autenticación usando Supabase.

## Requisitos:

* Página `/login`
* Registro de usuario
* Inicio de sesión
* Protección de rutas (middleware)
* Redirección automática al dashboard si ya está autenticado
* Logout funcional

## Consideraciones:

* Usar Supabase Auth
* Guardar sesión correctamente
* Manejar estado global de usuario
* Toda acción futura debe estar vinculada al usuario autenticado

---

# 3️⃣ MODIFICAR SECCIÓN "PLANTILLAS"

En la barra lateral, la opción **Plantillas** debe dirigir a una nueva página funcional para pruebas del módulo OCR.

Ruta sugerida:
`/plantillas`

---

# 4️⃣ PÁGINA DE PRUEBAS OCR (MÓDULO EXPERIMENTAL)

Esta página debe tener:

## Dos botones principales:

### 🔹 1. Escanear Plantillas

### 🔹 2. Escanear Documentos

Diseño:

* Dos cards grandes.
* Íconos ilustrativos.
* Descripción debajo de cada botón.

---

# 5️⃣ FUNCIONALIDAD: ESCANEAR PLANTILLAS

Flujo esperado:

1. Usuario sube o escanea un documento base.
2. Se procesa con OCR (simulado por ahora).
3. Se genera una vista editable del documento:

   * Todo el texto detectado.
   * Campos rellenables convertidos en inputs.
4. El usuario puede:

   * Editar texto si el OCR se equivocó.
   * Ajustar campos.
5. Al confirmar:

   * Se guarda la plantilla en formato JSON en Supabase.
   * Se almacena metadata:

     * user_id
     * nombre de plantilla
     * fecha
     * estructura de campos

---

# 6️⃣ VISUALIZACIÓN DE PLANTILLAS GUARDADAS

En la misma sección debe existir:

## Vista en cuadrícula (grid)

Cada plantilla debe mostrar:

* Nombre
* Fecha
* Cantidad de documentos generados
* Botón "Ver"

Al entrar a una plantilla:

* Mostrar todos los PDFs generados a partir de ella.
* Botón para:

  * Generar nuevo documento
  * Subir PDF manual relacionado

---

# 7️⃣ FUNCIONALIDAD: GENERAR DOCUMENTO DESDE PLANTILLA

Flujo:

1. Seleccionar plantilla.
2. Mostrar formulario con los campos dinámicos (basados en el JSON guardado).
3. Usuario llena los campos.
4. Se genera PDF.
5. PDF se guarda en Supabase Storage.
6. Se relaciona con:

   * plantilla_id
   * user_id

---

# 8️⃣ FUNCIONALIDAD: ESCANEAR DOCUMENTOS

Este botón debe permitir:

* Escanear múltiples hojas.
* Convertirlas en un solo PDF.
* Asociarlas a una plantilla seleccionada.
* Guardarlas en Supabase Storage.
* Registrar metadata en base de datos.

---

# 9️⃣ ESTRUCTURA DE BASE DE DATOS (SUPABASE)

Diseñar tablas:

## users

(se usa auth de Supabase)

## templates

* id
* user_id
* name
* json_structure
* created_at

## documents

* id
* user_id
* template_id
* file_url
* created_at

⚠️ Todo debe estar vinculado al usuario autenticado.

---

# 🔟 CONSIDERACIONES IMPORTANTES

* No romper código existente.
* Mantener arquitectura limpia.
* Usar componentes reutilizables.
* Preparar todo para que el módulo OCR real se conecte fácilmente.
* Código escalable.
* Evitar hardcode.
* Usar buenas prácticas de seguridad.
* Manejar estados de carga.
* Manejar errores.

---

# TECNOLOGÍAS

* Next.js
* Supabase
* Supabase Storage
* Tailwind CSS (si ya está en el proyecto)
* Generación de PDF en frontend

---

# RESULTADO ESPERADO

1. UI alineada con el mockup.
2. Login funcional.
3. Sección Plantillas completamente estructurada.
4. Arquitectura lista para integrar OCR real.
5. Base lista en Supabase.
6. Todo vinculado por usuario.

---

Si quieres, ahora puedo:

* 🔥 Hacer una versión aún más técnica orientada a IA tipo Copilot / Cursor
* 🧠 Diseñarte la arquitectura de carpetas ideal
* 🗄️ Diseñarte el esquema exacto SQL para Supabase
* 🎨 Hacer la paleta exacta para que coincida con tu mockup
* 🚀 Dividir esto en fases para que no se rompa nada

Tú dime qué quieres hacer primero.
