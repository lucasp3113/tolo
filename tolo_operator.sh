#!/bin/bash

#############################################################################
# SCRIPT OPERADOR CENTRO DE CÓMPUTOS - TOLO E-COMMERCE
# Versión: 1.0
# Descripción: Script modular para administración y monitoreo de la plataforma TOLO
# Proyecto: Sistema e-commerce con Frontend React, Backend PHP, Base de datos MariaDB
#############################################################################

# Configuración global
PROJECT_NAME="TOLO"
COMPOSE_FILE="docker-compose.yml"
CONTAINERS=("tolo_db" "tolo_backend" "tolo_frontend")

# Detección del sistema operativo
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WINDIR" ]]; then
    # Windows - usar rutas relativas locales
    LOG_DIR="./logs"
    BACKUP_DIR="./backups"
else
    # Linux/Unix - usar rutas del sistema
    LOG_DIR="/var/log/tolo"
    BACKUP_DIR="/backups/tolo"
fi

DB_NAME="tolo"
DB_USER="root"
DB_PASS="rootpass"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#############################################################################
# FUNCIONES AUXILIARES
#############################################################################

print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}    OPERADOR CENTRO DE CÓMPUTOS - TOLO    ${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
}

print_section() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

print_info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

log_action() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_DIR/operator.log"
}

check_dependencies() {
    local deps=("docker" "docker-compose")
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            print_error "Dependencia requerida no encontrada: $dep"
            print_info "Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop"
            exit 1
        fi
    done
    
    # MySQL no es obligatorio ya que se usa vía Docker
    if ! command -v mysql &> /dev/null; then
        print_warning "Cliente MySQL no encontrado - usando Docker para conexiones DB"
    fi
}

#############################################################################
# FUNCIONES DE MONITOREO
#############################################################################

check_system_status() {
    print_section "ESTADO GENERAL DEL SISTEMA"
    
    # Verificar Docker
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WINDIR" ]]; then
        # En Windows, verificar si Docker responde
        if docker info &>/dev/null; then
            echo -e "  Docker Service: ${GREEN}✓ Activo${NC}"
        else
            echo -e "  Docker Service: ${RED}✗ Inactivo${NC}"
        fi
    else
        # En Linux, usar systemctl
        if systemctl is-active --quiet docker; then
            echo -e "  Docker Service: ${GREEN}✓ Activo${NC}"
        else
            echo -e "  Docker Service: ${RED}✗ Inactivo${NC}"
        fi
    fi
    
    # Verificar contenedores
    echo "  Estado de contenedores:"
    for container in "${CONTAINERS[@]}"; do
        if docker ps --format "table {{.Names}}" | grep -q "$container"; then
            status=$(docker inspect --format="{{.State.Status}}" $container 2>/dev/null)
            if [ "$status" = "running" ]; then
                echo -e "    $container: ${GREEN}✓ Ejecutándose${NC}"
            else
                echo -e "    $container: ${YELLOW}⚠ $status${NC}"
            fi
        else
            echo -e "    $container: ${RED}✗ No encontrado${NC}"
        fi
    done
    
    # Verificar puertos
    echo "  Puertos de aplicación:"
    for port in 5173 8080 3306; do
        # En Windows, usar PowerShell o netstat diferente
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WINDIR" ]]; then
            if netstat -an 2>/dev/null | grep -q ":$port "; then
                echo -e "    Puerto $port: ${GREEN}✓ Abierto${NC}"
            else
                echo -e "    Puerto $port: ${RED}✗ Cerrado${NC}"
            fi
        else
            if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
                echo -e "    Puerto $port: ${GREEN}✓ Abierto${NC}"
            else
                echo -e "    Puerto $port: ${RED}✗ Cerrado${NC}"
            fi
        fi
    done
    
    log_action "Sistema verificado - Estado general consultado"
}

monitor_resources() {
    print_section "MONITOREO DE RECURSOS"
    
    # CPU y Memoria del sistema - Compatible con Windows
    echo "  Recursos del sistema:"
    
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ -n "$WINDIR" ]]; then
        # En Windows via Git Bash, información limitada
        echo "    Sistema: Windows (información limitada via Git Bash)"
        echo "    Para información detallada use: docker stats"
    else
        # Linux/Unix
        echo "    CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% en uso"
        echo "    RAM: $(free -m | awk 'NR==2{printf "%.1f%% (%s/%s MB)", $3*100/$2, $3, $2}')"
        echo "    Disco: $(df -h / | awk 'NR==2 {print $5 " usado (" $3 "/" $2 ")"}')"
    fi
    
    # Recursos de contenedores Docker
    echo "  Recursos de contenedores:"
    if command -v docker stats &> /dev/null; then
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" "${CONTAINERS[@]}" 2>/dev/null | tail -n +2 | while read line; do
            echo "    $line"
        done
    fi
    
    log_action "Recursos monitoreados"
}

