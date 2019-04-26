import { resolvers } from 'graphqlizejs'
import jwt from 'jsonwebtoken'
import { AuthenticationError, PubSub } from 'apollo-server-express'
// import hasha from "hasha";

import db from '../models'
import JWT_SECRET_KEY from '../config/jwt'
import requireUser from '../middleware/require-user'

const login = sequelize => async (root, args) => {
  const credential = await sequelize.models.credential.findOne({
    where: { username: args.username }
  })

  if (!credential || args.password !== credential.get('password')) {
    throw new AuthenticationError('Invalid credentials')
  }

  const user = await credential.getUser({ plain: true })
  return {
    username: args.username,
    token: jwt.sign(
      {
        id: credential.get('userId')
      },
      JWT_SECRET_KEY
    ),
    user
  }
}

export default resolvers(db.sequelize, new PubSub(), sequelize => ({
  query: {
    me: requireUser((parent, args, context) => {
      return context.user
    })
  },
  mutation: {
    login: login(sequelize)
    // // https://blog.apollographql.com/file-uploads-with-apollo-server-2-0-5db2f3f60675
    // async singleUpload(parent, { file }) {
    //   const { stream, filename, mimetype, encoding } = await file;
    //   const hashcode = await hasha.fromStream(stream, { algorithm: "md5" });
    //   // 1. Validate file metadata.
    //   const existFile = await db.sequelize.models.file.findOne({
    //     where: { hashcode }
    //   });
    //   if (existFile) return existFile;
    //   // 2. Stream file contents into cloud storage:
    //   // https://nodejs.org/api/stream.html
    //   const url = faker.image.cats();
    //   // 3. Record the file upload in your DB.
    //   // const id = await recordFile( … )
    //   const row = await db.models.file.create({
    //     url,
    //     filename,
    //     mimetype,
    //     encoding
    //   });
    //   return row;
    // }
  }
}))

//   export default resolvers;
