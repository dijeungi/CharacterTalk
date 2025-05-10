import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("auth_token")?.value;

  if (!token) redirect("/auth/login");

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
