import {
  isDefinedSearchParam,
  type ApiSearchParams,
  type ApiGetOptions,
} from './client.types';

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const bodyText = await response.text();

  if (bodyText === '') {
    return null;
  }

  try {
    return JSON.parse(bodyText) as unknown;
  } catch {
    return bodyText;
  }
};

const getErrorMessage = (body: unknown, status: number): string => {
  if (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message;
  }

  return `Request failed with status ${status}.`;
};

class ApiClientError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(getErrorMessage(body, status));
    this.name = 'ApiClientError';
    this.status = status;
    this.body = body;
  }
}

const buildApiUrl = (path: string, searchParams?: ApiSearchParams): string => {
  const urlSearchParams = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (isDefinedSearchParam(value)) {
      urlSearchParams.set(key, String(value));
    }
  });

  const serializedSearchParams = urlSearchParams.toString();

  return serializedSearchParams === ''
    ? path
    : `${path}?${serializedSearchParams}`;
};

const apiClient = {
  async get<ResponseBody>(
    path: string,
    options: ApiGetOptions = {},
  ): Promise<ResponseBody> {
    const requestInit: RequestInit = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      ...(options.signal ? { signal: options.signal } : {}),
    };
    const response = await fetch(
      buildApiUrl(path, options.searchParams),
      requestInit,
    );
    const body = await parseResponseBody(response);

    if (!response.ok) {
      throw new ApiClientError(response.status, body);
    }

    return body as ResponseBody;
  },
};

export { apiClient, ApiClientError, buildApiUrl };
