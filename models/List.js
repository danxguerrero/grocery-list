const { db, DataTypes } = require('../db/connection')

const List = db.define('List',
    {
        name: DataTypes.STRING,
        description: DataTypes.STRING
    },{
        timestamps: true
    })

module.exports = {
    List
}