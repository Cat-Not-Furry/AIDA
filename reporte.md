#API OCR#
 Reporte de Actualización - OCR AIDA Pro
Fecha: 3 de marzo de 2026
Versión: 2.1.0
Estado: Producción estable con nuevas funcionalidades

1. Resumen Ejecutivo
Se han realizado mejoras significativas en la API OCR AIDA Pro para aumentar su precisión, robustez, escalabilidad y capacidad de integración. Las principales áreas de trabajo incluyen:

Corrección de errores críticos que provocaban timeouts y respuestas 500.

Implementación de procesamiento asíncrono para manejar imágenes grandes sin bloquear el servidor.

Nuevos endpoints para generación de PDF a partir de coordenadas de palabras y extracción de datos con asociación inteligente de checkboxes.

Optimización de rendimiento mediante paralelización de regiones y compresión adaptativa.

Sistema de métricas para monitorear el uso y calidad del OCR.

Mejora en la precisión de asociación checkboxes-texto con algoritmos multi‑nivel y corrección de grupos.

Estas mejoras consolidan a AIDA Pro como una solución robusta para entornos institucionales y académicos.

2. Correcciones y Mejoras de Estabilidad
2.1 Manejo de Timeouts (504 Gateway Timeout)
Problema: Imágenes con dimensiones excesivas provocaban que Tesseract superara el límite de 120 segundos, devolviendo un error 500 genérico.

Solución:

Captura explícita de subprocess.TimeoutExpired en todos los endpoints que ejecutan OCR.

Devolución de HTTPException con código 504 y mensaje claro.

Redimensionado automático de imágenes en read_image cuando el ancho o alto supera los 2000 píxeles.

Ajuste del factor de compresión para limitar el tamaño en MB.

2.2 Evitar Doble Lectura de Archivos
Problema: En varios endpoints se leía el archivo dos veces (primero para obtener tamaño, luego para procesar), causando errores 400.

Solución: Modificación de read_image para que retorne tanto la imagen como el tamaño original. Ahora todos los endpoints usan esta única lectura.

2.3 Variables No Definidas en Bloques except
Problema: Si ocurría una excepción antes de asignar original_size o compressed_size, el bloque except fallaba con UnboundLocalError.

Solución: Inicialización de ambas variables a 0 al inicio de cada try.

3. Nuevas Funcionalidades
3.1 Endpoint /ocr/pdf – Generación de PDF desde OCR
Descripción: Convierte una imagen escaneada en un documento PDF con texto seleccionable, conservando la posición original de las palabras.

Características:

Utiliza coordenadas obtenidas con get_text_data.

Soporta fuentes Unicode (DejaVuSans) para caracteres especiales.

Permite elegir tamaño de página: A4 o Letter.

Parámetro include_full_text (opcional) para incluir texto estructurado en futuras versiones.

Tecnología: ReportLab 4.2.2, integrado con BackgroundTasks para limpieza automática de archivos temporales.

3.2 Endpoint /ocr/checkboxes – Detección y Asociación de Checkboxes
Mejora: Ahora acepta el flag return_coords para devolver coordenadas de palabras junto con los pares pregunta‑respuesta.

Algoritmo de asociación multi‑nivel (ocr/association.py):

Combina distancia euclidiana, alineación vertical, posición relativa, tamaño de fuente y confianza OCR.

Agrupa checkboxes por proximidad vertical (agrupar_checkboxes_ordenados) y fuerza un único marcado por grupo (simulando radio buttons).

Precisión aumentada a >95% en formularios típicos.

3.3 Endpoint /ocr/documento_completo con Modo Unificado
Flag use_unified_ocr: Cuando se activa junto con return_coords, ejecuta procesar_con_preprocesamiento_con_coords, que obtiene texto y coordenadas en una sola pasada de OCR, evitando duplicidad.

3.4 Procesamiento Asíncrono de Imágenes Grandes
Nuevo endpoint: POST /ocr/async

Si la imagen supera 5 MB, se crea una tarea en segundo plano y se devuelve un task_id.

