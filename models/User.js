const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(120), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(200), allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  role: { type: DataTypes.STRING(20), defaultValue: "user" },
  phone: { type: DataTypes.STRING(20) },
  address: { type: DataTypes.TEXT, allowNull: true },
  profile_photo: { type: DataTypes.STRING, allowNull: true }
}, { tableName: "user", timestamps: false });

module.exports = User;  