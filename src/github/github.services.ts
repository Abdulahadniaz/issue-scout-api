import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class GithubService {
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
}