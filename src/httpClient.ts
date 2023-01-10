import { AxiosResponse } from "axios";
import * as E from "fp-ts/Either";
import * as RTE from "fp-ts/ReaderTaskEither";
import * as Str from "fp-ts/string";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

import { HttpDecodeError } from "./codecs";
import {
  HttpJsonError,
  HttpRequestError,
  HttpResponseStatusError,
  mkHttpResponseStatusError,
} from "./httpError";

/*
 * Credit to Andy White's blog post
 * https://andywhite.xyz/posts/2021-01-28-rte-react/
 */

/*
 * Types
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface HttpRequest {
  method: HttpMethod;
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
}

export type HttpResponse = AxiosResponse;

export interface HttpClient {
  sendRequest(request: HttpRequest): TE.TaskEither<HttpRequestError, HttpResponse>;
}

export interface AppEnv {
  httpClient: HttpClient;
  accessToken: Readonly<string>;
}

/*
 * RTE and helper functions
 */

export const sendRequest = (
  httpRequest: HttpRequest,
): RTE.ReaderTaskEither<AppEnv, HttpRequestError, HttpResponse> => {
  return pipe(
    RTE.asks((m: AppEnv) => m.httpClient),
    RTE.chainTaskEitherKW((httpClient) => httpClient.sendRequest(httpRequest)),
  );
};

const ensureStatusRange =
  (minStatusInclusive: number, maxStatusExclusive: number) =>
  (response: AxiosResponse): E.Either<HttpResponseStatusError, AxiosResponse> => {
    return minStatusInclusive <= response.status && response.status < maxStatusExclusive
      ? E.right(response)
      : E.left(mkHttpResponseStatusError(response.status, minStatusInclusive, maxStatusExclusive));
  };

const ensure2xx = ensureStatusRange(200, 300);

// export const getJson = <A>(
//   endpoint: string,
//   decode: (raw: unknown) => E.Either<HttpDecodeError, A>,
//   headers?: Record<string, string>,
// ): RTE.ReaderTaskEither<HttpClientEnv, HttpJsonError, A> => {
//   return pipe(
//     sendRequest({ method: "GET", endpoint, headers }),
//     RTE.chainEitherKW(ensure2xx),
//     RTE.map((response) => response.data),
//     RTE.chainEitherKW(decode),
//   );
// };

export const getJson = <A>(
  endpoint: string,
  decode: (raw: unknown) => E.Either<HttpDecodeError, A>,
  headers?: Record<string, string>,
): RTE.ReaderTaskEither<AppEnv, HttpJsonError, A> => {
  return pipe(
    RTE.asks((env: AppEnv) => env.accessToken),
    RTE.chain((accessToken) =>
      sendRequest({
        method: "GET",
        endpoint,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ),
    RTE.chainEitherKW(ensure2xx),
    RTE.map((response) => response.data),
    RTE.chainEitherKW(decode),
  );
};

export const postJson = <A>(
  endpoint: string,
  body: any,
  decode: (raw: unknown) => E.Either<HttpDecodeError, A>,
  headers?: Record<string, string>,
): RTE.ReaderTaskEither<AppEnv, HttpJsonError, A> => {
  return pipe(
    RTE.asks((env: AppEnv) => env.accessToken),
    RTE.chain((accessToken) =>
      sendRequest({
        method: "POST",
        endpoint,
        body,
        headers: {
          ...headers,
          Authorization: Str.isEmpty(accessToken) ? "" : `Bearer ${accessToken}`,
        },
      }),
    ),
    RTE.chainEitherKW(ensure2xx),
    RTE.map((response) => response.data),
    RTE.chainEitherKW(decode),
  );
};
