/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GoodFirstIssuesController } from './good-first-issues.controller';
import { GoodFirstIssuesService } from './good-first-issues.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [GoodFirstIssuesController],
  providers: [GoodFirstIssuesService],
  exports: [GoodFirstIssuesService],
})
export class GoodFirstIssuesModule { } 