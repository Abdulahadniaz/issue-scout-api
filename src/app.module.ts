/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './github/github.module';
import { SupabaseModule } from './supabase/supabase.module';
import { GoodFirstIssuesModule } from './good-first-issues/good-first-issues.module';
import configuration from './config/configurations';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    GithubModule,
    SupabaseModule,
    GoodFirstIssuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
