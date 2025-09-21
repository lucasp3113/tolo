## Motor de Búsqueda – MeiliSearch (Solo Desarrollo)
- Si no se activa, el buscador no va a funcionar
- Debido a que el ejecutable pesa ~120 MB, **no se sube directamente al repositorio**, sino que se incluye comprimido en un archivo `meilisearch.zip`.
- Antes de usarlo, se debe **extraer el ZIP** dentro de la carpeta `tolo`.

### Ejecutar MeiliSearch

- Una vez extraído, levantar el motor de búsqueda ejecutando:

```powershell
.\meilisearch\meilisearch-windows-amd64.exe --db-path .\backend\vendor\meilisearch\meili_data\
```

