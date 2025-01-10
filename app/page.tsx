"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import { LoginModal } from "@/components/LoginModal";

export default function Home() {
  const { user, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);
  
  return (
    <div className="">
      Fragments UI
      <div>
        <section>
          <Button id="login" onClick={() => setShowLogin(true)}>Login</Button>
          <Button id="logout" onClick={signOut}>Logout</Button>
        </section>
        <section hidden={!user} id="user">
          <h2>
            Hello <span className="username">{user?.username}</span>!
          </h2>
        </section>
        <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
      </div>
    </div>
  );
}
