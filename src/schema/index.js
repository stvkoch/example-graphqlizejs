import prettier from 'prettier'
import { schema } from 'graphqlizejs'
import db from '../models'

const extend = `
type Session {
  token: String!
  username: String!
  user: User
}
extend type Query {
    me: User
}
extend type Mutation {
  login(username: String!, password: String!, serviceId: ID): Session
}

`
// extend type Mutation{
//   singleUpload(file: Upload!): File!
// }

export default prettier.format(schema(db.sequelize, extend), {
  parser: 'graphql'
})
