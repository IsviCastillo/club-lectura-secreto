
import type { Libro, NuevoLibro } from '../models/libro';
import type { Resena, NuevaResena } from '../models/reseña';

export interface AccionesBiblioteca {
  guardarLibro: (id: number | null, datos: NuevoLibro) => void;
  eliminarLibro: (id: number) => void;
  guardarResena: (id: number | null, datos: NuevaResena) => void;
  eliminarResena: (id: number) => void;
}

export class BibliotecaView {
  private app: HTMLDivElement;
  private acciones: AccionesBiblioteca;

  constructor(acciones: AccionesBiblioteca) {
    const app = document.querySelector<HTMLDivElement>('#app');

    if (!app) {
      throw new Error('No se encontró el elemento #app');
    }

    this.app = app;
    this.acciones = acciones;
    this.crearEstructura();
    this.configurarEventos();
  }

  private crearEstructura(): void {
    this.app.innerHTML = `
      <header class="encabezado">
        <span class="etiqueta">Un rincón para lectores</span>
        <h1>Club de Lectura Secreto</h1>
        <p>Comparte tus lecturas y opiniones de forma anónima.</p>
      </header>

      <div id="notificacion" role="status" aria-live="polite" hidden></div>
      <main>
        <section class="panel">
          <h2>Registrar libro</h2>

          <form id="form-libro">
            <input type="hidden" id="libro-id">

            <label for="titulo">Título</label>
            <input id="titulo" maxlength="120" required>

            <label for="autor">Autor</label>
            <input id="autor" maxlength="100" required>

            <label for="genero">Género</label>
            <input id="genero" maxlength="60" required>

            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" maxlength="500"></textarea>

            <div class="acciones-formulario">
              <button type="submit" id="btn-libro">
                Guardar libro
              </button>
              <button type="button" id="cancelar-libro"
                class="secundario" hidden>
                Cancelar
              </button>
            </div>
          </form>
        </section>

        <section class="panel">
          <h2>Reseña anónima</h2>

          <form id="form-resena">
            <input type="hidden" id="resena-id">

            <label for="libro-resena">Libro</label>
            <select id="libro-resena" required></select>

            <label for="estrellas">Valoración</label>
            <select id="estrellas" required>
              <option value="5">★★★★★ - 5 estrellas</option>
              <option value="4">★★★★☆ - 4 estrellas</option>
              <option value="3">★★★☆☆ - 3 estrellas</option>
              <option value="2">★★☆☆☆ - 2 estrellas</option>
              <option value="1">★☆☆☆☆ - 1 estrella</option>
            </select>

            <label for="comentario">Tu opinión</label>
            <textarea id="comentario" maxlength="500"
              required></textarea>

            <div class="acciones-formulario">
              <button type="submit" id="btn-resena">
                Publicar reseña
              </button>
              <button type="button" id="cancelar-resena"
                class="secundario" hidden>
                Cancelar
              </button>
            </div>
          </form>
        </section>

        <section class="biblioteca">
          <h2>Biblioteca compartida</h2>
          <p id="contador"></p>
          <div id="lista-libros"></div>
        </section>
      </main>

      <footer>
        Club de Lectura Secreto · Las reseñas son anónimas
      </footer>
    `;
  }

  private campo<T extends HTMLElement>(id: string): T {
    const elemento = this.app.querySelector<T>(`#${id}`);

    if (!elemento) {
      throw new Error(`No se encontró el campo ${id}`);
    }

    return elemento;
  }

