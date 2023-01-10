import { AxiosError } from "axios";

import { HttpDecodeError } from "./codecs";

export type HttpRequestError = {
  _tag: "httpRequestError";
  error: AxiosError;
};

export const mkHttpRequestError = (error: AxiosError): HttpRequestError => ({
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