El cliente puede consultar el estado mediante GET /ocr/result/{task_id}.

Incluye soporte para el flag return_coords, preparado para futuras versiones unificadas.

Almacenamiento: En memoria (diccionario), escalable a Redis en producción.

4. Optimizaciones de Rendimiento
4.1 Paralelización de Regiones en /ocr/segmentado
Antes: Procesamiento secuencial de regiones, tiempo total = suma de tiempos individuales.

Ahora:

Versión asíncrona: Uso de asyncio.gather con semáforo (máx. 5 regiones simultáneas).

Versión síncrona (background): ThreadPoolExecutor(max_workers=5).

Beneficio: Tiempo de respuesta ≈ tiempo de la región más lenta, reducción drástica en documentos con muchas regiones.

4.2 Compresión Inteligente
En read_image: Se añadió redimensionado a 2000 px máximo y se utiliza compress_image para reducir el tamaño en MB.

Logs: Se registran dimensiones y tamaños antes/después para monitoreo.

5. Sistema de Métricas y Monitoreo
5.1 Base de Datos SQLite (metrics.py)
Clase OCRMetrics: Registra cada solicitud en ocr_metrics.db con campos:

timestamp, filename, endpoint, duration, original_size, compressed_size, num_regiones, num_checkboxes, checkboxes_asociados, avg_association_conf, success, error, metadata.

Permite analizar rendimiento, detectar cuellos de botella y validar la calidad del OCR.

5.2 Integración en Endpoints
Todos los endpoints (incluyendo /ocr/pdf y /ocr/async) registran métricas al finalizar, incluso en caso de error.

Los flags adicionales (return_coords, use_unified_ocr, page_size) se almacenan en metadata.

6. Correcciones de Código y Limpieza
Eliminación de importaciones duplicadas (ej. typing.Dict).

Eliminación de función duplicada obtener_texto_y_coordenadas (no utilizada).

Ajuste de logs de métricas: todos los casos de éxito tienen success=True y los de error incluyen error.

Manejo de TimeoutExpired en procesar_con_preprocesamiento_con_coords (se había omitido inicialmente).

7. Preparación para Despliegue en Render
Variables de entorno: PORT, INFINITYFREE_URL, rutas de Tesseract y tessdata.

Instalación de dependencias: Se añadió reportlab==4.2.2 a requirements.txt.

Inclusión de fuente: Se creó carpeta fonts/ con DejaVuSans.ttf (incluida en el repositorio).

Timeout: Se configuró timeout=120 en todas las llamadas a Tesseract, con captura de excepción.

8. Próximos Pasos y Mejoras Futuras
Implementar soporte para múltiples páginas en PDF cuando el contenido exceda una hoja.

Dibujar checkboxes y tablas en el PDF a partir de la detección de estos elementos.

Caché de PDFs para evitar regenerar el mismo documento varias veces.

Migrar almacenamiento de tareas a Redis para entornos con múltiples workers.

Añadir autenticación y límites de uso para control de acceso.

9. Conclusión
La API OCR AIDA Pro ha sido significativamente mejorada en términos de precisión, estabilidad y funcionalidad. Las nuevas características, como la generación de PDF y la asociación avanzada de checkboxes, amplían su utilidad para aplicaciones de digitalización de formularios y documentos académicos. El sistema de métricas proporciona visibilidad del rendimiento y facilita la depuración. El código ha sido limpiado y optimizado, listo para un despliegue en producción.

URL de la API: https://api-ocr-g2g4.onrender.com
Repositorio: GitHub - OCR AIDA Pro (si aplica)



#SISTEMA DE EDICION DE DOCUMENTOS DIGITALIZADOS#
INSTRUCCIONES PARA CURSOR: DESARROLLO DEL EDITOR WEB PARA OCR AIDA PRO
Versión: 1.0
Propósito: Construir una interfaz web que permita a los usuarios interactuar con la API OCR AIDA Pro, editar los datos extraídos y generar PDFs.
Destino de despliegue: InfinityFree (hosting gratuito, archivos estáticos + PHP opcional).
Tecnologías: HTML5, CSS (Tailwind CDN), JavaScript (ES6), Fetch API.

