export interface PaginationInput {
  skip?: number;
  take?: number;
}

export interface PaginationOutput extends Required<PaginationInput> {
  count: number;
}
