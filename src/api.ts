import * as RTE from "fp-ts/ReaderTaskEither";
import { pipe } from "fp-ts/function";

import {
  createTokenCodec,
  decodeWithCodec,
  getEnvironmentsCodec,
  getUsersCodec,
  User,
  Environment,
} from "./decode";
import { HttpJsonError } from "./httpError";
import { getJson, postJson, AppEnv } from "./httpClient";

export const createToken = (input: {
  clientId: string;
  secret: string;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, string> => {
  return pipe(
    postJson(
      "auth/access-token",
      {
        clientId: input.clientId,
        secret: input.secret,
      },
      decodeWithCodec(createTokenCodec),
    ),
    RTE.map(({ data }) => data.accessToken),
  );
};

export const listUsers = (): RTE.ReaderTaskEither<AppEnv, HttpJsonError, ReadonlyArray<User>> => {
  return pipe(
    getJson("users", decodeWithCodec(getUsersCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listEnvironments = (): RTE.ReaderTaskEither<
  AppEnv,
  HttpJsonError,
  ReadonlyArray<Environment>
> => {
  return pipe(
    getJson("environments", decodeWithCodec(getEnvironmentsCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createEnv = () => {};

export const createSpace = () => {};

export const createWorkbook = () => {};

export const createAgent = () => {};
export const listAgents = () => {};

export const createEvent = () => {};
export const updateEvent = () => {};
