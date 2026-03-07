import { redirect } from "next/navigation";

export default function HostLoginPage() {
  redirect("/login?role=host");
}
