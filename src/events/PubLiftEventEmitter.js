import EventEmitter from 'events'

export default class PubLiftEventEmitter extends EventEmitter {
  execute (task) {
    task()
  }
}