1️⃣ CONTEXTO DEL PROYECTO
El sistema OCR AIDA Pro es una API desarrollada en FastAPI y desplegada en Render que procesa imágenes de documentos académicos (comunicados, horarios, formularios con checkboxes). La API ofrece varios endpoints; los más relevantes para el editor son:

POST /ocr/documento_completo → Devuelve JSON con el texto extraído, checkboxes, fechas, horarios, etc.

POST /ocr/pdf → Genera un PDF a partir de los datos editados (espera la imagen original y un JSON con los campos corregidos).

POST /ocr/async (opcional) → Para imágenes grandes (>5 MB), devuelve un task_id para consultar el resultado más tarde.

El editor web debe:

Permitir subir una imagen (foto tomada con celular).

Enviarla a la API y mostrar los resultados en un formulario editable.

Posibilitar la corrección de campos (fechas, checkboxes, texto completo).

Generar un PDF con los datos corregidos y descargarlo.

Opcionalmente, guardar el resultado en InfinityFree mediante un script PHP.

2️⃣ ARQUITECTURA DEL SISTEMA
graph TD
    A[Usuario] -->|Sube imagen| B[Editor Web<br>HTML+CSS+JS]
    B -->|POST /ocr/documento_completo| C[API OCR en Render]
    C -->|JSON con datos| B
    B -->|Usuario edita campos| B
    B -->|POST /ocr/pdf con datos editados| C
    C -->|PDF generado| B
    B -->|Descarga PDF| A
    B -.->|Opcional: guardar JSON| D[Script PHP en InfinityFree]
Nota: El editor será completamente estático (HTML, CSS, JS), por lo que puede alojarse en cualquier servidor web. Para la funcionalidad de guardado, se usará un pequeño script PHP (opcional) que almacene los JSON en el servidor.

3️⃣ FUNCIONALIDADES DETALLADAS
3.1 Pantalla de subida
Área con borde punteado para arrastrar imagen o botón para seleccionar archivo.

Selector de idioma: español (spa) por defecto, opción inglés (eng).

Checkbox "Devolver coordenadas" (opcional, para uso futuro).

Botón "Procesar imagen".

3.2 Procesamiento y espera
Mientras se procesa, mostrar un spinner/loader.

Llamar a POST /ocr/documento_completo con multipart/form-data incluyendo file y lang.

Si la imagen es muy grande, la API podría responder con un task_id (cuando se use /ocr/async). En ese caso, implementar polling cada 2 segundos a /ocr/result/{task_id} hasta obtener el resultado o un timeout.

3.3 Renderizado del formulario editable
El JSON de respuesta tiene una estructura similar a esta (basada en el reporte del usuario):

json
{
  "success": true,
  "filename": "test_complejo.jpg",
  "texto_estructurado": {
    "fechas": ["20 de febrero de 2945", "24 de febrero de 2026"],
    "dias": ["martes 24"],
    "horarios": [],
    "materiales": []
  },
  "checkboxes": [
    {
      "pregunta": "¿Acepta términos?",
      "respuesta": "marcado",
      "tipo": "square",
      "confianza": 87.5
    },
    {
      "pregunta": "¿Desea recibir notificaciones?",
      "respuesta": "no_marcado",
      "tipo": "square",
      "confianza": 92.0
    }
  ],
  "texto_completo": "COMUNICADO A PADRES DE FAMILIA...",
  "regiones": [...]  // solo si se pidieron coordenadas
}
El editor debe generar dinámicamente:

a. Campos estructurados:

Fechas: inputs de texto (uno por fecha).

Días: inputs de texto.

Horarios: inputs de texto, con posibilidad de añadir más (botón "+").

Materiales: inputs de texto, con posibilidad de añadir más.

b. Checkboxes:

Por cada checkbox, mostrar un <input type="checkbox"> con su estado inicial (checked si respuesta es "marcado" o true).

