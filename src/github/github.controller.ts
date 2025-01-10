/* eslint-disable prettier/prettier */
import { Controller, Get, Delete } from '@nestjs/common';
import { GithubService } from './github.services';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly supabaseService: SupabaseService
  ) { }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('good-first-issues')
  async getGoodFirstIssues() {
    return this.githubService.getGoodFirstIssues();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async cronFetchGoodFirstIssues() {
    console.log(`Running cron job to fetch new repos and their good first issues at ${new Date().toLocaleString()}`);
    return this.githubService.getGoodFirstIssues();
  }

  @Delete('reset-repos')
  async resetRepos() {
    await this.supabaseService
      .getClient()
      .from('good_first_issues')
      .delete()
      .neq('id', 0);

    await this.supabaseService
      .getClient()
      .from('repos')
      .delete()
      .neq('id', 0);

    return {
      status: 'success',
      message: 'All repos and issues cleared. Next fetch will start from the beginning.'
    };
  }
}
