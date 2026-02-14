import { Button } from "@/components/ui/button";
import { createServerClientComponent } from "@/lib/supabase/server";
import { Settings as SettingsIcon, Bell, Shield, User as UserIcon, ArrowLeft, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { LogoutButton } from "@/components/dashboard/logout-button";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const supabase = await createServerClientComponent();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch public user profile
    const { data: profile } = user ? await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single() : { data: null };

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
                            <SettingsIcon className="w-8 h-8 text-slate-400" />
                            Settings
                        </h1>
                        <p className="text-slate-400 mt-1">Manage your account and preferences.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start text-blue-400 bg-blue-500/10 rounded-xl">
                            <UserIcon className="w-4 h-4 mr-3" /> Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white rounded-xl py-6">
                            <Bell className="w-4 h-4 mr-3" /> Notifications
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white rounded-xl py-6">
                            <Shield className="w-4 h-4 mr-3" /> Security
                        </Button>
                        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-3 px-4">
                            <LogoutButton />
                            <span className="text-sm font-medium text-slate-400">Sign Out</span>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-medium text-white mb-2">Profile Information</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-2">
                                    <label className="text-sm font-medium text-slate-400">Email Address</label>
                                    <Input
                                        disabled
                                        value={user?.email || ""}
                                        className="bg-slate-950 border-slate-800 text-slate-500 rounded-xl py-6"
                                    />
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold ml-1">Account authentication primary</p>
                                </div>

                                <ProfileForm initialData={{ full_name: profile?.full_name || "" }} />
                            </div>
                        </section>

                        {/* Integration Section */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-medium text-white">AI Integrations</h2>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-tighter rounded-full border border-green-500/20">System Stable</span>
                            </div>

                            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                        <Bot className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">OpenAI Intelligence</p>
                                        <p className="text-xs text-slate-500">Connected to gpt-4o, gpt-4-turbo</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-full border-slate-700 text-slate-400 group-hover:text-white group-hover:border-slate-600">
                                    Refresh API
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
