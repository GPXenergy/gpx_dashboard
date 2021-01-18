import { BaseModel } from './base';

/**
 * Paginator model as returned by API. Contains some page information and an
 * array of models (result).
 */
export interface PaginatorModel<T extends BaseModel> {
  count: number;
  pages: {
    current: number;
    end: number;
  };
  links: {
    next: string;
    previous: string;
  };
  results: T[];
}

export const emptyPaginator: PaginatorModel<any> = {
  count: 0,
  pages: {
    current: 1,
    end: 1,
  },
  links: {
    next: '',
    previous: '',
  },
  results: []
};
