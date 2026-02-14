import { createServerClientComponent } from "@/lib/supabase/server";
import { getTools } from "@/lib/db";
import ToolsPageImpl from "./page-impl";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
    const supabase = await createServerClientComponent();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const tools = await getTools(user.id);

    return <ToolsPageImpl initialTools={tools || []} />;
}
