import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, Serialize } from '@src/decorators';
import { AuthGuard } from '@src/guards';
import { User } from '@src/users/user.entity';
import { CreateReportDto, ReportDto } from './dtos';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
