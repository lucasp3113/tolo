## Motor de Búsqueda – MeiliSearch (Solo Desarrollo)
- Si no se activa, el buscador no va a funcionar
- Debido a que el ejecutable pesa ~120 MB, **no se sube directamente al repositorio**, sino que se incluye comprimido en un archivo `meilisearch.zip`.
- Antes de usarlo, se debe **extraer el ZIP** dentro de la carpeta `tolo`.

### Ejecutar MeiliSearch

- Una vez extraído, levantar el motor de búsqueda ejecutando:

```powershell
.\meilisearch\meilisearch-windows-amd64.exe --db-path .\backend\vendor\meilisearch\meili_data\
```


### Manejo del proceso de pago
ya le puse los cookies profe :(
explicacion que te habia dado para no usar cookies:
Para la entrega actual, se optó por usar un estado de React (`useState`) para manejar el proceso de “proceder al pago” en lugar de cookies. Esta decisión busca **hacer que el flujo de compra sea más realista desde ahora**, simulando cómo se manejarían los datos del checkout en una tienda real, y al mismo tiempo deja todo preparado para la siguiente entrega, donde se implementarán:

- **Formulario de envío y método de pago**  
- **Inserción de registros en las tablas `envios` y `pagos` en el backend**  
- **Simulación de transacciones y tracking realista**

**Ventajas de usar `useState` frente a cookies:**

- **Persistencia temporal:** Mantiene los datos mientras el usuario navega por la página.  
- **Seguridad:** No se exponen datos sensibles en el navegador.  
- **Preparación para la integración real:** Facilita enviar los datos al backend en la próxima entrega sin reestructurar la lógica.  
- **Reactividad:** Permite que la interfaz responda automáticamente a cambios, como mostrar un resumen de compra o habilitar botones.
-En resumen, se tomo esta decisión para dejar todo listo para continuar de forma realista.


Otra cosa q vas a notar es que despues de realizar ciertas acciones, no vas a notar una alerta q te diga que la acción tuvo éxito, eso lo vamos a hacer para la tercera entrega, ya q son detalles.
