import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from './github/github.module';
import { SupabaseModule } from './supabase/supabase.module';
import { GoodFirstIssuesModule } from './good-first-issues/good-first-issues.module';
import configuration from './config/configurations';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
