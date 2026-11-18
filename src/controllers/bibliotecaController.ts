
import { LibroModel, type NuevoLibro } from '../models/libro';
import { ResenaModel, type NuevaResena } from '../models/reseña';
import { BibliotecaView } from '../views/bibliotecaView';

export class BibliotecaController {
  private view: BibliotecaView;

  constructor() {
    this.view = new BibliotecaView({
      guardarLibro: (id, datos) => this.guardarLibro(id, datos),
      eliminarLibro: (id) => this.eliminarLibro(id),
      guardarResena: (id, datos) => this.guardarResena(id, datos),
      eliminarResena: (id) => this.eliminarResena(id),
    });

    this.actualizarVista();
  }

  private actualizarVista(): void {
    this.view.mostrar(
      LibroModel.readAll(),
      ResenaModel.readAll()
    );
  }

  private ejecutar(operacion: () => void): void {
    try {
      operacion();
    } catch (error: unknown) {
      console.error('Error en la biblioteca:', error);

      this.view.mensaje(
        error instanceof Error &&
        error.message.startsWith('Validación:')
          ? error.message.replace('Validación: ', '')
          : 'No se pudo completar la operación.'
      );
    }
  }

  private validarTexto(
    valor: string,
    nombre: string,
    maximo: number
  ): string {
    const limpio = valor.trim();

    if (!limpio) {
      throw new Error(`Validación: ${nombre} es obligatorio.`);
    }

    if (limpio.length > maximo) {
      throw new Error(
        `Validación: ${nombre} no puede superar ${maximo} caracteres.`
      );
    }

    return limpio;
  }

  private guardarLibro(
    id: number | null,
    datos: NuevoLibro
  ): void {
    this.ejecutar(() => {
      const libro: NuevoLibro = {
        titulo: this.validarTexto(datos.titulo, 'El título', 120),
        autor: this.validarTexto(datos.autor, 'El autor', 100),
        genero: this.validarTexto(datos.genero, 'El género', 60),
        descripcion: datos.descripcion.trim(),
      };

      if (libro.descripcion.length > 500) {
        throw new Error(
          'Validación: La descripción no puede superar 500 caracteres.'
        );
      }

      if (id === null) {
        LibroModel.create(libro);
      } else {
        LibroModel.update(id, libro);
      }

      this.view.limpiarLibro();
      this.actualizarVista();
    });
  }

  private eliminarLibro(id: number): void {
    this.ejecutar(() => {
      LibroModel.delete(id);
      this.view.limpiarLibro();
      this.view.limpiarResena();
      this.actualizarVista();
    });
  }

  private guardarResena(
    id: number | null,
    datos: NuevaResena
  ): void {
    this.ejecutar(() => {
      if (!Number.isSafeInteger(datos.libro_id) ||
          datos.libro_id <= 0 ||
          !LibroModel.readAll().some(
            (libro) => libro.id === datos.libro_id
          )) {
        throw new Error('Validación: Selecciona un libro válido.');
      }

      if (!Number.isInteger(datos.estrellas) ||
          datos.estrellas < 1 ||
          datos.estrellas > 5) {
        throw new Error('Validación: Selecciona de 1 a 5 estrellas.');
      }

      const resena: NuevaResena = {
        libro_id: datos.libro_id,
        estrellas: datos.estrellas,
        comentario: this.validarTexto(
          datos.comentario,
          'El comentario',
          500
        ),
      };

      if (id === null) {
        ResenaModel.create(resena);
      } else {
        ResenaModel.update(id, resena);
      }

      this.view.limpiarResena();
      this.actualizarVista();
    });
  }

  private eliminarResena(id: number): void {
    this.ejecutar(() => {
      ResenaModel.delete(id);
      this.view.limpiarResena();
      this.actualizarVista();
    });
  }
}
