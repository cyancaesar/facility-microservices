import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WorkflowsService } from './workflows.service';

@Controller('workflows')
export class WorkflowsController {
  private readonly logger = new Logger(WorkflowsController.name);
  constructor(private readonly workflowsService: WorkflowsService) {}

  @EventPattern('workflows.create')
  create(@Payload() createWorkflowDto: CreateWorkflowDto) {
    this.logger.debug(`Received a message [workflows.create]`);
    return this.workflowsService.create(createWorkflowDto);
  }

  @Get()
  findAll() {
    return this.workflowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowsService.update(+id, updateWorkflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(+id);
  }
}
