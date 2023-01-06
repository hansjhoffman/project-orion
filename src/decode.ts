import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as t from "io-ts";
import { failure } from "io-ts/lib/PathReporter";

/*
 * Types
 */

export type HttpDecodeError = {
  _tag: "httpDecodeError";
  // errors: t.Errors;
  errors: string;
};

export const mkHttpDecodeError = (errors: t.Errors): HttpDecodeError => ({
  _tag: "httpDecodeError",
  // errors,
  errors: failure(errors).join("\n"),
});

export const decodeWithCodec =
  <A>(codec: t.Type<A>) =>
  (value: unknown): E.Either<HttpDecodeError, A> => {
    return pipe(codec.decode(value), E.mapLeft(mkHttpDecodeError));
  };

/*
 * Codecs
 */

export const createTokenCodec = t.type({
  data: t.type({
    accessToken: t.string,
    expiresIn: t.number,
    expires: t.string,
  }),
});

export type CreateTokenResponse = {
  data: t.TypeOf<typeof createTokenCodec>;
};

const UserType = t.type({
  id: t.string,
  name: t.string,
  email: t.string,
  accountId: t.string,
});

export type User = t.TypeOf<typeof UserType>;

export const getUsersCodec = t.type({
  data: t.readonlyArray(UserType),
});

export type GetUsersResponse = {
  data: t.TypeOf<typeof getUsersCodec>;
};

const EnvType = t.type({
  id: t.string,
  accountId: t.union([t.string, t.undefined]),
  name: t.string,
  isProd: t.boolean,
});

export type Environment = t.TypeOf<typeof EnvType>;

export const getEnvironmentsCodec = t.type({
  data: t.readonlyArray(EnvType),
});

export type GetEnvironmentsResponse = {
  data: t.TypeOf<typeof getEnvironmentsCodec>;
};
