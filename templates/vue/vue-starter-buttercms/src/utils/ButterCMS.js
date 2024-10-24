import Butter from "buttercms";

export let butterCMS = undefined;
try {
  const apiKey = String(import.meta.env.VITE_APP_BUTTER_CMS_API_KEY);
  const preview = import.meta.env.VITE_APP_BUTTER_CMS_PREVIEW !== "false";
  butterCMS = Butter(apiKey, preview);
} catch (error) {
  console.error(error);
}
