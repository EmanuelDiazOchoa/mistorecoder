import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('session.db');

export const createSessionTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY NOT NULL, email TEXT, uid TEXT);'
    );
  });
};

export const saveSession = (email, uid) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM session;'); 
    tx.executeSql('INSERT INTO session (email, uid) VALUES (?, ?);', [email, uid]);
  });
};

export const getSession = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM session LIMIT 1;',
      [],
      (_, { rows }) => callback(rows._array[0]),
      (_, error) => {
        console.error('Error obteniendo sesión:', error);
        return true;
      }
    );
  });
};

export const clearSession = () => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM session;');
  });
};