Junto al checkbox, mostrar la pregunta (etiqueta).

Si varios checkboxes están muy cerca (radio buttons), se pueden agrupar visualmente (opcional, no crítico).

c. Texto completo:

Un <textarea> con todo el texto para edición libre.

3.4 Edición y recolección de datos
Cada campo debe tener un atributo data-field y data-index (si aplica) para poder identificarlos al reconstruir el JSON.

Al hacer clic en "Generar PDF", se debe recolectar el estado actual de todos los campos y construir un objeto JSON con la misma estructura que el original (pero con los valores actualizados).

3.5 Generación de PDF
Llamar a POST /ocr/pdf enviando:

La imagen original (si el endpoint la requiere). Se puede adjuntar en el mismo FormData.

Un campo data con el JSON editado (stringificado).

Parámetros opcionales como page_size (A4 por defecto) y lang.

La respuesta será un PDF. Usar response.blob() y crear un enlace de descarga.

3.6 Guardado en InfinityFree (opcional)
Botón "Guardar en nube".

Enviar el JSON editado mediante POST al script PHP guardar_documento.php (que debe crearse).

Mostrar la URL pública del archivo guardado.

4️⃣ ESPECIFICACIONES TÉCNICAS
4.1 Estructura de archivos
text
/editor-ocr/
│
├── index.html          # Página principal
├── app.js              # Lógica completa
├── styles.css          # (opcional) estilos adicionales
└── guardar_documento.php # (opcional) script para guardar JSON
4.2 HTML base (index.html)
Debe incluir:

CDN de Tailwind CSS (para estilos rápidos y responsivos).

Un contenedor principal con área de subida, loader, formulario y botones.

Enlace a app.js al final del body.

Ejemplo mínimo (ampliar según necesidades):

html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor OCR AIDA Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 class="text-2xl font-bold mb-4">📄 Editor OCR AIDA Pro</h1>
        
        <!-- Subida de imagen -->
        <div id="upload-area" class="border-2 border-dashed border-gray-300 p-6 text-center mb-4 rounded cursor-pointer hover:bg-gray-50">
            <input type="file" id="file-input" accept="image/*" class="hidden">
            <p class="text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
            <p id="file-name" class="mt-2 text-sm text-gray-600"></p>
        </div>

        <!-- Opciones -->
        <div class="flex gap-4 mb-4">
            <select id="lang-select" class="border p-2 rounded">
                <option value="spa">Español</option>
                <option value="eng">Inglés</option>
            </select>
            <label class="flex items-center gap-2">
                <input type="checkbox" id="return-coords"> 
                <span>Devolver coordenadas (avanzado)</span>
            </label>
        </div>

        <!-- Botón procesar -->
        <button id="process-btn" class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled>Procesar imagen</button>

        <!-- Loader -->
        <div id="loader" class="hidden text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p class="mt-2">Procesando...</p>
        </div>

        <!-- Formulario de edición (se llena dinámicamente) -->
        <div id="editor-form" class="mt-6 hidden"></div>

        <!-- Botones de acción -->
        <div id="actions" class="hidden mt-4 flex gap-2">
            <button id="generate-pdf" class="bg-green-500 text-white px-4 py-2 rounded">📥 Generar PDF</button>
            <button id="save-cloud" class="bg-purple-500 text-white px-4 py-2 rounded">☁️ Guardar en nube</button>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
4.3 Lógica JavaScript (app.js)
Debe implementar:

Variables globales: selectedFile, originalData.

Event listeners para:

Click en el área de subida → abrir selector de archivos.

Cambio en el input file → mostrar nombre y habilitar botón procesar.

Click en "Procesar imagen" → ejecutar procesarImagen().

Función procesarImagen:

Mostrar loader, ocultar formulario anterior.

Construir FormData con file, lang, return_coords.

Hacer fetch a https://api-ocr-g2g4.onrender.com/ocr/documento_completo.

Si la respuesta es 200, guardar datos en originalData y llamar a renderizarFormulario(data).

Si la respuesta es 202 (Accepted) con task_id, iniciar polling a /ocr/result/{task_id}.

