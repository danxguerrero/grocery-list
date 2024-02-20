const { db, DataTypes } = require('../db/connection')

const Item = db.define('Item',
{
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    purchased: 
        {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
},{
    timestamps: true
})

module.exports = {
    Item
}