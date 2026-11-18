import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Absence } from '../models/absence.entity';
import { MissedTopic } from '../models/missed-topic.entity';
import { CreateAbsenceDto } from '../dto/create-absence.dto';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(Absence)
    private readonly absenceRepo: Repository<Absence>,
    @InjectRepository(MissedTopic)
    private readonly missedTopicRepo: Repository<MissedTopic>,
  ) {}

  async recordAbsence(dto: CreateAbsenceDto): Promise<Absence> {
    const absence = this.absenceRepo.create({
      studentId: dto.studentId,
      date: dto.date,
      reason: dto.reason,
      notes: dto.notes,
      verified: true,
    });

    const savedAbsence = await this.absenceRepo.save(absence);

    if (dto.topicIds && dto.topicIds.length > 0) {
      const missedRecords = dto.topicIds.map((tid) =>
        this.missedTopicRepo.create({
          absenceId: savedAbsence.id,
          topicId: tid,
        }),
      );
      await this.missedTopicRepo.save(missedRecords);
    }

    return this.absenceRepo.findOne({
      where: { id: savedAbsence.id },
      relations: ['missedTopics', 'missedTopics.topic'],
    });
  }

  async getStudentAbsences(studentId: string): Promise<Absence[]> {
    return this.absenceRepo.find({
      where: { studentId },
      relations: ['missedTopics', 'missedTopics.topic'],
      order: { date: 'DESC' },
    });
  }

  async getLearningGaps(studentId: string) {
    const absences = await this.getStudentAbsences(studentId);
    const gapsMap = new Map<string, any>();

    for (const abs of absences) {
      for (const mt of abs.missedTopics || []) {
        if (!gapsMap.has(mt.topicId)) {
          gapsMap.set(mt.topicId, {
            topicId: mt.topicId,
            topicName: mt.topic?.name || 'Class Topic',
            subject: mt.topic?.subject?.name || 'General',
            absenceDates: [abs.date],
            reasons: [abs.reason],
            frequency: 1,
            severity: abs.reason === 'flood' ? 'high' : 'medium',
          });
        } else {
          const gap = gapsMap.get(mt.topicId);
          gap.frequency += 1;
          gap.absenceDates.push(abs.date);
          if (gap.frequency >= 2) gap.severity = 'high';
        }
      }
    }

    return Array.from(gapsMap.values());
  }

  async deleteAbsence(id: string): Promise<void> {
    const absence = await this.absenceRepo.findOne({ where: { id } });
    if (!absence) throw new NotFoundException('Absence record not found');
    await this.absenceRepo.remove(absence);
  }
}
