"use client";

import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/ui/icons/google-icon";
import { useToast } from "@/components/ui/use-toast";
// import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const [clickedGoogle, setClickedGoogle] = useState(false);
  // const [clickedGithub, setClickedGithub] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams?.get("error");
    error &&
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <Button
        loading={clickedGoogle}
        // disabled={clickedGithub}
        size="xl"
        onClick={() => {
          setClickedGoogle(true);
          void signIn("google", {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        icon={<GoogleIcon className="h-4 w-4" />}
      >
        Continue with Google
      </Button>
      {/* <Button
        loading={clickedGithub}
        disabled={clickedGoogle}
        size="xl"
        onClick={() => {
          setClickedGithub(true);
          void signIn("github", {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        icon={<GithubIcon className="h-4 w-4" />}
      >
        Continue with GitHub
      </Button> */}
      <p className="text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup">
          <strong>Sign up.</strong>
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
