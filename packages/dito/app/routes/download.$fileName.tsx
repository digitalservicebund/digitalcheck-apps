import { LoaderFunctionArgs } from "@remix-run/node";
import { promises as fs } from "fs";
import path from "path";
import trackCustomEvent from "utils/trackCustomEvent";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { fileName } = params;
  if (!fileName) {
    throw new Response("Please provide a file name", { status: 400 });
  }

  try {
    const filePath = path.join("public", "asset", fileName);
    const pdfData = await fs.readFile(filePath);

    trackCustomEvent(request, { name: "Download Dokumentation" });
    return new Response(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": `${pdfData.byteLength}`,
      },
    });
  } catch (error) {
    throw new Response("File not found", { status: 404 });
  }
}
