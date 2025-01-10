/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GoodFirstIssue } from './interfaces/good-first-issue.interface';

@Injectable()
export class GoodFirstIssuesService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async findAll(): Promise<GoodFirstIssue[]> {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('good_first_issues')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    }

    async findByRepository(repositoryName: string): Promise<GoodFirstIssue[]> {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('good_first_issues')
            .select('*')
            .eq('repository_name', repositoryName)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    }
} 