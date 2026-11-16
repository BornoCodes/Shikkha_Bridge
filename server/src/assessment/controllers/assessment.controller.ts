import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AssessmentService } from '../services/assessment.service';
import { GenerateAssessmentDto } from '../dto/generate-assessment.dto';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('generate')
  async generateAssessment(@Request() req, @Body() dto: GenerateAssessmentDto) {
    const studentId = req.user.id;
    return this.assessmentService.generateAssessment(studentId, dto);
  }

  @Post('submit')
  async submitAssessment(@Body() dto: SubmitAssessmentDto) {
    return this.assessmentService.submitAssessment(dto);
  }

  @Get(':id')
  async getAssessmentById(@Param('id') id: string) {
    return this.assessmentService.getAssessmentById(id);
  }

  @Get('student/:studentId')
  async getStudentAssessments(@Param('studentId') studentId: string) {
    return this.assessmentService.getStudentAssessments(studentId);
  }
}
