import { Env } from "./types";

const main = () => {
  try {
    const env: Env = {
      accessKeyId: process.env.FLATFILE_ACCESS_KEY_ID || "",
      apiHost: process.env.FLATFILE_API_HOST || "",
      secretAccessKey: process.env.FLATFILE_SECRET_ACCESS_KEY || "",
      accessToken: "",
      teamId: process.env.FLATFILE_TEAM_ID || "",
    };

    if (env.accessKeyId === "" || env.secretAccessKey === "") {
      throw "Ensure both FLATFILE_ACCESS_KEY_ID and FLATFILE_SECRET_ACCESS_KEY env vars are set";
    }
  } catch (err) {
    console.error(`Error: ${err}!`);
  }
};

main();