  private configurarEventos(): void {
    this.campo<HTMLFormElement>('form-libro')
      .addEventListener('submit', (evento) => {
        evento.preventDefault();

        const idTexto = this.campo<HTMLInputElement>('libro-id').value;

        this.acciones.guardarLibro(
          idTexto ? Number(idTexto) : null,
          {
            titulo: this.campo<HTMLInputElement>('titulo').value,
            autor: this.campo<HTMLInputElement>('autor').value,
            genero: this.campo<HTMLInputElement>('genero').value,
            descripcion: this.campo<HTMLTextAreaElement>('descripcion').value,
          }
        );
      });

    this.campo<HTMLFormElement>('form-resena')
      .addEventListener('submit', (evento) => {
        evento.preventDefault();

        const idTexto = this.campo<HTMLInputElement>('resena-id').value;

        this.acciones.guardarResena(
          idTexto ? Number(idTexto) : null,
          {
            libro_id: Number(
              this.campo<HTMLSelectElement>('libro-resena').value
            ),
            estrellas: Number(
              this.campo<HTMLSelectElement>('estrellas').value
            ),
            comentario:
              this.campo<HTMLTextAreaElement>('comentario').value,
          }
        );
      });

    this.app.addEventListener('click', (evento) => {
      const objetivo = evento.target;

      if (!(objetivo instanceof HTMLElement)) return;

      const boton = objetivo.closest<HTMLButtonElement>('button');

      if (!boton) return;

      if (boton.id === 'cancelar-libro') {
        this.limpiarLibro();
        return;
      }

      if (boton.id === 'cancelar-resena') {
        this.limpiarResena();
        return;
      }

      const id = Number(boton.dataset.id);

      if (!Number.isSafeInteger(id) || id <= 0) return;

      switch (boton.dataset.accion) {
        case 'eliminar-libro':
          if (confirm('¿Eliminar este libro y sus reseñas?')) {
            this.acciones.eliminarLibro(id);
          }
          break;

        case 'eliminar-resena':
          if (confirm('¿Eliminar esta reseña?')) {
            this.acciones.eliminarResena(id);
          }
          break;

        case 'editar-libro':
          this.editarLibro(id);
          break;

        case 'editar-resena':
          this.editarResena(id);
          break;
      }
    });
  }

  private librosActuales: Libro[] = [];
  private resenasActuales: Resena[] = [];

  mostrar(libros: Libro[], resenas: Resena[]): void {
    this.librosActuales = libros;
    this.resenasActuales = resenas;

    const selector = this.campo<HTMLSelectElement>('libro-resena');
    const seleccionado = selector.value;

    selector.replaceChildren();

    for (const libro of libros) {
      const opcion = document.createElement('option');
      opcion.value = String(libro.id);
      opcion.textContent = libro.titulo;
      selector.append(opcion);
    }

    if (libros.some((libro) => String(libro.id) === seleccionado)) {
      selector.value = seleccionado;
    }

    const botonResena = this.campo<HTMLButtonElement>('btn-resena');
    botonResena.disabled = libros.length === 0;

    this.campo<HTMLParagraphElement>('contador').textContent =
      `${libros.length} libro(s) registrado(s)`;

    const lista = this.campo<HTMLDivElement>('lista-libros');
    lista.replaceChildren();

    if (libros.length === 0) {
      const vacio = document.createElement('p');
      vacio.className = 'vacio';
      vacio.textContent =
        'Todavía no hay libros. ¡Registra el primero!';
      lista.append(vacio);
      return;
    }

    for (const libro of libros) {
      lista.append(this.crearTarjeta(libro, resenas));
    }
  }

  private crearBoton(
    texto: string,
    accion: string,
    id: number
  ): HTMLButtonElement {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = texto;
    boton.dataset.accion = accion;
    boton.dataset.id = String(id);
    boton.className = 'secundario';
    return boton;
  }

