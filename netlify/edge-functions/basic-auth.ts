import { Context } from "https://edge.netlify.com/";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Ignorar caminhos internos do Netlify
  if (path.startsWith("/.netlify/") || path.startsWith("/_netlify/")) {
    return context.next();
  }

  const authHeader = request.headers.get("Authorization");
  const user = Deno.env.get("BASIC_AUTH_USER");
  const pass = Deno.env.get("BASIC_AUTH_PASS");

  if (!user || !pass) {
    console.warn(
      "Variáveis BASIC_AUTH_USER e BASIC_AUTH_PASS não definidas. Acesso permitido sem autenticação."
    );
    return context.next();
  }

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");

  if (username !== user || password !== pass) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  return context.next();
};
