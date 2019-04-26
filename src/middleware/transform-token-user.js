import jwt from 'jsonwebtoken'
import db from '../models'
import JWT_SECRET_KEY from '../config/jwt'
import { AuthenticationError } from 'apollo-server-express'

const transformTokenUser = async ({ req }) => {
  let authToken = null
  let user = null

  // for subscriptions
  if (!req) return

  try {
    const header = req.headers['authorization']

    if (header) {
      const bearer = header.split(' ')
      authToken = bearer[1]
      if (authToken) {
        const userAuth = jwt.verify(authToken, JWT_SECRET_KEY)
        user = await db.sequelize.models.user.findByPk(userAuth.id)
      }
    }
  } catch (e) {
    throw new AuthenticationError(
      `Unable to authenticate using auth token: ${authToken}`
    )
  }

  return {
    user,
    db,
    authToken
  }
}

export default transformTokenUser
