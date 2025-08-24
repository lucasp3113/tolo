#!/bin/bash

# Script Modular para Gestión de Logs del Sistema
# Proyecto: TOLO E-commerce
# Versión: 2.0 - Adaptado para BD MySQL local

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
LOG_DIR="/var/log"
DOCKER_COMPOSE_PATH="./docker-compose.yml"
APP_NAME="tolo"
DB_NAME="tolo"
DB_USER="root"  # Ajustar según su configuración
BACKEND_LOG_PATH="./backend/logs"
MYSQL_LOG_PATH="/var/log/mysql"

# Función para mostrar el menú principal
show_menu() {
    clear
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}   GESTOR DE LOGS - TOLO SYSTEM${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} Ver logs de autenticación (exitosos)"
    echo -e "${GREEN}2.${NC} Ver logs de autenticación (fallidos)"
    echo -e "${GREEN}3.${NC} Ver logs de aplicación (Frontend/Backend)"
    echo -e "${GREEN}4.${NC} Ver logs de base de datos MySQL"
    echo -e "${GREEN}5.${NC} Ver logs del sistema"
    echo -e "${GREEN}6.${NC} Consultar actividad de usuarios"
    echo -e "${GREEN}7.${NC} Generar reporte de logs"
    echo -e "${GREEN}8.${NC} Monitoreo en tiempo real"
    echo -e "${GREEN}9.${NC} Limpiar logs antiguos"
    echo -e "${GREEN}10.${NC} Configuración"
    echo -e "${RED}11.${NC} Salir"
    echo ""
    echo -n "Seleccione una opción: "
}

