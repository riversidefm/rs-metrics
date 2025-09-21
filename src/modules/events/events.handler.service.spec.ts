import { Test, TestingModule } from '@nestjs/testing';
import { EventsHandlerService } from './events.handler.service';
import * as rsproto from '@riversidefm/protos';

describe('EventsHandlerService', () => {
  let service: EventsHandlerService;

  // Helper to create mock CloudEvent
  const createMockEvent = (data: any): rsproto.CloudEvent => ({
    id: 'test-event-123',
    source: 'test-source',
    type: 'test-type',
    specversion: '1.0',
    time: new Date().toISOString(),
    data,
    clientId: 'test-client',
    sessionId: 'test-session',
    archiveId: 'test-archive',
    attributes: {},
  } as unknown as rsproto.CloudEvent);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsHandlerService],
    }).compile();

    service = module.get<EventsHandlerService>(EventsHandlerService);

    // Mock console.log to avoid test output
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleEvent', () => {
    it('should process CloudEvent successfully', async () => {
      // Arrange
      const mockEvent = createMockEvent({
        userId: 'user-123',
        action: 'button-click',
        timestamp: Date.now(),
      });

      // Act
      await service.handleEvent(mockEvent);

      // Assert
      expect(console.log).toHaveBeenCalledWith('Event received:', mockEvent);
    });

    it('should handle events with null data', async () => {
      // Arrange
      const mockEvent = createMockEvent(null);

      // Act & Assert - Should not throw
      await expect(service.handleEvent(mockEvent)).resolves.toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Event received:', mockEvent);
    });

    it('should handle events with empty data', async () => {
      // Arrange
      const mockEvent = createMockEvent({});

      // Act
      await service.handleEvent(mockEvent);

      // Assert
      expect(console.log).toHaveBeenCalledWith('Event received:', mockEvent);
    });
  });
});
