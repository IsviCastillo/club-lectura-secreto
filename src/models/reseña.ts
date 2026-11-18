
import { DatabaseService } from '../db/database';

export interface Resena {
  id: number;
  libro_id: number;
  comentario: string;
  estrellas: number;
}

export type NuevaResena = Omit<Resena, 'id'>;

export class ResenaModel {
  static create(resena: NuevaResena): void {
    const db = DatabaseService.getDb();

    db.run(
      `INSERT INTO resenas (libro_id, comentario, estrellas)
       VALUES (?, ?, ?)`,
      [resena.libro_id, resena.comentario, resena.estrellas]
    );

    DatabaseService.save();
  }

  static readAll(): Resena[] {
    const db = DatabaseService.getDb();

    const resultado = db.exec(
      'SELECT id, libro_id, comentario, estrellas FROM resenas ORDER BY id DESC'
    );

    if (resultado.length === 0) return [];

    return resultado[0].values.map((fila) => ({
      id: Number(fila[0]),
      libro_id: Number(fila[1]),
      comentario: String(fila[2]),
      estrellas: Number(fila[3]),
    }));
  }

  static update(id: number, resena: NuevaResena): void {
    const db = DatabaseService.getDb();

    db.run(
      `UPDATE resenas
       SET libro_id = ?, comentario = ?, estrellas = ?
       WHERE id = ?`,
      [resena.libro_id, resena.comentario, resena.estrellas, id]
    );

    DatabaseService.save();
  }

  static delete(id: number): void {
    const db = DatabaseService.getDb();

    db.run('DELETE FROM resenas WHERE id = ?', [id]);

    DatabaseService.save();
  }

  static promedio(libroId: number): number {
    const db = DatabaseService.getDb();

    const resultado = db.exec(
      'SELECT AVG(estrellas) FROM resenas WHERE libro_id = ?',
      [libroId]
    );

    const valor = resultado[0]?.values[0]?.[0];

    return valor == null ? 0 : Number(valor);
  }
}
