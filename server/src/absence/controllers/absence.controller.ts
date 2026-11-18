import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AbsenceService } from '../services/absence.service';
import { CreateAbsenceDto } from '../dto/create-absence.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('absences')
@UseGuards(JwtAuthGuard)
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  async recordAbsence(@Body() dto: CreateAbsenceDto) {
    return this.absenceService.recordAbsence(dto);
  }

  @Get('student/:studentId')
  async getStudentAbsences(@Param('studentId') studentId: string) {
    return this.absenceService.getStudentAbsences(studentId);
  }

  @Get('gaps/:studentId')
  async getLearningGaps(@Param('studentId') studentId: string) {
    return this.absenceService.getLearningGaps(studentId);
  }

  @Delete(':id')
  async deleteAbsence(@Param('id') id: string) {
    await this.absenceService.deleteAbsence(id);
    return { message: 'Absence record deleted successfully' };
  }
}
