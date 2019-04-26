import flow from 'lodash.flowright'

import requireUser from '../middleware/require-user'
import { onlyOwnData, withOwnUserId } from '../middleware/only-own-data'

export default (sequelize, DataTypes) => {
  const Service = sequelize.define(
    'service',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      gqSubscriptionCreate: true,
      gqSubscriptionUpdate: true,
      gqSubscriptionDelete: true,
      gqMiddleware: {
        query: flow([requireUser, onlyOwnData]),
        create: flow([requireUser, withOwnUserId]),
        update: flow([requireUser, onlyOwnData, withOwnUserId]),
        destroy: flow([requireUser, onlyOwnData])
      }
    }
  )

  Service.associate = models => {
    Service.belongsTo(models.country)
    Service.belongsTo(models.category)
    Service.belongsTo(models.user)
  }

  return Service
}
