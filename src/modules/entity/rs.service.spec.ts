import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RsService } from './rs.service';
import { DatabaseService } from '@riversidefm/database';

describe('RsService', () => {
  let service: RsService;
  let mockDatabaseService: any;

  const mockEntity = {
    id: 'test-id-123',
    name: 'Test Entity',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockDatabaseService = {
      rss: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<RsService>(RsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return entity when found', async () => {
      // Arrange
      mockDatabaseService.rss.findUnique.mockResolvedValue(mockEntity);

      // Act
      const result = await service.findById('test-id-123');

      // Assert
      expect(result).toEqual(mockEntity);
      expect(mockDatabaseService.rss.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
      });
    });

    it('should throw NotFoundException when entity not found', async () => {
      // Arrange
      mockDatabaseService.rss.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.rss.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  describe('count', () => {
    it('should return total count without filter', async () => {
      // Arrange
      mockDatabaseService.rss.count.mockResolvedValue(5);

      // Act
      const result = await service.count();

      // Assert
      expect(result).toBe(5);
      expect(mockDatabaseService.rss.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should return filtered count with search term', async () => {
      // Arrange
      const filter = { search: 'test' };
      mockDatabaseService.rss.count.mockResolvedValue(2);

      // Act
      const result = await service.count(filter);

      // Assert
      expect(result).toBe(2);
      expect(mockDatabaseService.rss.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
      });
    });
  });

  describe('findMany', () => {
    it('should return paginated entities', async () => {
      // Arrange
      const entities = [mockEntity];
      mockDatabaseService.rss.findMany.mockResolvedValue(entities);

      // Act
      const result = await service.findMany({
        limit: 10,
        offset: 0,
      });

      // Assert
      expect(result).toEqual({
        items: entities,
        totalCount: 1,
      });
      expect(mockDatabaseService.rss.findMany).toHaveBeenCalledWith({
        where: {},
        take: 10,
        skip: 0,
        orderBy: undefined,
      });
    });
  });

  describe('update', () => {
    it('should update entity and return id', async () => {
      // Arrange
      const updateInput = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, name: 'Updated Name' };
      mockDatabaseService.rss.update.mockResolvedValue(updatedEntity);

      // Act
      const result = await service.update('test-id-123', updateInput);

      // Assert
      expect(result).toBe('test-id-123');
      expect(mockDatabaseService.rss.update).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
        data: { name: 'Updated Name' },
      });
    });

    it('should throw NotFoundException when entity not found', async () => {
      // Arrange
      const updateInput = { name: 'Updated Name' };
      mockDatabaseService.rss.update.mockRejectedValue(new Error('Record not found'));

      // Act & Assert
      await expect(service.update('nonexistent', updateInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove entity successfully', async () => {
      // Arrange
      mockDatabaseService.rss.delete.mockResolvedValue(mockEntity);

      // Act
      await service.remove('test-id-123');

      // Assert
      expect(mockDatabaseService.rss.delete).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
      });
    });

    it('should throw NotFoundException when entity not found', async () => {
      // Arrange
      mockDatabaseService.rss.delete.mockRejectedValue(new Error('Record not found'));

      // Act & Assert
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
