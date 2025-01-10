import { Controller, Get, Param } from '@nestjs/common';
import { GoodFirstIssuesService } from './good-first-issues.service';
import { GoodFirstIssue } from './interfaces/good-first-issue.interface';

@Controller('good-first-issues')
export class GoodFirstIssuesController {
    constructor(
        private readonly goodFirstIssuesService: GoodFirstIssuesService,
    ) { }

    @Get()
    async findAll(): Promise<GoodFirstIssue[]> {
        return await this.goodFirstIssuesService.findAll();
    }
}