import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '@riversidefm/database';
import { CustomLoggerService } from '@riversidefm/logger';
import { RsResolver } from './rs.resolver';
import { RsService } from './rs.service';

describe('RsResolver', () => {
  let resolver: RsResolver;
  let mockDatabaseService: any;
  let mockEntityService: any;

  const mockEntity = {
    id: 'test-id-123',
    name: 'Test Entity',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContext = {
    user: { id: 'user-123', email: 'test@example.com' },
    requestId: 'req-123',
    req: {} as any,
    res: {} as any,
  };

  beforeEach(async () => {
    mockEntityService = {
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    mockDatabaseService = {
      rss: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const mockLogger = {
      verbose: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RsResolver,
        {
          provide: RsService,
          useValue: mockEntityService,
        },
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: CustomLoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    resolver = module.get<RsResolver>(RsResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('rs', () => {
    it('should return entity by id', async () => {
      // Arrange
      mockDatabaseService.rss.findUnique.mockResolvedValue(mockEntity);

      // Act
      const result = await resolver.rs('test-id-123', mockContext);

      // Assert
      expect(result).toEqual(mockEntity);
      expect(mockDatabaseService.rss.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
      });
    });

    it('should return null when entity not found', async () => {
      // Arrange
      mockDatabaseService.rss.findUnique.mockResolvedValue(null);

      // Act
      const result = await resolver.rs('nonexistent', mockContext);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('rssPaginated', () => {
    it('should return paginated results', async () => {
      // Arrange
      const mockQueryResult = { items: [mockEntity], totalCount: 1 };
      mockEntityService.findMany.mockResolvedValue(mockQueryResult);
      mockEntityService.count.mockResolvedValue(1);

      // Act
      const result = await resolver.rssPaginated(
        10,
        0,
        { field: 'name', direction: 'ASC' },
        {},
        mockContext,
      );

      // Assert
      expect(result).toEqual({
        items: [mockEntity],
        totalCount: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
        totalPages: 1,
      });
      expect(mockEntityService.findMany).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        sort: { field: 'name', direction: 'ASC' },
        filter: {},
      });
    });
  });

  describe('createRs', () => {
    it('should create new entity and return id', async () => {
      // Arrange
      const createInput = {
        name: 'New Entity',
        description: 'New Description',
      };
      const newEntity = { ...mockEntity, id: 'new-id-456', ...createInput };
      mockEntityService.create.mockResolvedValue(newEntity);

      // Act
      const result = await resolver.createRs(createInput, mockContext);

      // Assert
      expect(result).toBe('new-id-456');
      expect(mockEntityService.create).toHaveBeenCalledWith(createInput);
    });
  });

  describe('updateRs', () => {
    it('should update entity and return id', async () => {
      // Arrange
      const updateInput = { name: 'Updated Name' };
      mockEntityService.update.mockResolvedValue('test-id-123');

      // Act
      const result = await resolver.updateRs(
        'test-id-123',
        updateInput,
        mockContext,
      );

      // Assert
      expect(result).toBe('test-id-123');
      expect(mockEntityService.update).toHaveBeenCalledWith(
        'test-id-123',
        updateInput,
      );
    });
  });
});
