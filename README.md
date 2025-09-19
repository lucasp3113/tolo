## Motor de Búsqueda – MeiliSearch (Solo Desarrollo)
- Si no se activa, el buscador no va a funcionar
- Debido a que el ejecutable pesa ~120 MB, **no se sube directamente al repositorio**, sino que se incluye comprimido en un archivo `meilisearch.zip`.
- Antes de usarlo, se debe **extraer el ZIP** dentro de la carpeta `tolo`.

### Ejecutar MeiliSearch

- Una vez extraído, levantar el motor de búsqueda ejecutando:

```powershell
.\meilisearch\meilisearch-windows-amd64.exe --db-path .\backend\vendor\meilisearch\meili_data\
```

## 1️⃣ Configuración de red para Ansible
- La VM Ubuntu Server es accesible desde el host mediante SSH.
- Se utiliza la IP asignada por VirtualBox (Host-Only o adaptador puente), conocida y estable durante la sesión.
- Esto permite que Ansible pueda conectarse a la VM sin problemas.

## 2️⃣ Configuración del servicio SSH
- OpenSSH Server instalado y activo en la VM.
- Autenticación por **clave SSH** configurada para permitir conexión automática desde el host sin usar contraseña.
- Esto asegura que Ansible pueda gestionar la VM de manera segura y sin intervención manual.

## 3️⃣ Medios de respaldo y alta disponibilidad
- Se configuró un **backup diario** de las carpetas críticas (`/etc`, `/home/tolo`, `/var/log`) mediante un script (`backup.sh`).
- Los backups se almacenan en `/mnt/backups/daily`.
- Los archivos antiguos se eliminan automáticamente después de **7 días**, para administrar recursos.
- Esto asegura que siempre haya un historial reciente de datos sin llenar el disco.
- Alta disponibilidad mínima: se puede restaurar cualquier backup reciente si falla la VM principal.

## 4️⃣ Archivo crontab con rutinas de backup
- El backup se ejecuta automáticamente todos los días mediante cron.
- El script modular `backup.sh` crea los archivos comprimidos y elimina los antiguos.
- Esto permite mantener los datos seguros y organizados de manera automática.

## 5️⃣ Primera versión del script de operador de centro de cómputos
- `operador.sh` permite:
  - Revisar intentos de login (con `lastb`)
  - Consultar estado de servicios (SSH)
  - Listar backups recientes
- Script modular, fácil de expandir para otras funciones del centro de cómputos.

## 6️⃣ Shell script para acceder a logs de login
- `logins.sh` permite:
  - Ver intentos de login exitosos (`last`)
  - Ver intentos fallidos (`lastb`)
  - Consultar últimos registros de autenticación (`/var/log/auth.log`)
- Facilita la revisión de la seguridad del servidor.

## 7️⃣ Entorno de desarrollo con Docker-Compose
- Archivo `docker-compose.yml` preparado para levantar:
  - Contenedor `web` con Nginx
  - Contenedor `db` con MySQL
- Permite un entorno de desarrollo reproducible y aislado.


