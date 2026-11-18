
import initSqlJs, { type Database } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

export class DatabaseService {
  private static db: Database | null = null;
  private static readonly STORAGE_KEY = 'club_lectura_db';

  static async init(): Promise<void> {
    if (this.db) return;

    const SQL = await initSqlJs({
      locateFile: () => sqlWasmUrl,
    });

    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      const binary = atob(saved);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      this.db = new SQL.Database(bytes);
    } else {
      this.db = new SQL.Database();
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS libros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        genero TEXT NOT NULL,
        descripcion TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS resenas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libro_id INTEGER NOT NULL,
        comentario TEXT NOT NULL,
        estrellas INTEGER NOT NULL CHECK(estrellas BETWEEN 1 AND 5),
        FOREIGN KEY (libro_id) REFERENCES libros(id)
          ON DELETE CASCADE
      );
    `);

    this.db.run('PRAGMA foreign_keys = ON');
    this.save();
  }

  static getDb(): Database {
    if (!this.db) {
      throw new Error('La base de datos no está inicializada.');
    }

    return this.db;
  }

  static save(): void {
    const data = this.getDb().export();
    const chunkSize = 8192;
    let binary = '';

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.subarray(i, i + chunkSize);

      for (const byte of chunk) {
        binary += String.fromCharCode(byte);
      }
    }

    localStorage.setItem(this.STORAGE_KEY, btoa(binary));
  }
}