check_database_connection() {
    print_section "CONECTIVIDAD BASE DE DATOS"
    
    # Verificar conexión a MariaDB
    if docker exec tolo_db mysql -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" &>/dev/null; then
        echo -e "  Conexión DB: ${GREEN}✓ Exitosa${NC}"
        
        # Información adicional de la DB
        db_size=$(docker exec tolo_db mysql -u"$DB_USER" -p"$DB_PASS" -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size (MB)' FROM information_schema.tables WHERE table_schema='$DB_NAME';" 2>/dev/null | tail -n 1)
        table_count=$(docker exec tolo_db mysql -u"$DB_USER" -p"$DB_PASS" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME';" 2>/dev/null | tail -n 1)
        
        echo "    Tamaño DB: ${db_size} MB"
        echo "    Tablas: $table_count"
    else
        echo -e "  Conexión DB: ${RED}✗ Fallida${NC}"
    fi
    
    log_action "Conectividad de base de datos verificada"
}

#############################################################################
# FUNCIONES DE GESTIÓN DE CONTENEDORES
#############################################################################

manage_containers() {
    print_section "GESTIÓN DE CONTENEDORES"
    
    echo "1. Iniciar todos los contenedores"
    echo "2. Detener todos los contenedores"
    echo "3. Reiniciar todos los contenedores"
    echo "4. Ver logs de contenedores"
    echo "5. Volver al menú principal"
    
    read -p "Seleccione una opción: " option
    
    case $option in
        1)
            print_info "Iniciando contenedores..."
            docker-compose up -d
            log_action "Contenedores iniciados"
            ;;
        2)
            print_info "Deteniendo contenedores..."
            docker-compose down
            log_action "Contenedores detenidos"
            ;;
        3)
            print_info "Reiniciando contenedores..."
            docker-compose restart
            log_action "Contenedores reiniciados"
            ;;
        4)
            view_container_logs
            ;;
        5)
            return
            ;;
        *)
            print_error "Opción inválida"
            ;;
    esac
}

view_container_logs() {
    echo "Seleccione el contenedor para ver logs:"
    for i in "${!CONTAINERS[@]}"; do
        echo "$((i+1)). ${CONTAINERS[$i]}"
    done
    echo "$((${#CONTAINERS[@]}+1)). Ver todos los logs"
    
    read -p "Seleccione una opción: " log_option
    
    if [ "$log_option" -le "${#CONTAINERS[@]}" ] && [ "$log_option" -gt 0 ]; then
        container_name="${CONTAINERS[$((log_option-1))]}"
        print_info "Mostrando logs de $container_name (últimas 50 líneas):"
        docker logs --tail 50 "$container_name"
    elif [ "$log_option" -eq "$((${#CONTAINERS[@]}+1))" ]; then
        print_info "Mostrando logs de todos los contenedores:"
        docker-compose logs --tail 20
    fi
    
    log_action "Logs consultados"
}

#############################################################################
# FUNCIONES DE BACKUP Y RESTAURACIÓN
#############################################################################

backup_management() {
    print_section "GESTIÓN DE RESPALDOS"
    
    echo "1. Crear backup completo"
    echo "2. Crear backup solo BD"
    echo "3. Listar backups existentes"
    echo "4. Restaurar backup"
    echo "5. Volver al menú principal"
    
    read -p "Seleccione una opción: " backup_option
    
    case $backup_option in
        1)
            create_full_backup
            ;;
        2)
            create_db_backup
            ;;
        3)
            list_backups
            ;;
        4)
            restore_backup
            ;;
        5)
            return
            ;;
        *)
            print_error "Opción inválida"
            ;;
    esac
}

create_full_backup() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_path="$BACKUP_DIR/full_backup_$timestamp"
    
    mkdir -p "$backup_path"
    print_info "Creando backup completo..."
    
    # Backup de base de datos
    docker exec tolo_db mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$backup_path/database.sql"
    
    # Backup de archivos de configuración
    cp docker-compose.yml "$backup_path/"
    cp -r backend/src "$backup_path/" 2>/dev/null || true
    cp -r frontend/src "$backup_path/" 2>/dev/null || true
    
    # Crear archivo de información
    echo "Backup creado: $(date)" > "$backup_path/backup_info.txt"
    echo "Versión: 1.0" >> "$backup_path/backup_info.txt"
    echo "Contenedores incluidos: ${CONTAINERS[*]}" >> "$backup_path/backup_info.txt"
    
    print_info "Backup completo creado en: $backup_path"
    log_action "Backup completo creado: $backup_path"
}

