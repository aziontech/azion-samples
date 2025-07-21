import type { AzionBucketObject, AzionStorageResponse } from "azion/storage";
import { createObject } from "azion/storage";
import { Hono } from "hono";

const app = new Hono();

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"]; // File | string

  // First check if file is a valid File object
  if (
    !file ||
    typeof file !== "object" ||
    typeof file.arrayBuffer !== "function"
  ) {
    return c.json({ message: "Invalid file" }, 400);
  }

  // Check if file size exceeds 2MB limit
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return c.json({ message: "File size exceeds 2MB limit" }, 413);
  }

  try {
    const { data: newObject, error }: AzionStorageResponse<AzionBucketObject> =
      await createObject({
        bucket: process.env.BUCKET_NAME!,
        key: file.name,
        // @ts-expect-error content is wrongly typed
        content: await file.arrayBuffer(),
      });

    if (error) {
      throw new Error(error.message);
    }

    if (newObject) {
      console.log(`Object created with key: ${newObject.key}`);
    } else {
      console.error("Failed to create object", error);
    }

    // @ts-expect-error content is wrongly typed
    const content = new Uint8Array(newObject.content);

    return c.body(content, {
      status: 200,
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${newObject?.key}"`,
        "Content-Length": newObject?.size?.toString() ?? "0",
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return c.json({ message: "Error uploading file" }, 500);
  }
});

export { app };
