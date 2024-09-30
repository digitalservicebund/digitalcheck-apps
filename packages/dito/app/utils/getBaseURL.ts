export default function getBaseURL(request: Request) {
  const requestURL = new URL(request.url);
  return requestURL.origin.replace(
    "http://",
    process.env.NODE_ENV === "production" ? "https://" : "http://",
  );
}
