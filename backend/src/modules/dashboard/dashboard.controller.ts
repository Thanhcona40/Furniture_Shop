import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(): Promise<DashboardSummaryDto> {
    return this.dashboardService.getSummary();
  }

  @Get('chart-data')
  async getChartData() {
    return this.dashboardService.getChartData();
  }
} 