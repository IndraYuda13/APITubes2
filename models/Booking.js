const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING(20) },
  item_id: { type: DataTypes.INTEGER, allowNull: false },
  item_name: { type: DataTypes.STRING(100) },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING(20), defaultValue: "pending" },
  notes: { type: DataTypes.TEXT },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, { tableName: "booking", timestamps: false });

module.exports = Booking;