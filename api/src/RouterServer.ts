import * as bodyParser from 'body-parser'
import morgan from 'morgan'
import { Server } from '@overnightjs/core'
import cors from 'cors'
import * as controllers from './controllers'
import Logger from './logger'
import { Sequelize } from 'sequelize/types'

export class RouterServer extends Server {

  constructor(database: Sequelize) {
    super(process.env.NODE_ENV === 'development')
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(
      cors({
        origin: '*',
      })
    )
    this.app.use(morgan('combined'));
    this.setupControllers(database);
  }

  setupControllers(database: Sequelize): void {
    type Controllers = {}
    const ctlrInstances: any = []

    for (const ctrlName in controllers) {
      if (controllers.hasOwnProperty(ctrlName)) {
        const controller = new (<Controllers>controllers)[ctrlName](database)
        ctlrInstances.push(controller)
        Logger.info(`Adding controller: ${ctrlName}`)
      } else {
        Logger.error(`${ctrlName} does not exist`)
      }
    }
    return super.addControllers(ctlrInstances)
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      Logger.info(`Server listening on port: ${port}`)
    })
  }
}
