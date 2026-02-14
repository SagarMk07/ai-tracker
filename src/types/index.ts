export interface Tool {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    category?: string;
    url?: string;
    pricing_type: 'free' | 'freemium' | 'paid' | 'subscription';
    created_at: string;
}

export interface Workflow {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    trigger?: string;
    actions: WorkflowAction[];
    created_at: string;
}

export interface WorkflowAction {
    type: string;
    description: string;
}

export interface AILog {
    id: string;
    user_id: string;
    prompt: string;
    response?: string;
    tokens_used?: number;
    model_used?: string;
    timestamp: string;
}

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}
