import { Context } from "https://edge.netlify.com/";

const CREDENTIALS: Record<string, string> = {
  tester1: "senha1",
  tester2: "senha2",
  tester3: "senha3",
  tester4: "senha4",
  tester5: "senha5",
  tester6: "senha6",
  tester7: "senha7",
  tester8: "senha8",
  tester9: "senha9",
  tester10: "senha10",
};

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith("/.netlify/") || path.startsWith("/_netlify/")) {
    return context.next();
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");

  if (!username || !password || CREDENTIALS[username] !== password) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  return context.next();
};
