export default (sequelize, DataTypes) => {
  const Credential = sequelize.define(
    'credential',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      freezeTableName: true,
      // should not generate resolvers and data types for this model
      gqIgnore: true
    }
  )

  Credential.associate = models => {
    Credential.belongsTo(models.user)
  }

  return Credential
}
