export interface HttpClientEnv {
  apiHost: Readonly<string>;
  accessToken: Readonly<string>;
}

type HttpRequestError = {
  _tag: "httpRequestError";
  error: unknown;
};

type HttpContentTypeError = {
  _tag: "httpContentTypeError";
  error: unknown;
};

type HttpResponseStatusError = {
  _tag: "httpResponseStatusError";
  status: number;
};

type HttpDecodeError = {
  _tag: "httpDecodeError";
  errors: string;
};

export type HttpError =
  | HttpContentTypeError
  | HttpDecodeError
  | HttpRequestError
  | HttpResponseStatusError;
