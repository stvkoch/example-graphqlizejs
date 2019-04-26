import {
  //   UserInputError,
  ForbiddenError
  //   AuthenticationError
  //   ValidationError
} from 'apollo-server-express'

export function onlyOwnData(next) {
  return (parent, args, context, info) => {
    if (!args.where) args.where = {}

    args.where.userId = context.user.get('id')

    return next(parent, args, context, info)
  }
}

export function onlyOwnId(next) {
  return (parent, args, context, info) => {
    if (!args.where) args.where = {}

    args.where.id = context.user.get('id')

    return next(parent, args, context, info)
  }
}

export function withOwnUserId(next) {
  return (parent, args, context, info) => {
    if (!args.input) args.input = {}

    args.input.userId = context.user.get('id')

    return next(parent, args, context, info)
  }
}
