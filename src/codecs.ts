import * as t from "io-ts";

export const authCodec = t.type({
  data: t.type({
    accessToken: t.string,
    expiresIn: t.number,
    expires: t.string,
  }),
});

export type AuthResponse = t.TypeOf<typeof authCodec>;

const UserType = t.type({
  id: t.string,
  name: t.string,
  email: t.string,
  accountId: t.string,
});

export type User = t.TypeOf<typeof UserType>;

export const usersCodec = t.type({
  data: t.readonlyArray(UserType),
});

export type UsersResponse = t.TypeOf<typeof usersCodec>;

const EnvType = t.type({
  id: t.string,
  accountId: t.union([t.string, t.undefined]),
  name: t.string,
  isProd: t.boolean,
});

export type Environment = t.TypeOf<typeof EnvType>;

export const environmentsCodec = t.type({
  data: t.readonlyArray(EnvType),
});

export type EnvironmentsResponse = t.TypeOf<typeof environmentsCodec>;
