type SearchParamValue = string | number | boolean | null | undefined;

type ApiSearchParams = Record<string, SearchParamValue>;

type ApiGetOptions = {
  searchParams?: ApiSearchParams;
  signal?: AbortSignal;
};

const isDefinedSearchParam = (
  value: SearchParamValue,
): value is string | number | boolean => value !== undefined && value !== null;

export type { ApiSearchParams, ApiGetOptions };
export { isDefinedSearchParam };
