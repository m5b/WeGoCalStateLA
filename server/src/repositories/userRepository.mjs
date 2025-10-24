import connectionPool from "../db/pool.mjs";

async function findByUserID(userId) {
  const [row] = await connectionPool.query(
    "select user_id, email from users where user_id = ?",
    [userId]
  );
  return row[0];
}

async function findByEmail(email) {
  const [row] = await connectionPool.query(
    "select user_id, email from users where email = ?",
    [email]
  );

  return row[0];
}

async function createUser(email, displayName) {
  const [result] = await connectionPool.query(
    "INSERT INTO users (email, name) VALUES (?, ?)",
    [email, displayName]
  );
  return result;
}

export { findByEmail, findByUserID, createUser };
