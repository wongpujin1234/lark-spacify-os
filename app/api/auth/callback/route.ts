// app/api/auth/callback/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  // 1. Get tenant access token
  const tokenRes = await fetch(
    "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: process.env.LARK_APP_ID,
        app_secret: process.env.LARK_APP_SECRET,
      }),
    }
  );
  const tokenData = await tokenRes.json();
  const appToken = tokenData.tenant_access_token;

  // 2. Exchange code for user access token
  const userTokenRes = await fetch(
    "https://open.larksuite.com/open-apis/authen/v1/oidc/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appToken}`,
      },
      body: JSON.stringify({ grant_type: "authorization_code", code }),
    }
  );
  const userTokenData = await userTokenRes.json();
  const userAccessToken = userTokenData.data?.access_token;

  if (!userAccessToken) {
    return new Response(JSON.stringify(userTokenData), { status: 401 });
  }

  // 3. Fetch user info
  const userInfoRes = await fetch(
    "https://open.larksuite.com/open-apis/authen/v1/user_info",
    {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    }
  );
  const userInfo = await userInfoRes.json();
  const user = userInfo.data;

  // 4. Redirect to welcome page
  const params = new URLSearchParams({
    name: user?.name || "",
    en_name: user?.en_name || "",
    user_id: user?.user_id || "",
    open_id: user?.open_id || "",
    employee_id: user?.employee_no || "",
    email: user?.email || "",
    avatar: user?.avatar_url || "",
  });

  const baseUrl = process.env.REDIRECT_URI?.replace("/api/auth/callback", "");
  return Response.redirect(`${baseUrl}/welcome?${params}`);
}