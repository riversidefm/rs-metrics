import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import {
  PaginationInput,
  SortInput,
  Rs,
  RsConnection,
  RsCreateInput,
  RsFilterInput,
  RsPaginatedResult,
  RsUpdateInput,
} from '../../generated/graphql';
import { DatabaseService } from '@riversidefm/database';
import { RsService } from './rs.service';
import { CustomLoggerService } from '@riversidefm/logger';
import {
  AuthenticatedContext,
  createPaginatedEntity,
  PaginationConfig,
  QueryArgs,
  QueryResult,
} from '@riversidefm/graphql';

@Resolver('Rs')
export class RsResolver {
  private readonly paginationConfig: PaginationConfig = {
    defaultLimit: 10,
    maxLimit: 50,
    allowCursor: true,
    allowOffset: true,
  };

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly rssService: RsService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Query()
  async rs(
    @Args('id') id: string,
    @Context() context: AuthenticatedContext,
  ): Promise<Rs | null> {
    return this.databaseService.rss.findUnique({
      where: { id },
    });
  }

  createRsPaginationSetup() {
    return createPaginatedEntity('Rs', this.rssService, {
      includeOffset: true,
      config: this.paginationConfig,
    });
  }

  @Query()
  async rss(
    @Args('paginationParams') paginationParams: PaginationInput,
    @Args('sort') sort: SortInput,
    @Args('filter') filter: RsFilterInput,
    @Context() context: AuthenticatedContext,
  ): Promise<RsConnection> {
    const paginatedEntity = this.createRsPaginationSetup();
    const args: QueryArgs = {
      limit: paginationParams.limit!,
      offset: paginationParams.offset!,
      sort,
      filter,
    };
    return paginatedEntity.service.findMany(args);
  }

  @Query()
  async rssPaginated(
    @Args('limit') limit: number,
    @Args('offset') offset: number,
    @Args('sort') sort: SortInput,
    @Args('filter') filter: RsFilterInput,
    @Context() context: AuthenticatedContext,
  ): Promise<RsPaginatedResult> {
    this.logger.verbose({
      message: 'getRsrs :: PAGINATION-INPUT',
      limit,
      offset,
      sort,
      filter,
    });

    const result: QueryResult<Rs> = await this.rssService.findMany({
      limit,
      offset,
      sort,
      filter,
    });

    const totalCount = await this.rssService.count(filter);
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: result.items,
      totalCount,
      hasNextPage: offset + limit < totalCount,
      hasPreviousPage: offset > 0,
      currentPage,
      totalPages,
    };
  }

  @Mutation()
  async createRs(
    @Args('dataInput') dataInput: RsCreateInput,
    @Context() context: AuthenticatedContext,
  ): Promise<string> {
    const rs = await this.rssService.create(dataInput);
    return rs.id;
  }

  @Mutation()
  async updateRs(
    @Args('id') id: string,
    @Args('dataInput') dataInput: RsUpdateInput,
    @Context() context: AuthenticatedContext,
  ): Promise<string> {
    return await this.rssService.update(id, dataInput);
  }
}
