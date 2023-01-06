import axios from "axios";
import * as E from "fp-ts/Either";
import * as RTE from "fp-ts/ReaderTaskEither";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { failure } from "io-ts/lib/PathReporter";

import { authCodec, usersCodec, User, Environment, environmentsCodec } from "./codecs";
import { HttpClientEnv, HttpError } from "./types";

export const createToken = (input: {
  clientId: string;
  secret: string;
}): RTE.ReaderTaskEither<HttpClientEnv, HttpError, string> => {
  return pipe(
    RTE.ask<HttpClientEnv>(),
    RTE.chain((env) => {
      return RTE.fromTaskEither(
        TE.tryCatch(
          () => {
            return axios({
              method: "POST",
              url: `https://${env.apiHost}/auth/access-token`,
              data: {
                clientId: input.clientId,
                secret: input.secret,
              },
            });
          },
          (reason): HttpError => ({
            _tag: "httpRequestError",
            error: reason,
          }),
        ),
      );
    }),
    RTE.chainW(({ data }) => {
      return RTE.fromEither(
        pipe(
          authCodec.decode(data),
          E.map(({ data }) => data.accessToken),
          E.mapLeft(
            (errors): HttpError => ({
              _tag: "httpDecodeError",
              errors: failure(errors).join("\n"),
            }),
          ),
        ),
      );
    }),
  );
};

export const listUsers = (): RTE.ReaderTaskEither<
  HttpClientEnv,
  HttpError,
  ReadonlyArray<User>
> => {
  return pipe(
    RTE.ask<HttpClientEnv>(),
    RTE.chain((env) => {
      return RTE.fromTaskEither(
        TE.tryCatch(
          () => {
            return axios({
              method: "GET",
              url: `https://${env.apiHost}/users`,
              headers: {
                Authorization: `Bearer ${env.accessToken}`,
              },
            });
          },
          (reason): HttpError => ({
            _tag: "httpRequestError",
            error: reason,
          }),
        ),
      );
    }),
    RTE.chainW(({ data }) => {
      return RTE.fromEither(
        pipe(
          usersCodec.decode(data),
          E.map(({ data }) => data),
          E.mapLeft(
            (errors): HttpError => ({
              _tag: "httpDecodeError",
              errors: failure(errors).join("\n"),
            }),
          ),
        ),
      );
    }),
  );
};

export const listEnvironments = (): RTE.ReaderTaskEither<
  HttpClientEnv,
  HttpError,
  ReadonlyArray<Environment>
> => {
  return pipe(
    RTE.ask<HttpClientEnv>(),
    RTE.chain((env) => {
      return RTE.fromTaskEither(
        TE.tryCatch(
          () => {
            return axios({
              method: "GET",
              url: `https://${env.apiHost}/environments`,
              headers: {
                Authorization: `Bearer ${env.accessToken}`,
              },
            });
          },
          (reason): HttpError => ({
            _tag: "httpRequestError",
            error: reason,
          }),
        ),
      );
    }),
    RTE.chainW(({ data }) => {
      return RTE.fromEither(
        pipe(
          environmentsCodec.decode(data),
          E.map(({ data }) => data),
          E.mapLeft(
            (errors): HttpError => ({
              _tag: "httpDecodeError",
              errors: failure(errors).join("\n"),
            }),
          ),
        ),
      );
    }),
  );
};

export const createEnv = () => {};

export const createSpace = () => {};

export const createWorkbook = () => {};

export const createAgent = () => {};
export const listAgents = () => {};

export const createEvent = () => {};
export const updateEvent = () => {};
