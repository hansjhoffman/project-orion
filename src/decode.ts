import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as t from "io-ts";
import { failure } from "io-ts/lib/PathReporter";

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
 * Branded Types
 */

export const UserId = new t.Type<string, string, unknown>(
  "UserId",
  (input: unknown): input is string =>
    typeof input === "string" && /\bdev_usr_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_usr_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const AccountId = new t.Type<string, string, unknown>(
  "AccountId",
  (input: unknown): input is string =>
    typeof input === "string" && /\bdev_acc_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_acc_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const EnvironmentId = new t.Type<string, string, unknown>(
  "EnvironmentId ",
  (input: unknown): input is string =>
    typeof input === "string" && /\bdev_env_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_env_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const AgentId = new t.Type<string, string, unknown>(
  "AgentId",
  (input: unknown): input is string => typeof input === "string" && /\bdev_ag_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_ag_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const EventId = new t.Type<string, string, unknown>(
  "EventId",
  (input: unknown): input is string =>
    typeof input === "string" && /\bdev_evt_\w{16}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_evt_\w{16}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const SpaceId = new t.Type<string, string, unknown>(
  "SpaceId",
  (input: unknown): input is string => typeof input === "string" && /\bdev_sp_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_sp_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const SpaceConfigId = new t.Type<string, string, unknown>(
  "SpaceConfigId",
  (input: unknown): input is string => typeof input === "string" && /\bdev_sc_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_sc_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const DocumentId = new t.Type<string, string, unknown>(
  "DocumentId",
  (input: unknown): input is string => typeof input === "string" && /\bdev_dc_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_dc_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const WorkbookId = new t.Type<string, string, unknown>(
  "WorkbookId",
  (input: unknown): input is string => typeof input === "string" && /\bdev_wb_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_wb_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const SheetId = new t.Type<string, string, unknown>(
  "SheetId",
  (input: unknown): input is string => typeof input === "string" && /\bdev_sh_\w{8}\b/g.test(input),
  (input, context) =>
    typeof input === "string" && /\bdev_sh_\w{8}\b/g.test(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

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

const userCodec = t.type({
  id: UserId,
  name: t.string,
  email: t.string,
  accountId: AccountId,
});

export type User = t.TypeOf<typeof userCodec>;

export const listUsersCodec = t.type({
  data: t.readonlyArray(userCodec),
});

const environmentCodec = t.intersection([
  t.type({
    id: EnvironmentId,
    name: t.string,
    isProd: t.boolean,
  }),
  t.partial({
    accountId: AccountId,
  }),
]);

export type Environment = t.TypeOf<typeof environmentCodec>;

export const listEnvironmentsCodec = t.type({
  data: t.readonlyArray(environmentCodec),
});

export const createEnvironmentCodec = t.type({
  data: environmentCodec,
});

export const spaceCodec = t.intersection([
  t.type({
    id: SpaceId,
    spaceConfigId: SpaceConfigId,
    environmentId: EnvironmentId,
  }),
  t.partial({
    workbooksCount: t.number,
    createdByUserId: UserId,
    createdByUserName: t.string,
    guestLink: t.string,
    primaryWorkbookId: WorkbookId,
    name: t.string,
    displayOrder: t.number,
    sidebarConfigs: t.union([
      t.array(
        t.union([
          t.type({ type: t.literal("workbook"), workbookId: WorkbookId }),
          t.type({ type: t.literal("document"), documentId: DocumentId }),
          t.type({ type: t.literal("link"), href: t.string, title: t.string }),
        ]),
      ),
      t.null,
    ]),
  }),
]);

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

export type Space = t.TypeOf<typeof spaceCodec>;

// export const workbookConfigCodec = t.type({
//   name: t.string,
//   spaceId: t.string,
//   environmentId: t.string,
//   sheets: t.readonlyArray(),
// });

const constraintCodec = t.type({
  type: t.union([t.literal("required"), t.literal("unique")]),
});

const BaseField = t.intersection([
  t.type({
    key: t.string,
  }),
  t.partial({
    label: t.string,
    description: t.string,
    constraints: t.array(constraintCodec),
  }),
]);

export const TextField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("string"),
  }),
]);

export const DateField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("date"),
  }),
]);

export const BooleanField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("boolean"),
  }),
]);

export const NumberField = t.intersection([
  BaseField,
  t.type({
    type: t.literal("number"),
  }),
]);

export const CategoryField = t.intersection([
  BaseField,
  t.intersection([
    t.type({
      type: t.literal("enum"),
      config: t.intersection([
        t.type({
          options: t.array(t.type({ value: t.string, label: t.string })),
        }),
        t.partial({
          allow_custom: t.boolean,
        }),
      ]),
    }),
    t.partial({
      is_array: t.boolean,
    }),
  ]),
]);

export const LinkedField = t.intersection([
  BaseField,
  t.intersection([
    t.type({
      type: t.literal("reference"),
      config: t.intersection([
        t.type({
          ref: t.string, // non-empty string
        }),
        t.partial({
          key: t.string,
          relationship: t.union([t.literal("has-one"), t.literal("has-many")]),
        }),
      ]),
    }),
    t.partial({
      is_array: t.boolean,
    }),
  ]),
]);

export const sheetConfigCodec = t.intersection([
  t.type({
    name: t.string,
    fields: t.readonlyArray(
      t.union([TextField, DateField, BooleanField, NumberField, CategoryField, LinkedField]),
    ),
  }),
  t.partial({
    description: t.string,
    slug: t.string,
  }),
]);

export type SheetConfig = t.TypeOf<typeof sheetConfigCodec>;

export const sheetCodec = t.type({
  id: SheetId,
  name: t.string,
  config: sheetConfigCodec,
});

export const workbookCodec = t.type({
  id: WorkbookId,
  name: t.string,
  labels: t.array(t.string),
  spaceId: SpaceId,
  environmentId: EnvironmentId,
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
