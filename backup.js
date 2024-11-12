import { exec } from 'child_process'
import { mkdir } from 'fs/promises'
import path from 'path'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME
} from './src/config.js'

const BACKUP_DIR = './backups'
const MYSQLDUMP_PATH = '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump"' // Ajusta esta ruta según tu instalación

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(BACKUP_DIR, `${DB_NAME}_${timestamp}.sql`)

  try {
    await mkdir(BACKUP_DIR, { recursive: true })

    const cmd = `${MYSQLDUMP_PATH} -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASS} ${DB_NAME} > ${backupPath}`

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating backup: ${error}`)
        return
      }
      console.log(`Database backup created successfully at: ${backupPath}`)
    })

  } catch (error) {
    console.error('Backup failed:', error)
  }
}

createBackup() 