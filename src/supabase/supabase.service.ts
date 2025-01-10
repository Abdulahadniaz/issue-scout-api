/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { GoodFirstIssue } from 'src/good-first-issues/interfaces/good-first-issue.interface';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            this.configService.get('supabase.url') as string,
            this.configService.get('supabase.key') as string,
        );
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }

    async insertGoodFirstIssue(gfi: GoodFirstIssue[]): Promise<void> {
        const { data, error } = await this.supabase.from('good_first_issues').insert(gfi);
        if (error) {
            throw error;
        }

        return data;
    }
}