const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Announcement = sequelize.define(
  "Announcement",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    subtitle: { type: DataTypes.TEXT },
    tag: { type: DataTypes.STRING(50) },
  },
  { tableName: "announcements", timestamps: false }
);

module.exports = Announcement;