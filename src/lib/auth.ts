import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("ac3d_auth")?.value ?? "alex";
}
