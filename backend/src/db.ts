import mysql from "mysql2";

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost", // Database host
  user: "root", // MySQL username
  password: "Yuvalco11499", // MySQL password
  database: "ecommerce_platform", // Database name
  waitForConnections: true,
  connectionLimit: 10, // Number of simultaneous connections
  queueLimit: 0,
});

// Export the connection pool for use in other files
export default pool.promise(); // Using promise-based API
