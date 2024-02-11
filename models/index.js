const { User } = require('./User');
const { List } = require('./List');
const { Item } = require('./Item');

User.hasMany(List) // User can create many Lists
List.belongsTo(User) // Lists can only belong to one User

User.belongsToMany(List, { through: 'UserList', as: 'accessibleLists'}); // Lists can have many Users
List.belongsToMany(User, { through: 'UserList', as: 'collaborators'}); // User can have many Lists

List.hasMany(Item) // Lists can have many Items
Item.belongsTo(List) // Items can belong to a single List

module.exports = {
    User,
    List,
    Item,
}