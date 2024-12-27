import { app } from 'electron'
import log from 'electron-log/main'
import path from 'path'

log.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs', 'main.log')
log.transports.file.level = 'silly'

export default log
