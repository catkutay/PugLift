import winston from 'winston'
import moment from 'moment'

const tsFormat = () => moment().format('DD/MM/YYYY - HH:mm:ss.SSS') // Uses moment.js to format the date

export const consoleloggingLevel = 'info'
export const fileLoggingLevel = 'error'

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'winstonlogs/winston-error-events.log',
      timestamp: tsFormat,
      level: consoleloggingLevel, // This defines what will be logged to a file.
    }),
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: fileLoggingLevel, // This defines what will be logged to the console.
    }),
  ],
})

export const profileLogger = new (winston.Logger)({ // This winston logger object is only used for the profilling.
  transports: [
    new (winston.transports.File)({
      filename: 'winstonlogs/winston-profile-events.log',
      timestamp: tsFormat,
      level: 'info', // This has to stay as level: 'info' as by default profilling uses info level logging.
    }),
  ],
})

export let enableProfiling = true

export function setProfiling (state) {
  enableProfiling = state
}
