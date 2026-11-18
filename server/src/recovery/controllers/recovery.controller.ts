import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RecoveryService } from '../services/recovery.service';
import { ApprovePlanDto } from '../dto/approve-plan.dto';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('recovery')
@UseGuards(JwtAuthGuard)
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post('generate')
  async generatePlan(@Request() req) {
    const studentId = req.user.id;
    return this.recoveryService.generateRecoveryPlan(studentId);
  }

  @Post('generate/:studentId')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  async generatePlanForStudent(@Param('studentId') studentId: string) {
    return this.recoveryService.generateRecoveryPlan(studentId);
  }

  @Get('student/:studentId')
  async getStudentPlans(@Param('studentId') studentId: string) {
    return this.recoveryService.getStudentPlans(studentId);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  async getPendingPlans() {
    return this.recoveryService.getPendingPlans();
  }

  @Get(':id')
  async getPlanById(@Param('id') id: string) {
    return this.recoveryService.getPlanById(id);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('teacher', 'admin')
  async approvePlan(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: ApprovePlanDto,
  ) {
    const teacherId = req.user.id;
    return this.recoveryService.approvePlan(id, teacherId, dto);
  }

  @Patch('progress')
  async updateProgress(@Body() dto: UpdateProgressDto) {
    return this.recoveryService.updateItemProgress(dto);
  }
}
