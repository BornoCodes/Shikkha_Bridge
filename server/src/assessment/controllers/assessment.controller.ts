
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';

import { AssessmentService } from '../services/assessment.service';
import { GenerateAssessmentDto } from '../dto/generate-assessment.dto';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
  constructor(
    private readonly assessmentService: AssessmentService,
  ) {}

  @Post('generate')
  async generateAssessment(
    @Request() req,
    @Body() dto: GenerateAssessmentDto,
  ) {
    return this.assessmentService.generateAssessment(
      req.user.id,
      dto,
    );
  }

  @Post('submit')
  async submitAssessment(
    @Request() req,
    @Body() dto: SubmitAssessmentDto,
  ) {
    return this.assessmentService.submitAssessment(
      dto,
      req.user.id,
    );
  }

  @Get('student/:studentId')
  async getStudentAssessments(
    @Request() req,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    if (req.user.id !== studentId) {
      studentId = req.user.id;
    }

    return this.assessmentService.getStudentAssessments(
      studentId,
    );
  }

  @Get(':id')
  async getAssessmentById(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.assessmentService.getAssessmentById(
      id,
      req.user.id,
    );
  }
}
