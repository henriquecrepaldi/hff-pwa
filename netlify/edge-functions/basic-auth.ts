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

export default async (request: Request, context: any) => {
  const auth = request.headers.get("authorization") || "";

  const expectedUser = "SEU_USER";
  const expectedPass = "SUA_SENHA";

  const invalid = () =>
    new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Restricted", charset="UTF-8"',
      },
    });

  if (!auth.startsWith("Basic ")) return invalid();

  const decoded = atob(auth.replace("Basic ", ""));
  const [user, pass] = decoded.split(":");

  if (user !== expectedUser || pass !== expectedPass) return invalid();

  // ✅ senha OK: NÃO redireciona. Apenas continua.
  return context.next();
};
};
