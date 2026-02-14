"use server";

import { createServerClientComponent } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * TOOLS ACTIONS
 */

export async function createToolAction(name: string, description?: string, category?: string, url?: string, pricing_type?: string) {
    const supabase = await createServerClientComponent();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        console.error("Auth User Error:", userError);
        throw new Error("Unauthorized");
    }
    const user = userData.user;

    const { data, error } = await supabase
        .from("tools")
        .insert([{
            user_id: user.id,
            name,
            description,
            category,
            url,
            pricing_type
        }])
        .select()
        .single();

    if (error) {
        console.error("Supabase Create Tool Error:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/tools");
    return data;
}

export async function deleteToolAction(id: string) {
    const supabase = await createServerClientComponent();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        throw new Error("Unauthorized");
    }
    const user = userData.user;

    const { error } = await supabase
        .from("tools")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Security: ensure user owns the tool

    if (error) {
        console.error("Supabase Delete Tool Error:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/tools");
}

/**
 * WORKFLOW ACTIONS
 */

export async function createWorkflowAction(formData: any) {
    const supabase = await createServerClientComponent();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        throw new Error("Unauthorized");
    }
    const user = userData.user;

    const { data, error } = await supabase
        .from("workflows")
        .insert([{
            ...formData,
            user_id: user.id
        }])
        .select()
        .single();

    if (error) {
        console.error("Supabase Create Workflow Error:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/workflows");
    return data;
}

export async function updateWorkflowAction(id: string, formData: any) {
    const supabase = await createServerClientComponent();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        throw new Error("Unauthorized");
    }
    const user = userData.user;

    const { data, error } = await supabase
        .from("workflows")
        .update(formData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        console.error("Supabase Update Workflow Error:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/workflows");
    revalidatePath(`/workflows/${id}/edit`);
    return data;
}

export async function deleteWorkflowAction(id: string) {
    const supabase = await createServerClientComponent();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        throw new Error("Unauthorized");
    }
    const user = userData.user;

    const { error } = await supabase
        .from("workflows")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Supabase Delete Workflow Error:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/workflows");
}

/**
 * AUTH ACTIONS
 */

export async function signOutAction() {
    const supabase = await createServerClientComponent();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
}

export async function updateProfileAction(fullName: string) {
    const supabase = await createServerClientComponent();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
        throw new Error("Unauthorized");
    }
    const user = userData.user;

    const { error } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", user.id);

    if (error) {
        console.error("Supabase Update Profile Error:", error);
        throw new Error(error.message);
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard");
}
