import * as Api from "./api";
import { HttpClientEnv } from "./types";

const main = async () => {
  try {
    if (process.env.FLATFILE_CLIENT_ID === "" || process.env.FLATFILE_SECRET === "") {
      throw "Ensure both FLATFILE_CLIENT_ID and FLATFILE_SECRET env vars are set";
    }

    const env: HttpClientEnv = {
      apiHost: process.env.FLATFILE_API_HOST || "",
      accessToken: "",
    };

    // const tokenPromise = Api.createToken({
    //   clientId: process.env.FLATFILE_CLIENT_ID ?? "",
    //   secret: process.env.FLATFILE_SECRET ?? "",
    // })(env);

    // const res = Api.listUsers()(env);
    const res = Api.listEnvironments()(env);

    console.log(await res());
  } catch (err) {
    console.error(`Error: ${err}!`);
  }
};

main();
