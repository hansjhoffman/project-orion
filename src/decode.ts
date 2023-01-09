import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as t from "io-ts";
import { failure } from "io-ts/lib/PathReporter";

/*
 * Types
 */

export type HttpDecodeError = {
  _tag: "httpDecodeError";
  errors: string;
};

export const mkHttpDecodeError = (errors: t.Errors): HttpDecodeError => ({
  _tag: "httpDecodeError",
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

const UserType = t.type({
  id: t.string,
  name: t.string,
  email: t.string,
  accountId: t.string,
});

export type User = t.TypeOf<typeof UserType>;

export const listUsersCodec = t.type({
  data: t.readonlyArray(UserType),
});

const environmentCodec = t.type({
  id: t.string,
  accountId: t.union([t.string, t.undefined]),
  name: t.string,
  isProd: t.boolean,
});

export type Environment = t.TypeOf<typeof environmentCodec>;

export const listEnvironmentsCodec = t.type({
  data: t.readonlyArray(environmentCodec),
});

export const createEnvironmentCodec = t.type({
  data: environmentCodec,
});

export type Space = t.TypeOf<typeof spaceCodec>;

export const spaceCodec = t.type({
  id: t.string,
  workbooksCount: t.number,
  createdByUserId: t.string,
  createdByUserName: t.string,
  guestLink: t.union([t.string, t.undefined]),
  spaceConfigId: t.string,
  environmentId: t.string,
  primaryWorkbookId: t.string,
  name: t.string,
  displayOrder: t.number,
  // sidebarConfigs: t.array({
  //   type: t.string,
  //   workbookId: t.string,
  // })
});

export const listSpacesCodec = t.type({
  pagination: t.type({
    currentPage: t.union([t.number, t.undefined]), // currentPage should default to 0 instead of be `undefined`
    pageCount: t.number,
    totalCount: t.number,
  }),
  data: t.readonlyArray(spaceCodec),
});

export const createSpaceCodec = t.type({
  data: spaceCodec,
});

// export const workbookConfigCodec = t.type({
//   name: t.string,
//   spaceId: t.string,
//   environmentId: t.string,
//   sheets: t.readonlyArray(),
// });

const constraintCodec = t.type({
  type: t.union([t.literal("required"), t.literal("unique")]),
});

export const fieldConfig = t.type({
  key: t.string,
  type: t.union([
    t.literal("string"),
    t.literal("number"),
    t.literal("boolean"),
    t.literal("date"),
    t.literal("enum"),
    t.literal("reference"),
  ]),
  label: t.union([t.string, t.undefined]),
  description: t.union([t.string, t.undefined]),
  constraints: t.union([t.array(constraintCodec), t.undefined]),
  config: t.union([
    t.type({
      key: t.union([t.string, t.undefined]),
      ref: t.union([t.string, t.undefined]),
      relationship: t.union([t.literal("has-one"), t.literal("has-many"), t.undefined]),
      options: t.union([t.array(t.type({ value: t.string, label: t.string })), t.undefined]),
    }),
    t.undefined,
  ]),
});

export const sheetConfigCodec = t.type({
  name: t.string,
  description: t.union([t.string, t.undefined]),
  slug: t.union([t.string, t.undefined]),
  fields: t.readonlyArray(fieldConfig),
});

export type SheetConfig = t.TypeOf<typeof sheetConfigCodec>;

export const sheetCodec = t.type({
  id: t.string,
  name: t.string,
  config: sheetConfigCodec,
});

export const workbookCodec = t.type({
  id: t.string,
  name: t.string,
  labels: t.array(t.string),
  spaceId: t.string,
  environmentId: t.string,
  sheets: t.readonlyArray(sheetCodec),
  //config: workbookConfigCodec,
});

export type Workbook = t.TypeOf<typeof workbookCodec>;

export const listWorkbooksCodec = t.type({
  data: t.readonlyArray(workbookCodec),
});

export const createWorkbookCodec = t.type({
  data: workbookCodec,
});

const BaseField = t.type({
  key: t.string,
  label: t.union([t.string, t.undefined]),
  description: t.union([t.string, t.undefined]),
  constraints: t.union([t.array(constraintCodec), t.undefined]),
});

const TextField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("string"),
  }),
]);

const DateField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("date"),
  }),
]);

const BooleanField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("boolean"),
  }),
]);

const NumberField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("number"),
  }),
]);

const CategoryField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("enum"),
    is_array: t.boolean,
    config: t.type({
      allow_custom: t.boolean,
      options: t.array(t.type({ value: t.string, label: t.string })),
    }),
  }),
]);

const LinkedField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("reference"),
    is_array: t.boolean,
    config: t.type({
      ref: t.string, // non-empty string
      key: t.union([t.string, t.undefined]),
      relationship: t.union([t.literal("has-one"), t.literal("has-many"), t.undefined]),
    }),
  }),
]);

export const createWorkbookEncoder = t.type({
  name: t.string,
  spaceId: t.string,
  environmentId: t.string,
  sheets: t.readonlyArray(
    t.type({
      name: t.string,
      fields: t.readonlyArray(
        t.union([TextField, DateField, BooleanField, NumberField, CategoryField, LinkedField]),
      ),
    }),
  ),
});

export type WorkbookInput = t.TypeOf<typeof createWorkbookEncoder>;
