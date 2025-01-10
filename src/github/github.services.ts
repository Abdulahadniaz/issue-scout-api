/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import axios from 'axios';

@Injectable()
export class GithubService {
    private hasMoreRepos = true;
    private currentPage = 1;

    constructor(
        private configService: ConfigService,
        private supabaseService: SupabaseService
    ) { }

    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString()
        };
    }

    async getGoodFirstIssues() {
        try {
            const rateLimit = await axios.get(
                `${this.configService.get('GITHUB_API_BASE_URL')}/rate_limit`,
                {
                    headers: {
                        'Authorization': `token ${process.env.GITHUB_TOKEN}`
                    }
                }
            );

            const remaining = rateLimit.data.rate.remaining;
            if (remaining < 700) {
                console.log(`GitHub API rate limit too low (${remaining} remaining). Skipping this run.`);
                return null;
            }

            const { data: lastRepo } = await this.supabaseService
                .getClient()
                .from('repos')
                .select('id, full_name')
                .order('id', { ascending: false })
                .limit(1)
                .single();

            console.log(`Last processed repo: ${lastRepo ? `${lastRepo.full_name} (ID: ${lastRepo.id})` : 'None'}`);

            const response = await axios.get(
                `${this.configService.get('GITHUB_API_BASE_URL')}/search/repositories`, {
                params: {
                    q: 'stars:>500 created:2010-01-01..2030-12-31',
                    sort: 'full_name',
                    order: 'asc',
                    per_page: 100,
                    page: this.currentPage
                },
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`
                }
            });

            const repos = response.data.items;

            console.log(`Current page: ${this.currentPage}`);
            console.log(`Repos found: ${repos.length}`);
            if (repos.length > 0) {
                console.log(`First repo in batch: ${repos[0].full_name}`);
                console.log(`Last repo in batch: ${repos[repos.length - 1].full_name}`);
            }

            const filteredRepos = lastRepo
                ? repos.filter(repo => repo.full_name.toLowerCase() > lastRepo.full_name.toLowerCase())
                : repos;

            if (filteredRepos.length === 0) {
                this.currentPage++;
                return {
                    status: 'no_new_repos',
                    message: `No new repos found after ${lastRepo?.full_name || 'start'} on page ${this.currentPage - 1}`,
                    lastProcessedRepo: lastRepo?.full_name || 'None',
                    currentPage: this.currentPage - 1,
                    totalRepos: await this.getTotalReposCount(),
                    totalIssues: await this.getTotalIssuesCount()
                };
            }

            const reposToInsert = filteredRepos.map(repo => ({
                id: repo.id,
                full_name: repo.full_name,
                html_url: repo.html_url,
                stars: repo.stargazers_count,
                created_at: new Date(),
                updated_at: new Date()
            }));

            await this.supabaseService
                .getClient()
                .from('repos')
                .insert(reposToInsert);

            const issues = await Promise.all(filteredRepos.map(async (repo) => {
                let page = 1;
                let hasNextPage = true;
                let allIssues = [];

                while (hasNextPage) {
                    const currentLimit = await axios.get(
                        `${this.configService.get('GITHUB_API_BASE_URL')}/rate_limit`,
                        {
                            headers: {
                                'Authorization': `token ${process.env.GITHUB_TOKEN}`
                            }
                        }
                    );

                    if (currentLimit.data.rate.remaining < 500) {
                        console.log(`Rate limit too low during issue fetching (${currentLimit.data.rate.remaining} remaining). Pausing...`);
                        return {
                            status: 'rate_limit_pause',
                            processedRepos: reposToInsert,
                            processedIssues: allIssues,
                            currentPage: this.currentPage
                        };
                    }

                    const issuesResponse = await axios.get(
                        `${this.configService.get('GITHUB_API_BASE_URL')}/repos/${repo.full_name}/issues`,
                        {
                            params: {
                                state: 'open',
                                labels: 'good first issue',
                                page: page,
                                per_page: 100
                            },
                            headers: {
                                'Accept': 'application/vnd.github.v3+json',
                                'Authorization': `token ${process.env.GITHUB_TOKEN}`
                            }
                        }
                    );

                    const issues = issuesResponse.data;
                    allIssues = [...allIssues, ...issues];

                    hasNextPage = issues.length === 100;
                    page++;

                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                return allIssues.map(issue => ({
                    id: issue.id,
                    repo_id: repo.id,
                    title: issue.title,
                    html_url: issue.html_url,
                    body: issue.body,
                    created_at: new Date(),
                    updated_at: new Date()
                }));
            }));

            const flattenedIssues = issues.flat();
            if (flattenedIssues.length > 0) {
                await this.supabaseService
                    .getClient()
                    .from('good_first_issues')
                    .insert(flattenedIssues);
            }

            this.currentPage++;

            return {
                status: 'success',
                page: this.currentPage - 1,
                newReposCount: filteredRepos.length,
                newIssuesCount: flattenedIssues.length,
                repos: reposToInsert,
                issues: flattenedIssues,
                totalRepos: await this.getTotalReposCount(),
                totalIssues: await this.getTotalIssuesCount()
            };
        } catch (error) {
            if (error.response?.status === 403 && error.response?.data?.message?.includes('rate limit')) {
                console.log('Rate limit exceeded. Waiting for reset...');
                return null;
            }
            throw error;
        }
    }

    private async getTotalReposCount(): Promise<number> {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('repos')
            .select('*', { count: 'exact', head: true });
        if (error) throw error;
        return data?.length ?? 0;
    }

    private async getTotalIssuesCount(): Promise<number> {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('good_first_issues')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return data?.length ?? 0;
    }
}
