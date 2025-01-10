import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './github/github.module';
import { SupabaseModule } from './supabase/supabase.module';
import { GoodFirstIssuesModule } from './good-first-issues/good-first-issues.module';
import { GithubController } from './github/github.controller';
import configuration from './config/configurations';
import { GoodFirstIssuesController } from './good-first-issues/good-first-issues.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    GithubModule,
    SupabaseModule,
    GoodFirstIssuesModule,
  ],
  controllers: [],
})
export class AppModule { }
