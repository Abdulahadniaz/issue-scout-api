import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

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
}