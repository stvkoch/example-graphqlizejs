import flow from 'lodash.flow'

import requireUser from '../middleware/require-user'
import { onlyOwnId } from '../middleware/only-own-data'

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING
    },
    {
      freezeTableName: true,
      gqMiddleware: {
        query: requireUser,
        create: requireUser,
        update: flow([requireUser, onlyOwnId]),
        destroy: flow([requireUser, onlyOwnId])
      }
    }
  )

  User.associate = models => {
    User.hasMany(models.service)
    User.belongsTo(models.country)
    User.hasOne(models.credential)
  }

  return User
}
