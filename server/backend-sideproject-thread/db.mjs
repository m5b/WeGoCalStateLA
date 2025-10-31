import mysql from 'mysql2';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'threads_db'
});

export function initDatabase() {
  // Create threads table if not exists
  db.query(`
    CREATE TABLE IF NOT EXISTS threads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_anonymus VARCHAR(32) UNIQUE,
      username VARCHAR(255),
      thread TEXT
    )
  `, (err) => {
    if (err) throw err;

    // Create comments table if not exists, after threads
    db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        thread_id INT,
        id_anonymus VARCHAR(32),
        username VARCHAR(255),
        comment TEXT,
        FOREIGN KEY (thread_id) REFERENCES threads(id)
      )
    `, (err) => {
      if (err) throw err;
      console.log('Tables created or already exist');
    });
  });
}