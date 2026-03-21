const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inventory = sequelize.define(
  "Inventory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    category: { type: DataTypes.STRING(50) },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(20) }, // 'Tersedia' / 'Habis'
  },
  { tableName: "inventory", timestamps: false }
);

module.exports = Inventory;