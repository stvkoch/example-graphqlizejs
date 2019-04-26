import {
  //   UserInputError,
  //   ForbiddenError,
  AuthenticationError
  //   ValidationError
} from 'apollo-server-express'

export default function requireUser(next) {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('Required authenticated users')
    }

    return next(parent, args, context, info)
  }
}
