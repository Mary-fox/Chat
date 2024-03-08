import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class MessageModel extends Model {}

MessageModel.init({
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    room: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Message',
});