  private crearTarjeta(
    libro: Libro,
    resenas: Resena[]
  ): HTMLElement {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-libro';

    const titulo = document.createElement('h3');
    titulo.textContent = libro.titulo;

    const autor = document.createElement('p');
    autor.textContent = `Autor: ${libro.autor}`;

    const genero = document.createElement('p');
    genero.textContent = `Género: ${libro.genero}`;

    const descripcion = document.createElement('p');
    descripcion.textContent = libro.descripcion;

    const resenasLibro = resenas.filter(
      (resena) => resena.libro_id === libro.id
    );

    const promedio = resenasLibro.length
      ? resenasLibro.reduce(
          (total, resena) => total + resena.estrellas, 0
        ) / resenasLibro.length
      : 0;

    const valoracion = document.createElement('p');
    valoracion.className = 'valoracion';
    valoracion.textContent = resenasLibro.length
      ? `★ ${promedio.toFixed(1)} / 5 (${resenasLibro.length} reseñas)`
      : 'Sin valoraciones todavía';

    const acciones = document.createElement('div');
    acciones.className = 'acciones';

    acciones.append(
      this.crearBoton('Editar libro', 'editar-libro', libro.id),
      this.crearBoton('Eliminar libro', 'eliminar-libro', libro.id)
    );

    tarjeta.append(
      titulo, autor, genero, descripcion, valoracion, acciones
    );

    const subtitulo = document.createElement('h4');
    subtitulo.textContent = 'Reseñas anónimas';
    tarjeta.append(subtitulo);

    for (const resena of resenasLibro) {
      const bloque = document.createElement('div');
      bloque.className = 'resena';

      const estrellas = document.createElement('strong');
      estrellas.textContent =
        '★'.repeat(resena.estrellas) +
        '☆'.repeat(5 - resena.estrellas);

      const comentario = document.createElement('p');
      comentario.textContent = resena.comentario;

      const botones = document.createElement('div');
      botones.className = 'acciones';

      botones.append(
        this.crearBoton('Editar', 'editar-resena', resena.id),
        this.crearBoton('Eliminar', 'eliminar-resena', resena.id)
      );

      bloque.append(estrellas, comentario, botones);
      tarjeta.append(bloque);
    }

    return tarjeta;
  }

  private editarLibro(id: number): void {
    const libro = this.librosActuales.find((item) => item.id === id);
    if (!libro) return;

    this.campo<HTMLInputElement>('libro-id').value = String(id);
    this.campo<HTMLInputElement>('titulo').value = libro.titulo;
    this.campo<HTMLInputElement>('autor').value = libro.autor;
    this.campo<HTMLInputElement>('genero').value = libro.genero;
    this.campo<HTMLTextAreaElement>('descripcion').value =
      libro.descripcion;

    this.campo<HTMLButtonElement>('btn-libro').textContent =
      'Actualizar libro';
    this.campo<HTMLButtonElement>('cancelar-libro').hidden = false;

    this.campo<HTMLFormElement>('form-libro')
      .scrollIntoView({ behavior: 'smooth' });
  }

  private editarResena(id: number): void {
    const resena = this.resenasActuales.find(
      (item) => item.id === id
    );
    if (!resena) return;

    this.campo<HTMLInputElement>('resena-id').value = String(id);
    this.campo<HTMLSelectElement>('libro-resena').value =
      String(resena.libro_id);
    this.campo<HTMLSelectElement>('estrellas').value =
      String(resena.estrellas);
    this.campo<HTMLTextAreaElement>('comentario').value =
      resena.comentario;

    this.campo<HTMLButtonElement>('btn-resena').textContent =
      'Actualizar reseña';
    this.campo<HTMLButtonElement>('cancelar-resena').hidden = false;

    this.campo<HTMLFormElement>('form-resena')
      .scrollIntoView({ behavior: 'smooth' });
  }

  limpiarLibro(): void {
    this.campo<HTMLFormElement>('form-libro').reset();
    this.campo<HTMLInputElement>('libro-id').value = '';
    this.campo<HTMLButtonElement>('btn-libro').textContent =
      'Guardar libro';
    this.campo<HTMLButtonElement>('cancelar-libro').hidden = true;
  }

  limpiarResena(): void {
    this.campo<HTMLFormElement>('form-resena').reset();
    this.campo<HTMLInputElement>('resena-id').value = '';
    this.campo<HTMLButtonElement>('btn-resena').textContent =
      'Publicar reseña';
    this.campo<HTMLButtonElement>('cancelar-resena').hidden = true;
  }

  mensaje(texto: string): void {
  const notificacion = this.campo<HTMLDivElement>('notificacion');

  notificacion.textContent = texto;
  notificacion.hidden = false;
  }
}
