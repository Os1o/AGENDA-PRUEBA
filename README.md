# Directorio Empresarial - Dirección Jurídica

## 🚀 Instalación Local (XAMPP)

1. Copia el proyecto a `xampp/htdocs/directorio/`
2. Importa `data/empleados.sql` en phpMyAdmin
3. Configura la conexión en `includes/config.php`
4. Accede a `http://localhost/directorio/`

## 🌐 Versión de Desarrollo (Netlify + Supabase)

1. Sube archivos a Netlify
2. Configura variables de entorno en Netlify
3. Conecta con Supabase

## 📋 Funcionalidades

- Directorio por ubicación, adscripción y categoría
- Búsqueda en tiempo real
- Diseño responsivo
- Integración con base de datos

## 🔧 Migración

Para migrar de Supabase a servidor local:
1. Exporta datos de Supabase
2. Importa a MySQL/MariaDB
3. Actualiza configuración en `config.php`