import axios from "axios";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as RTE from "fp-ts/ReaderTaskEither";
import { pipe } from "fp-ts/function";
import { match } from "ts-pattern";

import * as Api from "./api";
// import { HttpClient, HttpClientEnv, HttpRequest } from "./httpClient";
import { HttpClient, AppEnv, HttpRequest } from "./httpClient";
import { HttpRequestError, mkHttpRequestError } from "./httpError";

const httpClient: HttpClient = {
  sendRequest: (req: HttpRequest) => {
    return TE.tryCatch(
      () =>
        axios({
          method: req.method,
          url: `https://${process.env.FLATFILE_API_HOST}/${req.endpoint}`,
          data: req.method === "POST" ? req.body : undefined,
          headers: req.headers,
        }),
      (reason) => mkHttpRequestError(reason),
    );
  },
};

const main = async () => {
  try {
    if (process.env.FLATFILE_CLIENT_ID === "" || process.env.FLATFILE_SECRET === "") {
      throw "Ensure both FLATFILE_CLIENT_ID and FLATFILE_SECRET env vars are set";
    }

    // const clientEnv: HttpClientEnv = {
    //   httpClient,
    // };
    const appEnv: AppEnv = {
      httpClient,
      accessToken: "",
    };

    const tokenPromise = Api.createToken({
      clientId: process.env.FLATFILE_CLIENT_ID ?? "",
      secret: process.env.FLATFILE_SECRET ?? "",
    })(appEnv);
    const token = await tokenPromise();

    pipe(
      token,
      E.match(
        () => {
          throw "Failed to authenticate.";
        },
        async (accessToken) => {
          const pipelinePromise = pipe(
            Api.listUsers(),
            RTE.chain(() => Api.listEnvironments()),
            RTE.mapLeft((err) => {
              match(err._tag)
                // .with("httpRequestError", ({ error }: HttpRequestError) => console.error(error))
                .with("httpRequestError", (error) => console.error(error))
                .with("httpContentTypeError", (error) => console.error(error))
                .with("httpResponseStatusError", () => console.error(""))
                .with("httpDecodeError", () => console.error(""))
                .exhaustive();
            }),
          )({ ...appEnv, accessToken });

          const response = await pipelinePromise();
          console.log(response);
        },
      ),
    );
  } catch (err) {
    console.error(`Error: ${err}!`);
  }
};

main();
