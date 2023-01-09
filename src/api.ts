import * as RR from "fp-ts/ReadonlyRecord";
import * as RTE from "fp-ts/ReaderTaskEither";
import { pipe } from "fp-ts/function";
import * as Str from "fp-ts/string";

import {
  Environment,
  Space,
  User,
  Workbook,
  createEnvironmentCodec,
  createSpaceCodec,
  createTokenCodec,
  decodeWithCodec,
  listEnvironmentsCodec,
  listSpacesCodec,
  listUsersCodec,
  listWorkbooksCodec,
} from "./decode";
import { HttpJsonError } from "./httpError";
import { getJson, postJson, AppEnv } from "./httpClient";

const serializeParams = (params: Record<string, any>): string => {
  const f = <A>(k: string, a: A) => `?${k}=${a}`;

  return RR.collect(Str.Ord)(f)(params).join("");
};

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
    getJson("users", decodeWithCodec(listUsersCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listEnvironments = (): RTE.ReaderTaskEither<
  AppEnv,
  HttpJsonError,
  ReadonlyArray<Environment>
> => {
  return pipe(
    getJson("environments", decodeWithCodec(listEnvironmentsCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createEnvironment = (input: {
  name: string;
  isProd: boolean;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, Readonly<Environment>> => {
  return pipe(
    postJson("environments", input, decodeWithCodec(createEnvironmentCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listSpaces = (): RTE.ReaderTaskEither<AppEnv, HttpJsonError, ReadonlyArray<Space>> => {
  return pipe(
    getJson("spaces", decodeWithCodec(listSpacesCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createSpace = (input: {
  spaceConfigId: string;
  environmentId: string;
  primaryWorkbookId?: string;
  name?: string;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, Readonly<Space>> => {
  return pipe(
    postJson("spaces", input, decodeWithCodec(createSpaceCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listWorkbooks = (params: {
  spaceId: string;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, ReadonlyArray<Workbook>> => {
  const endpoint = Str.Monoid.concat("workbooks", serializeParams(params));

  return pipe(
    getJson(endpoint, decodeWithCodec(listWorkbooksCodec)),
    RTE.map(({ data }) => data),
  );
};

// export const createWorkbook = (input: {}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, Readonly<Space>> => {
//   return pipe(
//     postJson("workbooks", input, decodedWithCodec(createWorkbookCodec)),
//     RTE.map(({ data }) => data),
//   );
// }

export const createAgent = () => {};
export const listAgents = () => {};

export const createEvent = () => {};
export const updateEvent = () => {};