# Función para logs de autenticación exitosos
show_successful_logins() {
    echo -e "${GREEN}=== LOGS DE AUTENTICACIÓN EXITOSOS ===${NC}"
    echo ""
    
    # SSH successful logins
    if [ -f "/var/log/auth.log" ]; then
        echo -e "${YELLOW}Logins SSH exitosos (últimos 15):${NC}"
        grep "Accepted" /var/log/auth.log | tail -15
        echo ""
    fi
    
    # Application login logs from backend
    echo -e "${YELLOW}Logs de aplicación - Logins exitosos en TOLO:${NC}"
    if docker-compose -f $DOCKER_COMPOSE_PATH logs backend 2>/dev/null | grep -iE "login.*success|authentication.*success|usuario.*conectado|sesion.*iniciada" | tail -10; then
        echo ""
    else
        echo "No se encontraron logs de login exitosos en la aplicación."
        echo "Tip: Los logs aparecerán cuando los usuarios se autentiquen en su ecommerce."
    fi
    
    # Database connection logs
    echo -e "${YELLOW}Conexiones exitosas a MySQL:${NC}"
    if [ -f "$MYSQL_LOG_PATH/mysql.log" ]; then
        grep -i "connect" $MYSQL_LOG_PATH/mysql.log | tail -5
    elif mysql -u$DB_USER -e "SELECT User, Host FROM mysql.user LIMIT 5;" 2>/dev/null; then
        echo "Base de datos MySQL activa y accesible"
    else
        echo "No se puede acceder a los logs de MySQL o la BD no está activa"
    fi
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para logs de autenticación fallidos
show_failed_logins() {
    echo -e "${RED}=== LOGS DE AUTENTICACIÓN FALLIDOS ===${NC}"
    echo ""
    
    # SSH failed attempts
    if [ -f "/var/log/auth.log" ]; then
        echo -e "${YELLOW}Intentos SSH fallidos (últimos 15):${NC}"
        grep "Failed password\|authentication failure" /var/log/auth.log | tail -15
        echo ""
    fi
    
    # Application failed login logs
    echo -e "${YELLOW}Logs de aplicación - Logins fallidos en TOLO:${NC}"
    if docker-compose -f $DOCKER_COMPOSE_PATH logs backend 2>/dev/null | grep -iE "login.*fail|authentication.*fail|credencial.*invalid|usuario.*incorrecto|password.*wrong" | tail -10; then
        echo ""
    else
        echo "No se encontraron logs de login fallidos en la aplicación."
    fi
    
    # MySQL connection failures
    echo -e "${YELLOW}Errores de conexión MySQL:${NC}"
    if [ -f "$MYSQL_LOG_PATH/error.log" ]; then
        grep -iE "access denied|connection.*failed|authentication.*failed" $MYSQL_LOG_PATH/error.log | tail -5
    else
        echo "No se encontraron logs de errores de MySQL"
    fi
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para logs de aplicación
show_app_logs() {
    echo -e "${BLUE}=== LOGS DE APLICACIÓN ===${NC}"
    echo ""
    
    echo "¿Qué componente desea consultar?"
    echo "1. Frontend (React/Node)"
    echo "2. Backend (PHP)" 
    echo "3. Errores de aplicación"
    echo "4. Todos los servicios"
    echo -n "Seleccione: "
    read service_option
    
    case $service_option in
        1)
            echo -e "${YELLOW}Logs del Frontend (React/Vite):${NC}"
            docker-compose -f $DOCKER_COMPOSE_PATH logs --tail=30 frontend
            ;;
        2)
            echo -e "${YELLOW}Logs del Backend (PHP):${NC}"
            docker-compose -f $DOCKER_COMPOSE_PATH logs --tail=30 backend
            echo ""
            if [ -d "$BACKEND_LOG_PATH" ]; then
                echo -e "${YELLOW}Logs locales del backend:${NC}"
                find $BACKEND_LOG_PATH -name "*.log" -exec tail -10 {} \; 2>/dev/null
            fi
            ;;
        3)
            echo -e "${YELLOW}Errores de aplicación:${NC}"
            docker-compose -f $DOCKER_COMPOSE_PATH logs backend frontend 2>/dev/null | grep -iE "error|exception|fatal|warning" | tail -20
            ;;
        4)
            echo -e "${YELLOW}Logs de todos los servicios de aplicación:${NC}"
            docker-compose -f $DOCKER_COMPOSE_PATH logs --tail=20
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para logs de base de datos
show_database_logs() {
    echo -e "${BLUE}=== LOGS DE BASE DE DATOS MYSQL ===${NC}"
    echo ""
    
    echo "¿Qué información de la BD desea consultar?"
    echo "1. Estado de la base de datos TOLO"
    echo "2. Últimas consultas (si están habilitadas)"
    echo "3. Errores de MySQL"
    echo "4. Conexiones activas"
    echo "5. Estadísticas de tablas principales"
    echo -n "Seleccione: "
    read db_option
    
    case $db_option in
        1)
            echo -e "${YELLOW}Estado de la base de datos TOLO:${NC}"
            if mysql -u$DB_USER -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null; then
                echo -e "\n${GREEN}✓ Base de datos TOLO accesible${NC}"
                mysql -u$DB_USER -e "USE $DB_NAME; SELECT 'usuarios' as tabla, COUNT(*) as registros FROM usuarios 
                                     UNION SELECT 'productos', COUNT(*) FROM productos 
                                     UNION SELECT 'categorias', COUNT(*) FROM categorias 
                                     UNION SELECT 'compras', COUNT(*) FROM compras;" 2>/dev/null
            else
                echo -e "${RED}✗ No se puede acceder a la base de datos TOLO${NC}"
            fi
            ;;
        2)
            echo -e "${YELLOW}Logs de consultas MySQL:${NC}"
            if [ -f "$MYSQL_LOG_PATH/mysql.log" ]; then
                tail -20 $MYSQL_LOG_PATH/mysql.log
            else
                echo "Logs de consultas no habilitados o no accesibles"
                echo "Para habilitar: SET GLOBAL general_log = 'ON';"
            fi
            ;;
        3)
            echo -e "${YELLOW}Errores de MySQL:${NC}"
            if [ -f "$MYSQL_LOG_PATH/error.log" ]; then
                tail -15 $MYSQL_LOG_PATH/error.log
            else
                echo "No se encontraron logs de errores de MySQL"
            fi
            ;;
        4)
            echo -e "${YELLOW}Conexiones activas a MySQL:${NC}"
            mysql -u$DB_USER -e "SHOW PROCESSLIST;" 2>/dev/null || echo "No se puede mostrar conexiones activas"
            ;;
        5)
            echo -e "${YELLOW}Estadísticas de tablas principales:${NC}"
            mysql -u$DB_USER -e "USE $DB_NAME; 
                                 SELECT 'Usuarios registrados hoy' as estadistica, COUNT(*) as valor FROM usuarios WHERE DATE(fecha_registro) = CURDATE()
                                 UNION SELECT 'Productos publicados', COUNT(*) FROM productos WHERE estado = TRUE
                                 UNION SELECT 'Compras pendientes', COUNT(*) FROM compras WHERE estado = 'pendiente'
                                 UNION SELECT 'Compras completadas', COUNT(*) FROM compras WHERE estado IN ('pagada', 'entregado');" 2>/dev/null
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para logs del sistema
show_system_logs() {
    echo -e "${BLUE}=== LOGS DEL SISTEMA ===${NC}"
    echo ""
    
    echo "¿Qué tipo de logs del sistema desea ver?"
    echo "1. Logs del kernel"
    echo "2. Logs de servicios (systemd)"
    echo "3. Logs de red"
    echo "4. Estado de memoria/disco"
    echo "5. Procesos del sistema"
    echo -n "Seleccione: "
    read sys_option
    
    case $sys_option in
        1)
            echo -e "${YELLOW}Logs del kernel (últimos 25):${NC}"
            dmesg | tail -25
            ;;
        2)
            echo -e "${YELLOW}Logs de servicios del sistema:${NC}"
            journalctl --since "2 hours ago" --no-pager | tail -20
            ;;
        3)
            echo -e "${YELLOW}Logs de red:${NC}"
            if [ -f "/var/log/syslog" ]; then
                grep -iE "network|dhcp|dns|connection" /var/log/syslog | tail -15
            else
                echo "Archivo de syslog no encontrado"
            fi
            ;;
        4)
            echo -e "${YELLOW}Estado de recursos del sistema:${NC}"
            echo "=== MEMORIA ==="
            free -h
            echo -e "\n=== DISCO ==="
            df -h
            echo -e "\n=== CARGA DEL SISTEMA ==="
            uptime
            ;;
        5)
            echo -e "${YELLOW}Procesos principales (por CPU):${NC}"
            ps aux --sort=-%cpu | head -15
            echo -e "\n${YELLOW}Procesos principales (por memoria):${NC}"
            ps aux --sort=-%mem | head -10
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para consultar actividad de usuarios
show_user_activity() {
    echo -e "${BLUE}=== ACTIVIDAD DE USUARIOS EN TOLO ===${NC}"
    echo ""
    
    echo "¿Qué actividad desea consultar?"
    echo "1. Usuarios registrados recientemente"
    echo "2. Actividad de compras"
    echo "3. Productos más publicados por categoría"
    echo "4. Estadísticas generales"
    echo -n "Seleccione: "
    read activity_option
    
    case $activity_option in
        1)
            echo -e "${YELLOW}Usuarios registrados en los últimos 7 días:${NC}"
            mysql -u$DB_USER -e "USE $DB_NAME; 
                                 SELECT nombre_usuario, email, tipo_usuario, DATE(fecha_registro) as fecha 
                                 FROM usuarios 
                                 WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
                                 ORDER BY fecha_registro DESC 
                                 LIMIT 10;" 2>/dev/null
            ;;
        2)
            echo -e "${YELLOW}Actividad de compras recientes:${NC}"
            mysql -u$DB_USER -e "USE $DB_NAME; 
                                 SELECT c.id_compra, u.nombre_usuario, c.estado, DATE(c.fecha_compra) as fecha
                                 FROM compras c 
                                 JOIN usuarios u ON c.id_cliente = u.id_usuario 
                                 ORDER BY c.fecha_compra DESC 
                                 LIMIT 15;" 2>/dev/null
            ;;
        3)
            echo -e "${YELLOW}Productos por categoría:${NC}"
            mysql -u$DB_USER -e "USE $DB_NAME; 
                                 SELECT cat.nombre_categoria, COUNT(pc.id_producto) as cantidad_productos
                                 FROM categorias cat
                                 LEFT JOIN productos_categorias pc ON cat.id_categoria = pc.id_categoria
                                 GROUP BY cat.id_categoria, cat.nombre_categoria
                                 HAVING cantidad_productos > 0
                                 ORDER BY cantidad_productos DESC
                                 LIMIT 10;" 2>/dev/null
            ;;
        4)
            echo -e "${YELLOW}Estadísticas generales del sistema:${NC}"
            mysql -u$DB_USER -e "USE $DB_NAME; 
                                 SELECT 'Total usuarios' as metrica, COUNT(*) as valor FROM usuarios
                                 UNION SELECT 'Total productos', COUNT(*) FROM productos WHERE estado = TRUE
                                 UNION SELECT 'Total categorías', COUNT(*) FROM categorias
                                 UNION SELECT 'Total compras', COUNT(*) FROM compras
                                 UNION SELECT 'Ecommerces activos', COUNT(*) FROM ecommerces;" 2>/dev/null
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para generar reporte
generate_report() {
    echo -e "${BLUE}=== GENERAR REPORTE DE LOGS ===${NC}"
    echo ""
    
    REPORT_FILE="tolo_log_report_$(date +%Y%m%d_%H%M%S).txt"
    
    echo "Generando reporte completo de TOLO..."
    
    {
        echo "============================================"
        echo "REPORTE DE LOGS - SISTEMA TOLO E-COMMERCE"
        echo "Fecha de generación: $(date)"
        echo "============================================"
        echo ""
        
        echo "=== RESUMEN DE AUTENTICACIÓN ==="
        echo "SSH - Logins exitosos (últimos 5):"
        if [ -f "/var/log/auth.log" ]; then
            grep "Accepted" /var/log/auth.log | tail -5
        fi
        echo ""
        echo "SSH - Logins fallidos (últimos 5):"
        if [ -f "/var/log/auth.log" ]; then
            grep "Failed password" /var/log/auth.log | tail -5
        fi
        echo ""
        
        echo "=== ESTADO DE LA APLICACIÓN ==="
        echo "Contenedores Docker activos:"
        docker-compose -f $DOCKER_COMPOSE_PATH ps 2>/dev/null
        echo ""
        echo "Logs recientes de aplicación:"
        docker-compose -f $DOCKER_COMPOSE_PATH logs --tail=15 2>/dev/null
        echo ""
        
        echo "=== ESTADO DE LA BASE DE DATOS ==="
        if mysql -u$DB_USER -e "USE $DB_NAME; SELECT 'Base de datos TOLO' as estado, 'ACTIVA' as valor;" 2>/dev/null; then
            echo "✓ Base de datos MySQL operativa"
            mysql -u$DB_USER -e "USE $DB_NAME; 
                                 SELECT 'Usuarios' as tabla, COUNT(*) as registros FROM usuarios 
                                 UNION SELECT 'Productos', COUNT(*) FROM productos 
                                 UNION SELECT 'Compras', COUNT(*) FROM compras;" 2>/dev/null
        else
            echo "✗ Error accediendo a la base de datos"
        fi
        echo ""
        
        echo "=== ESTADO DEL SISTEMA ==="
        echo "Memoria:"
        free -h
        echo ""
        echo "Disco:"
        df -h
        echo ""
        echo "Carga del sistema:"
        uptime
        echo ""
        echo "Procesos principales:"
        ps aux --sort=-%cpu | head -8
        
    } > $REPORT_FILE
    
    echo -e "${GREEN}✓ Reporte generado: $REPORT_FILE${NC}"
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para monitoreo en tiempo real
real_time_monitoring() {
    echo -e "${BLUE}=== MONITOREO EN TIEMPO REAL ===${NC}"
    echo ""
    echo "¿Qué desea monitorear?"
    echo "1. Logs de aplicación en tiempo real"
    echo "2. Logs de autenticación del sistema"
    echo "3. Logs de MySQL (si están disponibles)"
    echo "4. Actividad general del sistema"
    echo -n "Seleccione: "
    read monitor_option
    
    case $monitor_option in
        1)
            echo -e "${YELLOW}Monitoreando aplicación TOLO... (Ctrl+C para salir)${NC}"
            docker-compose -f $DOCKER_COMPOSE_PATH logs -f --tail=10
            ;;
        2)
            echo -e "${YELLOW}Monitoreando autenticación del sistema... (Ctrl+C para salir)${NC}"
            tail -f /var/log/auth.log 2>/dev/null || echo "Archivo auth.log no accesible"
            ;;
        3)
            echo -e "${YELLOW}Monitoreando MySQL... (Ctrl+C para salir)${NC}"
            if [ -f "$MYSQL_LOG_PATH/mysql.log" ]; then
                tail -f $MYSQL_LOG_PATH/mysql.log
            else
                echo "Logs de MySQL no disponibles para monitoreo en tiempo real"
            fi
            ;;
        4)
            echo -e "${YELLOW}Monitoreando sistema general... (Ctrl+C para salir)${NC}"
            journalctl -f
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función para limpiar logs antiguos
clean_old_logs() {
    echo -e "${YELLOW}=== LIMPIEZA DE LOGS ANTIGUOS ===${NC}"
    echo ""
    echo -e "${RED}¡ADVERTENCIA!${NC} Esta operación eliminará logs antiguos."
    echo "Esto incluye:"
    echo "- Logs de Docker más antiguos"
    echo "- Rotación de logs del sistema"
    echo "- Limpieza de archivos temporales"
    echo ""
    echo -n "¿Está seguro? (y/N): "
    read confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        echo "Limpiando logs de Docker..."
        docker system prune -f
        echo "Limpiando logs de contenedores..."
        docker-compose -f $DOCKER_COMPOSE_PATH logs --tail=0 > /dev/null 2>&1
        echo "Rotando logs del sistema..."
        sudo logrotate -f /etc/logrotate.conf 2>/dev/null || echo "No se pudo rotar logs del sistema (requiere sudo)"
        echo -e "${GREEN}✓ Limpieza completada${NC}"
    else
        echo "Operación cancelada"
    fi
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función de configuración
show_config() {
    echo -e "${BLUE}=== CONFIGURACIÓN DEL SISTEMA ===${NC}"
    echo ""
    echo "Configuración actual:"
    echo "- Directorio de logs: $LOG_DIR"
    echo "- Docker Compose: $DOCKER_COMPOSE_PATH"
    echo "- Base de datos: $DB_NAME (MySQL local)"
    echo "- Backend logs: $BACKEND_LOG_PATH"
    echo ""
    echo "Estado de servicios:"
    echo ""
    echo -e "${YELLOW}Docker Containers:${NC}"
    docker-compose -f $DOCKER_COMPOSE_PATH ps 2>/dev/null || echo "Docker Compose no disponible"
    echo ""
    echo -e "${YELLOW}MySQL Status:${NC}"
    if mysql -u$DB_USER -e "SELECT VERSION() as mysql_version;" 2>/dev/null; then
        echo "✓ MySQL operativo"
    else
        echo "✗ MySQL no accesible (verificar credenciales o servicio)"
    fi
    
    echo -e "\n${BLUE}Presione Enter para continuar...${NC}"
    read
}

# Función principal
main() {
    while true; do
        show_menu
        read option
        
        case $option in
            1) show_successful_logins ;;
            2) show_failed_logins ;;
            3) show_app_logs ;;
            4) show_database_logs ;;
            5) show_system_logs ;;
            6) show_user_activity ;;
            7) generate_report ;;
            8) real_time_monitoring ;;
            9) clean_old_logs ;;
            10) show_config ;;
            11) 
                echo -e "${GREEN}¡Gracias por usar el Gestor de Logs TOLO!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Opción inválida. Presione Enter para continuar...${NC}"
                read
                ;;
        esac
    done
}

# Verificar configuración inicial
echo -e "${BLUE}Iniciando Gestor de Logs TOLO...${NC}"
echo ""

# Verificar permisos
if [[ $EUID -ne 0 ]] && [[ "$1" != "--no-root-check" ]]; then
    echo -e "${YELLOW}Nota: Algunas funciones requieren privilegios de administrador.${NC}"
    echo -e "${YELLOW}Para acceso completo, ejecute: sudo $0${NC}"
    echo ""
fi

# Verificar MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}Advertencia: Cliente MySQL no encontrado. Algunas funciones de BD no estarán disponibles.${NC}"
    echo ""
fi

echo -e "${GREEN}Sistema iniciado correctamente.${NC}"
sleep 2

# Ejecutar programa principal
main