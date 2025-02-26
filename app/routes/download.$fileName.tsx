import { LoaderFunctionArgs } from "@remix-run/node";
import { promises as fs } from "fs";
import mime from "mime-types";
import path from "path";
import trackCustomEvent from "~/utils/trackCustomEvent.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { fileName } = params;

  if (!fileName) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Please provide a file name", { status: 400 });
  }

  try {
    const filePath = path.join("public", "assets", fileName);
    const fileData = await fs.readFile(filePath);
    const mimeType = mime.contentType(fileName) || "";

    void trackCustomEvent(request, { name: `Download`, props: { fileName } });
    return new Response(fileData, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": `${fileData.byteLength}`,
      },
    });
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("File not found", { status: 404 });
  }
}
