import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(err: unknown, fallback = 'Erro ao realizar operação.'): string {
  if (err instanceof HttpErrorResponse) {
    return err.error?.message || err.message || fallback;
  }
  return fallback;
}
