const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    subtitle: { type: DataTypes.STRING(150) }, // Penceramah
    event_date: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING(100) },
  },
  { tableName: "events", timestamps: false }
);

module.exports = Event;