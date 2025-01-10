export interface GoodFirstIssue {
    id: number;
    title: string;
    html_url: string;
    repository_name: string;
    repository_url: string;
    created_at: Date;
    updated_at: Date;
    state: string;
    labels: string[];
} 