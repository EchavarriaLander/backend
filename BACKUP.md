# Instrucciones de Backup

## Backup de la Base de Datos
Para crear un backup de la base de datos:

1. Ejecuta el script de backup: `npm run backup`

El backup se guardará en el directorio `backups` con la fecha y hora.

## Checklist de Backup Manual
Recuerda hacer backup de estos archivos importantes:

1. Archivos de código fuente:
   - Todos los archivos en el directorio `src/`
   - Esquema de la base de datos (`db/database.sql`)
   - Archivos de configuración

2. Archivos de configuración:
   - `.env` file (almacenar en un lugar seguro)
   - `package.json`
   - `package-lock.json`

3. Base de datos:
   - Regulares backups automatizados usando el script de backup
   - Guardar backups en un lugar seguro

## Instrucciones de Restauración

### Restauración de la Base de Datos
Para restaurar un backup de la base de datos:

bash
mysql -u [username] -p [database_name] < backup_file.sql

### Restauración de los Archivos de Código
1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Restaura el archivo `.env`
4. Restaura la base de datos desde el backup
5. Inicia la aplicación: `npm start`