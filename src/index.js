import uws from './server/uws'
import Routes from './server/routes'
import { handleEvent } from './database/mongodb.js'

const routes = new Routes(handleEvent)

uws(routes)
