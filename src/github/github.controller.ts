import { Controller, Get } from '@nestjs/common';
import { GithubService } from './github.services';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
