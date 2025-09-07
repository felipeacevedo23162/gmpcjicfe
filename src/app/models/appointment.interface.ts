export interface Appointment {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  doctor: string;
  notas?: string;
}