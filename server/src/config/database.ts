import { Sequelize } from 'sequelize';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    dialect: 'postgres', 
  }
)