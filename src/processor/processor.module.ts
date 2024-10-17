import { Module } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ProcessorService],
  exports: [ProcessorService],
})
export class ProcessorModule {}
