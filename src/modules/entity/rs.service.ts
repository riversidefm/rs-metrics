import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from '@riversidefm/database';
import { PaginatedService, QueryResult } from '@riversidefm/graphql';
import {
  Rs,
  RsFilterInput,
  RsCreateInput,
  RsUpdateInput,
} from '../../generated/graphql';
import { toPrismaUpdateInput } from './dto/update.input.helpers';

@Injectable()
export class RsService implements PaginatedService<Rs, RsFilterInput> {
  private readonly logger = new Logger(RsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  // Additional methods for specific queries
  async findById(id: string): Promise<Rs | null> {
    this.logger.debug(`Entering findOne method with id: ${id}`);

    const entity = await this.databaseService.rss.findUnique({
      where: { id },
    });

    if (!entity) {
      this.logger.warn(`Rss not found with id: ${id}`);
      throw new NotFoundException(`Rss with ID ${id} not found`);
    }

    this.logger.log(`Rss found: ${entity.name} (${id})`);
    this.logger.debug(`Exiting findOne method with id: ${id}`);
    return {
      ...entity,
    };
  }

  async count(filter?: RsFilterInput): Promise<number> {
    const where = filter?.search
       ? {
         OR: [
           {
             name: {
               contains: filter.search,
               mode: 'insensitive' as const,
             },
           },
           {
             description: {
               contains: filter.search,
               mode: 'insensitive' as const,
             },
           },
         ],
       }
       : {};

    return this.databaseService.rss.count({ where: where });
  }

  async findMany(args: {
    limit: number;
    offset: number;
    sort?: { field: string; direction: 'ASC' | 'DESC' };
    filter?: RsFilterInput;
  }): Promise<QueryResult<Rs>> {
    let items: Rs[] = [];
    let totalCount: number = 0;

    const where = args.filter?.search
       ? {
         OR: [
           {
             name: {
               contains: args.filter.search,
               mode: 'insensitive' as const,
             },
           },
           {
             description: {
               contains: args.filter.search,
               mode: 'insensitive' as const,
             },
           },
         ],
       }
       : {};

    const queryArgs = {
      where,
      take: args.limit,
      skip: args.offset,
      orderBy: args.sort
         ? { [args.sort.field]: args.sort.direction.toLowerCase() }
         : undefined,
    };

    items = await this.databaseService.rss.findMany(queryArgs);
    totalCount = items.length;

    return {
      items,
      totalCount,
    };
  }

  async create(
    createInput: RsCreateInput,
  ): Promise<Rs> {
    try {
      const createdEntity = await this.databaseService.rss.create({
        data: createInput,
      });

      this.logger.log(
        `Entity created successfully: ${createdEntity.name} (${createdEntity.id})`,
      );
      this.logger.debug(`Exiting create method with id: ${createdEntity.id}`);

      return createdEntity;
    } catch (error) {
      this.logger.warn(`Failed to create entity: ${error}`);
      throw error;
    }
  }

  async update(id: string, updateIn: RsUpdateInput): Promise<string> {
    const updateObj: Record<string, any> =
       toPrismaUpdateInput<RsUpdateInput>(updateIn);
    try {
      const updatedEntity = await this.databaseService.rss.update({
        where: { id },
        data: updateObj,
      });

      this.logger.log(
         `Entities updated successfully: ${updatedEntity.name} (${id})`,
      );
      this.logger.debug(`Exiting update method with id: ${id}`);

      return id;
    } catch {
      this.logger.warn(`Entities not found for update with id: ${id}`);
      throw new NotFoundException(`Entities with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const entity = await this.databaseService.rss.delete({
        where: { id },
      });

      this.logger.log(`Entities removed successfully: ${entity.name} (${id})`);
      this.logger.debug(`Exiting remove method with id: ${id}`);
    } catch {
      this.logger.warn(`Entities not found for removal with id: ${id}`);
      throw new NotFoundException(`Entities with ID ${id} not found`);
    }
  }
}
