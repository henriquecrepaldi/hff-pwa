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
  const auth = request.headers.get("authorization") || "";

  const invalid = () =>
    new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted", charset="UTF-8"' },
    });

  if (!auth.startsWith("Basic ")) return invalid();

  const decoded = atob(auth.slice("Basic ".length));
  const sep = decoded.indexOf(":");
  if (sep === -1) return invalid();

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  if (CREDENTIALS[user] !== pass) return invalid();

  return context.next();
};
