
import { DatabaseService } from './db/database';
import { BibliotecaController } from './controllers/bibliotecaController';
import './styles/styles.css';

async function iniciarAplicacion(): Promise<void> {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    console.error('No se encontró el elemento #app');
    return;
  }

  try {
    await DatabaseService.init();

    new BibliotecaController();

    console.log('Club de Lectura Secreto iniciado correctamente');
  } catch (error: unknown) {
    console.error('Error al iniciar la aplicación:', error);

    app.replaceChildren();

    const mensaje = document.createElement('p');
    mensaje.textContent =
      'No se pudo iniciar la biblioteca. Intenta recargar la página.';

    app.append(mensaje);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  void iniciarAplicacion();
});
