import express from 'express'
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-express'
import cors from 'cors'
// import hasha from "hasha";
var jwt = require('jsonwebtoken')

import { generateFakes } from './fakes'
import db from './models'
import resolvers from './resolvers'
import schema from './schema'
import transformTokenUser from './middleware/transform-token-user'
import http from 'http'
import https from 'https'

const port = process.env.PORT || 5000

const apollo = new ApolloServer({
  typeDefs: gql(schema),
  resolvers: resolvers,
  context: transformTokenUser,
  introspection: true,
  playground: true
})

const app = express()
app.use(cors())
apollo.applyMiddleware({ app })
app.use(express.static('app/public'))
app.get('/schema', (_, res) =>
  res.send(
    `<div><a href="/graphql">Graphqli</a></div><pre>${schemaGenerated}</pre>`
  )
)

let server = http.createServer(app)

if (process.env.SSL_ENABLE)
  server = https.createServer(
    {
      key: fs.readFileSync(process.env.SSL_KEY_FILE),
      cert: fs.readFileSync(process.env.SSL_CERT_FILE)
    },
    app
  )

apollo.installSubscriptionHandlers(server)

db.sequelize.drop().then(() => {
  db.sequelize.sync().then(() => {
    generateFakes(db)
    server.listen({ port }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`
      )
    )
  })
})
