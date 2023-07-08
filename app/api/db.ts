import { PoolConnection, MysqlError } from "mysql";

const mysql = require("mysql");
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
};
const pool = mysql.createPool(config);

export function getConnection(): Promise<PoolConnection> {
  return new Promise((resolve, reject) => {
    pool.getConnection((error: MysqlError, connection: PoolConnection) => {
      if (error) return reject(error);
      return resolve(connection);
    });
  });
}

export function query(connection: PoolConnection, sql: string) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error: MysqlError, results: any) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
}
