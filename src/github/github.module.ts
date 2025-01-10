/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GithubService } from './github.services';
import { GithubController } from './github.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule, SupabaseModule],
  providers: [GithubService],
  controllers: [GithubController],
  exports: [GithubService],
})
export class GithubModule { }
