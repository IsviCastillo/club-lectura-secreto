
import { DatabaseService } from '../db/database';

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  descripcion: string;
}

export type NuevoLibro = Omit<Libro, 'id'>;

export class LibroModel {
  static create(libro: NuevoLibro): void {
    const db = DatabaseService.getDb();

    db.run(
      `INSERT INTO libros (titulo, autor, genero, descripcion)
       VALUES (?, ?, ?, ?)`,
      [libro.titulo, libro.autor, libro.genero, libro.descripcion]
    );

    DatabaseService.save();
  }

  static readAll(): Libro[] {
    const db = DatabaseService.getDb();

    const resultado = db.exec(
      'SELECT id, titulo, autor, genero, descripcion FROM libros ORDER BY id DESC'
    );

    if (resultado.length === 0) return [];

    return resultado[0].values.map((fila) => ({
      id: Number(fila[0]),
      titulo: String(fila[1]),
      autor: String(fila[2]),
      genero: String(fila[3]),
      descripcion: String(fila[4]),
    }));
  }

  static update(id: number, libro: NuevoLibro): void {
    const db = DatabaseService.getDb();

    db.run(
      `UPDATE libros
       SET titulo = ?, autor = ?, genero = ?, descripcion = ?
       WHERE id = ?`,
      [libro.titulo, libro.autor, libro.genero, libro.descripcion, id]
    );

    DatabaseService.save();
  }

  static delete(id: number): void {
    const db = DatabaseService.getDb();

    db.run('DELETE FROM libros WHERE id = ?', [id]);

    DatabaseService.save();
  }
}
