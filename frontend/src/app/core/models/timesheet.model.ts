export interface Timesheet {
  id: number;
  dataRegistro: string;
  horasTrabalhadas: number;
  horasExtras: number;
  descricaoTarefa: string;
  desenvolvedorId: number;
  sprintId: number;
}

export interface TimesheetRequest {
  dataRegistro: string;
  horasTrabalhadas: number;
  horasExtras: number;
  descricaoTarefa: string;
  desenvolvedorId: number;
  sprintId: number;
}
