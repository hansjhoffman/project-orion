import { HttpDecodeError } from "./decode";

export type HttpRequestError = {
  _tag: "httpRequestError";
  error: unknown;
};

export const mkHttpRequestError = (error: unknown): HttpRequestError => ({
  _tag: "httpRequestError",
  error,
});

export type HttpContentTypeError<CT> = {
  _tag: "httpContentTypeError";
  attemptedContentType: CT;
  error: unknown;
};

export const mkHttpContentTypeError = <CT>(
  attemptedContentType: CT,
  error: unknown,
): HttpContentTypeError<CT> => ({
  _tag: "httpContentTypeError",
  attemptedContentType,
  error,
});

export type HttpResponseStatusError = {
  _tag: "httpResponseStatusError";
  status: number;
  minStatusInclusive: number;
  maxStatusExclusive: number;
};

export const mkHttpResponseStatusError = (
  status: number,
  minStatusInclusive: number,
  maxStatusExclusive: number,
): HttpResponseStatusError => ({
  _tag: "httpResponseStatusError",
  status,
  minStatusInclusive,
  maxStatusExclusive,
});

export type HttpJsonError =
  | HttpContentTypeError<"json">
  | HttpRequestError
  | HttpResponseStatusError
  | HttpDecodeError;
