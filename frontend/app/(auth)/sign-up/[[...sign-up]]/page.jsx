import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center pt-0 pb-20">
      <SignUp />
    </div>
  );
}