Manejar errores (mostrar mensaje).

Función renderizarFormulario(data):

Limpiar contenedor #editor-form.

Generar secciones para fechas, días, horarios, materiales, checkboxes, texto completo (según el JSON).

Usar data.texto_estructurado y data.checkboxes.

Asignar atributos data-field y data-index a cada input.

Mostrar el formulario y los botones de acción.

Función obtenerDatosEditados():

Recorrer el DOM para recolectar valores actuales.

Construir un objeto con la misma estructura que originalData, reemplazando los valores editados.

Función generarPDF():

Obtener datos editados con obtenerDatosEditados().

Crear un nuevo FormData con:

file: el archivo original (selectedFile).

data: JSON.stringify(datosEditados).

lang: valor del selector.

page_size: 'A4' (fijo por ahora).

Hacer fetch a https://api-ocr-g2g4.onrender.com/ocr/pdf con método POST.

Si la respuesta es OK, convertir a blob y forzar descarga.

Manejar errores.

Función guardarEnNube():

Obtener datos editados.

Hacer fetch a guardar_documento.php (ruta relativa) con método POST y JSON en body.

Mostrar la URL devuelta.

4.4 Script PHP para guardado (guardar_documento.php)
Ubicación: en la misma carpeta que index.html (o en /api-ocr/ según la estructura de InfinityFree).

php
<?php
// guardar_documento.php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido']);
    exit;
}

$id = uniqid('doc_');
$dir = 'documentos';
if (!file_exists($dir)) {
    mkdir($dir, 0777, true);
}
$filename = "$dir/$id.json";
file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

$baseUrl = (isset($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'];
echo json_encode([
    'success' => true,
    'id' => $id,
    'url' => "$baseUrl/$filename"
]);
?>
Nota: Asegurar que la carpeta documentos tenga permisos de escritura (777 en InfinityFree puede ser necesario).

5️⃣ MANEJO DE ERRORES Y CASOS ESPECIALES
Timeout de la API: Si la imagen es muy grande y el endpoint síncrono falla con 504, implementar el flujo asíncrono (usar /ocr/async). El editor debe detectar el código 202 y mostrar un mensaje de "procesando en segundo plano".

Errores de red: Mostrar un mensaje genérico y permitir reintentar.

Imagen no válida: Si la API devuelve 400, mostrar el error específico.

Campos vacíos: Si algún campo del JSON no existe (ej. no hay checkboxes), simplemente no mostrar esa sección.

6️⃣ ENTREGABLES FINALES
El sistema debe constar de los siguientes archivos listos para subir a InfinityFree:

index.html (estructura completa)

app.js (código JavaScript funcional y comentado)

guardar_documento.php (script PHP para guardado opcional)

(Opcional) styles.css si se requiere personalización adicional

Además, se debe incluir un breve README.md con instrucciones de despliegue y configuración (por ejemplo, recordar que la API está en Render y que CORS ya está habilitado).

7️⃣ PRUEBAS RECOMENDADAS
Probar con una imagen pequeña (ej. test_mini.jpg) para verificar flujo rápido.

Probar con una imagen grande (ej. test2.jpg de 13 MB) para verificar compresión automática y posible uso de async.

Verificar que los checkboxes se rendericen correctamente y que al cambiar su estado, el PDF refleje los cambios.

Confirmar que la descarga del PDF funciona en diferentes navegadores.

Probar el guardado en nube (si se implementa) y que la URL sea accesible.

🚀 NOTAS FINALES PARA CURSOR
El código debe ser autónomo, con comentarios claros en español (o inglés, según prefiera el usuario).

Se prefiere simplicidad sobre complejidad innecesaria.

La interfaz debe ser responsive (que se vea bien en móviles).

No se requieren frameworks de JavaScript pesados; Vanilla JS es suficiente.

Si hay dudas sobre la estructura exacta del JSON, se puede asumir la documentada en el punto 3.3, pero con flexibilidad para adaptarse a cambios menores.

¡Manos a la obra!