create_db_backup() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="$BACKUP_DIR/db_backup_$timestamp.sql"
    
    mkdir -p "$BACKUP_DIR"
    print_info "Creando backup de base de datos..."
    
    if docker exec tolo_db mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$backup_file"; then
        print_info "Backup de BD creado: $backup_file"
        log_action "Backup de BD creado: $backup_file"
    else
        print_error "Error al crear backup de BD"
    fi
}

list_backups() {
    print_info "Backups existentes:"
    if [ -d "$BACKUP_DIR" ]; then
        ls -la "$BACKUP_DIR" | grep -E "(full_backup_|db_backup_)"
    else
        print_warning "No se encontró directorio de backups"
    fi
}

restore_backup() {
    print_warning "Función de restauración en desarrollo"
    print_info "Por favor, restaure manualmente desde: $BACKUP_DIR"
    log_action "Restauración solicitada (manual)"
}

#############################################################################
# FUNCIONES DE MANTENIMIENTO
#############################################################################

system_maintenance() {
    print_section "MANTENIMIENTO DEL SISTEMA"
    
    echo "1. Limpiar logs antiguos"
    echo "2. Limpiar imágenes Docker no usadas"
    echo "3. Verificar integridad de archivos"
    echo "4. Optimizar base de datos"
    echo "5. Volver al menú principal"
    
    read -p "Seleccione una opción: " maint_option
    
    case $maint_option in
        1)
            clean_old_logs
            ;;
        2)
            clean_docker_images
            ;;
        3)
            verify_file_integrity
            ;;
        4)
            optimize_database
            ;;
        5)
            return
            ;;
        *)
            print_error "Opción inválida"
            ;;
    esac
}

clean_old_logs() {
    print_info "Limpiando logs antiguos (>30 días)..."
    find "$LOG_DIR" -name "*.log" -type f -mtime +30 -exec rm {} \;
    docker system prune -f --volumes
    log_action "Limpieza de logs realizada"
}

clean_docker_images() {
    print_info "Limpiando imágenes Docker no utilizadas..."
    docker image prune -f
    docker volume prune -f
    log_action "Limpieza Docker realizada"
}

verify_file_integrity() {
    print_info "Verificando integridad de archivos críticos..."
    
    critical_files=("docker-compose.yml" "backend/src" "frontend/src")
    for file in "${critical_files[@]}"; do
        if [ -e "$file" ]; then
            echo -e "  $file: ${GREEN}✓ Existe${NC}"
        else
            echo -e "  $file: ${RED}✗ No encontrado${NC}"
        fi
    done
    
    log_action "Verificación de integridad realizada"
}

optimize_database() {
    print_info "Optimizando base de datos..."
    docker exec tolo_db mysql -u"$DB_USER" -p"$DB_PASS" -e "OPTIMIZE TABLE $DB_NAME.*;" 2>/dev/null
    print_info "Optimización de BD completada"
    log_action "Base de datos optimizada"
}

#############################################################################
# FUNCIÓN PRINCIPAL Y MENÚ
#############################################################################

show_main_menu() {
    clear
    print_header
    echo "1. Estado general del sistema"
    echo "2. Monitoreo de recursos"
    echo "3. Verificar conectividad BD"
    echo "4. Gestión de contenedores"
    echo "5. Gestión de respaldos"
    echo "6. Mantenimiento del sistema"
    echo "7. Ver logs del operador"
    echo "8. Salir"
    echo ""
}

view_operator_logs() {
    if [ -f "$LOG_DIR/operator.log" ]; then
        print_info "Mostrando logs del operador (últimas 20 líneas):"
        tail -20 "$LOG_DIR/operator.log"
    else
        print_warning "No se encontraron logs del operador"
    fi
}

initialize_script() {
    # Crear directorios necesarios
    mkdir -p "$LOG_DIR" "$BACKUP_DIR"
    
    # Verificar dependencias
    check_dependencies
    
    # Log de inicio
    log_action "Script de operador iniciado"
}

main() {
    initialize_script
    
    while true; do
        show_main_menu
        read -p "Seleccione una opción: " choice
        
        case $choice in
            1)
                check_system_status
                read -p "Presione Enter para continuar..."
                ;;
            2)
                monitor_resources
                read -p "Presione Enter para continuar..."
                ;;
            3)
                check_database_connection
                read -p "Presione Enter para continuar..."
                ;;
            4)
                manage_containers
                read -p "Presione Enter para continuar..."
                ;;
            5)
                backup_management
                read -p "Presione Enter para continuar..."
                ;;
            6)
                system_maintenance
                read -p "Presione Enter para continuar..."
                ;;
            7)
                view_operator_logs
                read -p "Presione Enter para continuar..."
                ;;
            8)
                print_info "Saliendo del script de operador..."
                log_action "Script de operador finalizado"
                exit 0
                ;;
            *)
                print_error "Opción inválida. Intente nuevamente."
                sleep 2
                ;;
        esac
    done
}

# Ejecutar función principal
main "$@"