import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { setMistakeOwner, syncMistakesFromCloud } from "@/lib/mistakes";

export function AccountButton() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
      setMistakeOwner(data.session?.user.id ?? null);
      if (data.session) void syncMistakesFromCloud();
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setEmail(session?.user.email ?? null);
      setMistakeOwner(session?.user.id ?? null);
      if (event === "SIGNED_IN") void syncMistakesFromCloud();
    });
    return () => { data.subscription.unsubscribe(); };
  }, []);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!email) {
    return <Button variant="outline" asChild><Link to="/auth"><LogIn />登录</Link></Button>;
  }
  return (
    <Button variant="outline" onClick={signOut} title={email}><LogOut />退出</Button>
  );
}
