require('source-map-support/register')
import { Sequelize } from 'sequelize-typescript'
import { RouterServer } from './RouterServer'
import * as models from './models'

;(async () => {
  const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
    dialect: 'postgres',
    logging: process.env.LOG === 'debug' ? console.log : false,
    models: Object.keys(models).map(k => models[k]),
  })

  await sequelize.sync({
    alter: true
  });

  new RouterServer(sequelize).start(8080);

})()
