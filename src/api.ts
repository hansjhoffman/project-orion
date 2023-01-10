import * as RR from "fp-ts/ReadonlyRecord";
import * as RTE from "fp-ts/ReaderTaskEither";
import { pipe } from "fp-ts/function";
import * as Str from "fp-ts/string";

import * as C from "./codecs";
import { HttpJsonError } from "./httpError";
import { getJson, postJson, AppEnv } from "./httpClient";

const _serializeParams = (params: Record<string, any>): string => {
  const f = <A>(k: string, a: A) => `?${k}=${a}`;

  return RR.collect(Str.Ord)(f)(params).join("");
};

export const createToken = (input: {
  clientId: Readonly<string>;
  secret: Readonly<string>;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, string> => {
  return pipe(
    postJson(
      "auth/access-token",
      {
        clientId: input.clientId,
        secret: input.secret,
      },
      C.decodeWithCodec(C.createTokenCodec),
    ),
    RTE.map(({ data }) => data.accessToken),
  );
};

export const listUsers = (): RTE.ReaderTaskEither<AppEnv, HttpJsonError, ReadonlyArray<C.User>> => {
  return pipe(
    getJson("users", C.decodeWithCodec(C.listUsersCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listEnvironments = (): RTE.ReaderTaskEither<
  AppEnv,
  HttpJsonError,
  ReadonlyArray<C.Environment>
> => {
  return pipe(
    getJson("environments", C.decodeWithCodec(C.listEnvironmentsCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createEnvironment = (input: {
  name: Readonly<string>;
  isProd: Readonly<boolean>;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, Readonly<C.Environment>> => {
  return pipe(
    postJson("environments", input, C.decodeWithCodec(C.createEnvironmentCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listSpaces = (): RTE.ReaderTaskEither<
  AppEnv,
  HttpJsonError,
  ReadonlyArray<C.Space>
> => {
  return pipe(
    getJson("spaces", C.decodeWithCodec(C.listSpacesCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createSpace = (input: {
  spaceConfigId: Readonly<C.SpaceConfigId>;
  environmentId: Readonly<C.EnvironmentId>;
  primaryWorkbookId?: Readonly<C.WorkbookId>;
  name?: Readonly<string>;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, Readonly<C.Space>> => {
  return pipe(
    postJson("spaces", input, C.decodeWithCodec(C.createSpaceCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listWorkbooks = (params: {
  spaceId: Readonly<C.SpaceId>;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, ReadonlyArray<C.Workbook>> => {
  const endpoint = Str.Monoid.concat("workbooks", _serializeParams(params));

  return pipe(
    getJson(endpoint, C.decodeWithCodec(C.listWorkbooksCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createWorkbook = (
  input: Readonly<C.WorkbookInput>,
): RTE.ReaderTaskEither<AppEnv, HttpJsonError, Readonly<C.Workbook>> => {
  return pipe(
    postJson("workbooks", input, C.decodeWithCodec(C.createWorkbookCodec)),
    RTE.map(({ data }) => data),
  );
};

export const listAgents = (params: {
  environmentId: Readonly<C.EnvironmentId>;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, ReadonlyArray<C.Agent>> => {
  return pipe(
    getJson(`environments/${params.environmentId}/agents`, C.decodeWithCodec(C.listAgentsCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createAgent = (
  input: Readonly<C.AgentInput>,
  params: {
    environmentId: Readonly<C.EnvironmentId>;
  },
): RTE.ReaderTaskEither<AppEnv, HttpJsonError, Readonly<C.Agent>> => {
  return pipe(
    postJson(
      `environments/${params.environmentId}/agents`,
      input,
      C.decodeWithCodec(C.createAgentCodec),
    ),
    RTE.map(({ data }) => data),
  );
};

export const listEvents = (params: {
  environmentId: Readonly<C.EnvironmentId>;
}): RTE.ReaderTaskEither<AppEnv, HttpJsonError, ReadonlyArray<C.Event>> => {
  return pipe(
    getJson(`environments/${params.environmentId}/events`, C.decodeWithCodec(C.listEventsCodec)),
    RTE.map(({ data }) => data),
  );
};

export const createEvent = () => {};
