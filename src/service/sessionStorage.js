import * as SQLite from 'expo-sqlite';

let db;

const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('session.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY NOT NULL,
        email TEXT,
        uid TEXT
      );
    `);
  }
  return db;
};

export const saveSession = async (email, uid) => {
  const database = await getDb();
  await database.runAsync('DELETE FROM session;');
  await database.runAsync(
    'INSERT INTO session (email, uid) VALUES (?, ?);',
    [email, uid]
  );
};

export const getSession = async () => {
  const database = await getDb();
  const result = await database.getFirstAsync('SELECT * FROM session LIMIT 1;');
  return result || null;
};

export const clearSession = async () => {
  const database = await getDb();
  await database.runAsync('DELETE FROM session;');
};