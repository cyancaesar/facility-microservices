import { CreateWorkflowDto } from '@app/workflows';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WORKFLOWS_SERVICE } from './constants';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { Building } from './entities/building.entity';
import { lastValueFrom } from 'rxjs';
import { Outbox } from '../outbox/entities/outbox.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    // @Inject(WORKFLOWS_SERVICE) private readonly workflowsService: ClientProxy,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Building[]> {
    return this.buildingRepository.find();
  }

  async findOne(id: number): Promise<Building> {
    const building = await this.buildingRepository.findOne({ where: { id } });
    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`);
    }
    return building;
  }

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const buildingRepository = queryRunner.manager.getRepository(Building);
    const outboxRepository = queryRunner.manager.getRepository(Outbox);

    try {
      const building = buildingRepository.create({
        ...createBuildingDto,
      });
      const newBuilding = await buildingRepository.save(building);

      await outboxRepository.save({
        type: 'workflows.create',
        payload: {
          name: 'My workflow',
          buildingId: building.id,
        },
        target: WORKFLOWS_SERVICE.description,
      });

      await queryRunner.commitTransaction();

      return newBuilding;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    const building = await this.buildingRepository.preload({
      id: +id,
      ...updateBuildingDto,
    });
    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`);
    }

    return this.buildingRepository.save(building);
  }

  async remove(id: number): Promise<Building> {
    const building = await this.findOne(id);
    return this.buildingRepository.remove(building);
  }

  // async createWorkflow(buildingId: number) {
  //   const workflow = await lastValueFrom(
  //     this.workflowsService.send('workflows.create', {
  //       name: 'My Workflow',
  //       buildingId,
  //     } as CreateWorkflowDto),
  //   );
  //   console.log({ workflow });
  //   return workflow;
  // }
}
