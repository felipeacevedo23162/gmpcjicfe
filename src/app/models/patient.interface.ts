export interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  cedula: string;
  genero: 'M' | 'F';
}