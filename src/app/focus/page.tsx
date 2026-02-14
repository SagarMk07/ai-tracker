import { FocusRoomImpl } from "@/components/focus/focus-room-impl";
import { createServerClientComponent } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FocusPage() {
    const supabase = await createServerClientComponent();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    return <FocusRoomImpl />;
}
