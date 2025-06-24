import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class MatPaginatorIntlPtBr implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'Primeira página';
  lastPageLabel = 'Última página';
  nextPageLabel = 'Próxima página';
  previousPageLabel = 'Página anterior';

  itemsPerPageLabel = 'Itens por página:';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return '0 de ' + length;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} de ${length}`;
  }
}
