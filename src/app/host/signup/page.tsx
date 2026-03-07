import { redirect } from "next/navigation";

export default function HostSignupPage() {
  redirect("/signup?role=host");
}
