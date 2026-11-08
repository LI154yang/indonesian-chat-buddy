import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { setMistakeOwner, syncMistakesFromCloud } from "@/lib/mistakes";
import { saveLocalProfile, useLocalProfile } from "@/lib/local-profile";

export function AccountButton() {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const profile = useLocalProfile();
  const [name, setName] = useState(profile.name);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => { setName(profile.name); }, [profile.name, open]);

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
    navigate({ to: "/", replace: true });
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} title="本机学习档案">
        <UserRound />{profile.name || "本机档案"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>本机学习档案</DialogTitle>
            <DialogDescription>昵称和访客学习记录保存在这台设备的浏览器中，不需要注册或密码。</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="local-profile-name">学习昵称</Label>
            <Input id="local-profile-name" value={name} maxLength={40} onChange={event => setName(event.target.value)} />
          </div>
          <p className="text-sm text-muted-foreground">清理浏览器数据后，本机记录可能无法恢复。</p>
          {email ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">已登录：{email}</p>
              <Button variant="outline" onClick={signOut}><LogOut />退出账号</Button>
            </div>
          ) : (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">邮箱登录是可选的，用于账号保存；不登录也可以继续学习。</p>
              <Button variant="link" asChild className="mt-1 px-0"><Link to="/auth" onClick={() => setOpen(false)}><LogIn />可选登录 / 注册</Link></Button>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { saveLocalProfile({ ...profile, name }); setOpen(false); }}>保存昵称</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
