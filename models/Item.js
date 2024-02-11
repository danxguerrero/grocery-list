const { db, DataTypes } = require('../db/connection')

const Item = db.define('Item',
{
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    purchased: DataTypes.BOOLEAN,
},{
    timestamps: true
})

module.exports = {
    Item
}