import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { StateService } from './state.service';
import { StateEntity } from './entities/state.entity';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async getAllStates(): Promise<StateEntity[]> {
    return this.stateService.getAllStates();
  }
}
