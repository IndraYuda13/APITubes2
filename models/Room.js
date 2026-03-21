const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Room = sequelize.define(
  "Room",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    floor: { type: DataTypes.STRING(50) },
    capacity: { type: DataTypes.INTEGER },
    facilities: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(20) },
  },
  { tableName: "room", timestamps: false }
);

module.exports = Room;