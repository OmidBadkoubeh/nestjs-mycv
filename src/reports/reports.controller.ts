import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/guards';
import { CreateReportDto } from './dtos';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReport(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
