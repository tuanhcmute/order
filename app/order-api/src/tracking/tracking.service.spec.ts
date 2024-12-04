import { MockType, repositoryMockFactory } from "src/test-utils/repository-mock.factory";
import { TrackingService } from "./tracking.service";
import { DataSource, Repository } from "typeorm";
import { Tracking } from "./tracking.entity";
import { TrackingOrderItem } from "src/tracking-order-item/tracking-order-item.entity";
import { Order } from "src/order/order.entity";
import { OrderItem } from "src/order-item/order-item.entity";
import { Table } from "src/table/table.entity";
import { Workflow } from "src/workflow/workflow.entity";
import { Mapper } from "@automapper/core";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { MAPPER_MODULE_PROVIDER } from "src/app/app.constants";
import { mapperMockFactory } from "src/test-utils/mapper-mock.factory";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { SchedulerRegistry } from "@nestjs/schedule";
import { TrackingScheduler } from "./tracking.scheduler";
import { CreateTrackingOrderItemRequestDto, CreateTrackingOrderItemWithQuantityAndOrderItemEntity } from "src/tracking-order-item/tracking-order-item.dto";
import { Variant } from "src/variant/variant.entity";
import { TrackingType, WorkflowStatus } from "./tracking.constants";
import { Branch } from "src/branch/branch.entity";
import { TrackingException } from "./tracking.exception";
import { TrackingValidation } from "./tracking.validation";
import { OrderItemException } from "src/order-item/order-item.exception";
import { TableException } from "src/table/table.exception";
import { RobotConnectorException } from "src/robot-connector/robot-connector.exception";
import { RobotConnectorValidation } from "src/robot-connector/robot-connector.validation";
import { RobotResponseDto, WorkflowExecutionResponseDto } from "src/robot-connector/robot-connector.dto";
import { RobotStatus } from "src/robot-connector/robot-connector.constants";
import { WorkflowException } from "src/workflow/workflow.exception";
import { CreateTrackingRequestDto } from "./tracking.dto";
import { OrderItemValidation } from "src/order-item/order-item.validation";
import { OrderType } from "src/order/order.contants";
import { TableValidation } from "src/table/table.validation";
import { WorkflowValidation } from "src/workflow/workflow.validation";

describe('TrackingService', () => {
  let service: TrackingService;
  let trackingRepositoryMock: MockType<Repository<Tracking>>;
  let trackingOrderItemRepositoryMock: MockType<Repository<TrackingOrderItem>>;
  let orderRepositoryMock: MockType<Repository<Order>>;
  let orderItemRepositoryMock: MockType<Repository<OrderItem>>;
  let tableRepositoryMock: MockType<Repository<Table>>;
  let workflowRepositoryMock: MockType<Repository<Workflow>>;
  let mapperMock: MockType<Mapper>;
  let schedulerRegistryMock: SchedulerRegistry;
  let robotConnectorClientMock: RobotConnectorClient;
  let trackingSchedulerMock: TrackingScheduler;


  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        RobotConnectorClient,
        SchedulerRegistry,
        TrackingScheduler,
        HttpService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SALT_ROUNDS') {
                return 10;
              }
              return null;
            }),
          },
        },
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        { 
          provide: TrackingScheduler, 
          useValue: {
            startUpdateStatusTracking: jest.fn(),
            updateStatusOrder: jest.fn(),
          } 
        },
        { 
          provide: DataSource, 
          useValue: mockDataSource 
        },
        { 
          provide: RobotConnectorClient, 
          useValue: {
            getRobotById: jest.fn(),
            runWorkflow: jest.fn()
          } 
        },
        {
          provide: getRepositoryToken(Tracking),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(TrackingOrderItem),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Order),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Table),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Workflow),
          useFactory: repositoryMockFactory,
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useFactory: mapperMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console,
        },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
    orderRepositoryMock = module.get(getRepositoryToken(Order));
    trackingRepositoryMock = module.get(getRepositoryToken(Tracking));
    trackingOrderItemRepositoryMock = module.get(
      getRepositoryToken(TrackingOrderItem),
    );
    orderItemRepositoryMock = module.get(getRepositoryToken(OrderItem));
    tableRepositoryMock = module.get(getRepositoryToken(Table));
    workflowRepositoryMock = module.get(getRepositoryToken(Workflow));
    mapperMock = module.get(MAPPER_MODULE_PROVIDER);
    schedulerRegistryMock = module.get<SchedulerRegistry>(SchedulerRegistry);
    robotConnectorClientMock = module.get<RobotConnectorClient>(RobotConnectorClient);
    trackingSchedulerMock = module.get<TrackingScheduler>(TrackingScheduler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkCurrentShipment - check any shipments are running or pending', () => {
    it('should throw exception when there are shipments running or pending', async () => {
      const tracking = {
        workflowExecution: "",
        status: "",
      } as Tracking;
      const trackings = [tracking];
      (trackingRepositoryMock.find as jest.Mock).mockResolvedValue(trackings);
      await expect(service.checkCurrentShipment()).rejects.toThrow(
        TrackingException
      );
    });
    it('should no throw exception when there are no shipments running or pending', async () => {
      (trackingRepositoryMock.find as jest.Mock).mockResolvedValue([]);
      await service.checkCurrentShipment();
      expect(trackingRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('validateDefinedAndQuantityOrderItem - validate order item about determinism and quantity', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return invalid result when order item not found', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = [createTrackingOrderItem, createTrackingOrderItem];

      (orderItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.validateDefinedAndQuantityOrderItem(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should return invalid result when have not order relate to order item', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = [createTrackingOrderItem];
      const orderItem = {
        quantity: 5,
        subtotal: 0,
        order: null,
        variant: new Variant(),
        trackingOrderItems: [],
        id: "",
        slug: "",
        createdAt: new Date(),
        updatedAt: new Date()
      } as OrderItem;

      (orderItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(orderItem);
      await expect(service.validateDefinedAndQuantityOrderItem(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should return invalid result when order item have not any tracking order item, but request quantity is greater quantity of order item', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 5
      };
      const mockInput = [createTrackingOrderItem];
      const order: Order = {
        subtotal: 0,
        status: "",
        type: "",
        id: "",
        slug: "",
        createdAt: undefined,
        updatedAt: undefined
      } as Order;
      const orderItem = {
        quantity: 2,
        subtotal: 0,
        order,
        variant: new Variant(),
        trackingOrderItems: [],
        id: "",
        slug: "",
        createdAt: new Date(),
        updatedAt: new Date()
      } as OrderItem;

      (orderItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(orderItem);
       await expect(service.validateDefinedAndQuantityOrderItem(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should return invalid result when order item have any tracking order item, but total request quantity is greater quantity of order item', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 3
      };
      const mockInput = [createTrackingOrderItem];
      const order = {
        subtotal: 0,
        status: "",
        type: "",
      } as Order;
      const tracking  = {
        workflowExecution: "",
        status: WorkflowStatus.COMPLETED,
      } as Tracking;
      const trackingOrderItem = {
        quantity: 2,
        tracking,
      } as TrackingOrderItem;
      const orderItem = {
        quantity: 5,
        order,
        trackingOrderItems: [trackingOrderItem, trackingOrderItem], // (2 + 2 + 3) > 5
      } as OrderItem;

      (orderItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(orderItem);
      await expect(service.validateDefinedAndQuantityOrderItem(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should return valid result when order item have any tracking order item', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = [createTrackingOrderItem];
      const order = {
        subtotal: 0,
        status: "",
        type: "",
      } as Order;
      const tracking  = {
        workflowExecution: "",
        status: WorkflowStatus.COMPLETED,
      } as Tracking;
      const trackingOrderItem = {
        quantity: 2,
        tracking,
      } as TrackingOrderItem;
      const orderItem = {
        quantity: 5,
        order,
        trackingOrderItems: [trackingOrderItem, trackingOrderItem], // (2 + 2 + 1) = 5
      } as OrderItem;
      const mockOutput = [{quantity: 1, orderItem}];

      (orderItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(orderItem);
      expect(await service.validateDefinedAndQuantityOrderItem(mockInput)).toEqual(mockOutput);
    });

    it('should return valid result when order item have not any tracking order item', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = [createTrackingOrderItem];
      const order = {
        subtotal: 0,
        status: "",
        type: "",
      } as Order;
      const orderItem = {
        quantity: 5,
        order,
        trackingOrderItems: [], // 1 < 5
      } as OrderItem;
      const mockOutput = [{quantity: 1, orderItem}];

      (orderItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(orderItem);
      expect(await service.validateDefinedAndQuantityOrderItem(mockInput)).toEqual(mockOutput);
    });
  });

  describe('validateOrderItemInOneOrder - check order items in a order or not', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return null when not found any order', async () => {
      const createTrackingOrderItem = {
        orderItem: "mock-order-item-slug",
        quantity: 0
      }  as CreateTrackingOrderItemRequestDto;
      const mockInput = [createTrackingOrderItem];
      
      (orderRepositoryMock.find as jest.Mock).mockResolvedValue([]);
      await expect(service.validateOrderItemInOneOrder(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should return null when found more than 1 order', async () => {
      const createTrackingOrderItem1: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug-1",
        quantity: 0
      };
      const createTrackingOrderItem2: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug-2",
        quantity: 0
      };
      const mockInput = [createTrackingOrderItem1, createTrackingOrderItem2];
      const order1 = {
        slug: 'mock-order-slug-1',
        subtotal: 0,
        status: "",
        type: "",
        orderItems: [],
      } as Order;
      const order2 = {
        slug: 'mock-order-slug-2',
        subtotal: 0,
        status: "",
        type: "",
        orderItems: [],
      } as Order;
      const orders  = [order1, order2];
      
      (orderRepositoryMock.find as jest.Mock).mockResolvedValue(orders);
      await expect(service.validateOrderItemInOneOrder(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should return null when found 1 order but have not any related branch', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 0
      };
      const mockInput = [createTrackingOrderItem, createTrackingOrderItem];
      const order = {
        slug: 'mock-order-slug',
        subtotal: 0,
        status: "",
        type: "",
        orderItems: [],
      } as Order;
      const orders  = [order];
      
      (orderRepositoryMock.find as jest.Mock).mockResolvedValue(orders);
      await expect(service.validateOrderItemInOneOrder(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should return order when validate success', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 0
      };
      const mockInput = [createTrackingOrderItem, createTrackingOrderItem];
      const branch = {
        name: "",
        address: "",
      } as Branch;
      const order = {
        slug: 'mock-order-slug',
        branch,
        subtotal: 0,
        status: "",
        type: "",
        orderItems: [],
      } as Order;
      const orders  = [order];
      
      (orderRepositoryMock.find as jest.Mock).mockResolvedValue(orders);
      expect(await service.validateOrderItemInOneOrder(mockInput)).toEqual(order);
    });
  });

  describe('getLocationTableByOrder - get location of table by order', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return null when table not found in this branch', async () => {
      const branch = {
        id: 'mock-branch-id',
        name: "",
        address: "",
      } as Branch;
      const mockInput = {
        subtotal: 0,
        status: "",
        type: "",
        tableName: 'mock-table-name',
        branch,
        orderItems: [],
      } as Order;

      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.getLocationTableByOrder(mockInput)).rejects.toThrow(TableException);
    });

    it('should return null when table does not have location', async () => {
      const branch = {
        id: 'mock-branch-id',
        name: "",
        address: "",
      } as Branch;
      const mockInput = {
        subtotal: 0,
        status: "",
        type: "",
        tableName: 'mock-table-name',
        branch,
        orderItems: [],
      } as Order;

      const table = {
        name: "",
        location: null
      } as Table;

      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(table);
      await expect(service.getLocationTableByOrder(mockInput)).rejects.toThrow(TableException);
    });

    it('should return location table', async () => {
      const branch = {
        id: 'mock-branch-id',
        name: "",
        address: "",
      } as Branch;
      const mockInput = {
        subtotal: 0,
        status: "",
        type: "",
        tableName: 'mock-table-name',
        branch,
        orderItems: [],
      } as Order;

      const table = {
        name: "",
        location: 'mock-location-table',
      } as Table;

      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(table);
      expect(await service.getLocationTableByOrder(mockInput)).toEqual(table.location);
    });
  });

  describe('createTrackingAndTrackingOrderItem - create tracking and related tracking order item',  () => {
    it('should save tracking failed', async () => {
      const tracking = {
        workflowExecution: "",
        status: "",
      } as Tracking; 
      const orderItem = {
        quantity: 0,
        subtotal: 0,
      } as OrderItem;

      const createTrackingOrderItem = {
        quantity: 0,
        orderItem
      } as CreateTrackingOrderItemWithQuantityAndOrderItemEntity;

      const orderItemsData = [createTrackingOrderItem];

      (mockQueryRunner.manager.save as jest.Mock).mockRejectedValue(
        new TrackingException(TrackingValidation.CREATE_TRACKING_FAILED)
      )

      await expect(service.createTrackingAndTrackingOrderItem(
        tracking,
        orderItemsData
      )).rejects.toThrow(TrackingException);
    });
    
    it('should save tracking order item failed', async () => {
      const tracking = {
        workflowExecution: "",
        status: "",
      } as Tracking; 
      const orderItem = {
        quantity: 0,
        subtotal: 0,
      } as OrderItem;

      const createTrackingOrderItem = {
        quantity: 0,
        orderItem
      } as CreateTrackingOrderItemWithQuantityAndOrderItemEntity;

      const orderItemsData = [createTrackingOrderItem];

      (mockQueryRunner.manager.save as jest.Mock).mockImplementationOnce(() => tracking);
      (mockQueryRunner.manager.save as jest.Mock).mockRejectedValueOnce(
        new TrackingException(TrackingValidation.CREATE_TRACKING_FAILED)
      )

      await expect(service.createTrackingAndTrackingOrderItem(
        tracking,
        orderItemsData
      )).rejects.toThrow(TrackingException);
    });

    it('should create tracking and related tracking order item success', async () => {
      const tracking = {
        workflowExecution: "",
        status: "",
        id: 'mock-tracking-id'
      } as Tracking; 
      const orderItem = {
        quantity: 0,
        subtotal: 0,
      } as OrderItem;

      const createTrackingOrderItem = {
        quantity: 0,
        orderItem
      } as CreateTrackingOrderItemWithQuantityAndOrderItemEntity;

      const orderItemsData = [createTrackingOrderItem];
      const trackingOrderItem = {
        quantity: 0,
        orderItem: new OrderItem(),
        tracking: new Tracking(),
      } as TrackingOrderItem;
      const trackingOrderItems = [trackingOrderItem];

      (mockQueryRunner.manager.save as jest.Mock).mockImplementationOnce(() => tracking);
      (mockQueryRunner.manager.save as jest.Mock).mockImplementationOnce(
        () => trackingOrderItems
      );

      expect(await service.createTrackingAndTrackingOrderItem(
        tracking,
        orderItemsData
      )).toEqual(tracking.id);
    });
  });

  describe('checkRobotStatusBeforeCall - check status robot from ROBOT API', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw exception when  robotConnectorClient.getRobotById throws', async () => {
      (robotConnectorClientMock.getRobotById as jest.Mock).mockRejectedValue(
        new RobotConnectorException(RobotConnectorValidation.GET_ROBOT_DATA_FAILED)
      );

      await expect(service.checkRobotStatusBeforeCall()).rejects.toThrow(RobotConnectorException);
    });
    it('should throw exception when robot busy', async () => {
      const robotData = {
        status: "mock-order-status"
      } as RobotResponseDto;
      (robotConnectorClientMock.getRobotById as jest.Mock).mockResolvedValue(
        robotData
      );

      await expect(service.checkRobotStatusBeforeCall()).rejects.toThrow(RobotConnectorException);
    });

    it('should not throw exception when robot idle', async () => {
      const robotData = {
        status: RobotStatus.IDLE
      } as RobotResponseDto;
      (robotConnectorClientMock.getRobotById as jest.Mock).mockResolvedValue(
        robotData
      );

      await service.checkRobotStatusBeforeCall();
      expect(robotConnectorClientMock.getRobotById).toHaveBeenCalled();
    });
  });

  describe('getWorkflowIdByOrder - get workflow id by order', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw exception when workflow not found', async () => {
      const branch = {
        name: "",
        address: "",
        id: "",
        slug: "mock-branch-slug",
      } as Branch;
      const mockInput = {
        branch,
        subtotal: 0,
        status: "",
        type: "",
        id: "",
        slug: "mock-order-slug",
      } as Order;
      (workflowRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getWorkflowIdByOrder(mockInput)).rejects.toThrow(WorkflowException);
    });

    it('should return workflow id when get success', async () => {
      const branch = {
        name: "",
        address: "",
        id: "",
        slug: "mock-branch-slug",
      } as Branch;
      const mockInput = {
        branch,
        subtotal: 0,
        status: "",
        type: "",
        id: "",
        slug: "mock-order-slug",
      } as Order;
      const workflow = {
        workflowId: "mock-workflow-id",
        id: "",
        slug: "",
      } as Workflow;
      (workflowRepositoryMock.findOne as jest.Mock).mockResolvedValue(workflow);

      expect(await service.getWorkflowIdByOrder(mockInput)).toEqual(workflow.workflowId);
    });
  });

  describe('createTracking - the main service to handle and create tracking', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw exception if service.checkCurrentShipment throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'checkCurrentShipment').mockRejectedValue(
        new TrackingException(TrackingValidation.WAIT_FOR_CURRENT_SHIPMENT_COMPLETED)
      );

      await expect(service.createTracking(mockInput)).rejects.toThrow(TrackingException);
    });

    it('should throw exception if service.validateDefinedAndQuantityOrderItem throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockRejectedValue(
        new OrderItemException(OrderItemValidation.ORDER_ITEM_NOT_FOUND)
      );

      await expect(service.createTracking(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should throw exception if service.validateOrderItemInOneOrder throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockRejectedValue(
        new OrderItemException(OrderItemValidation.ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER)
      );

      await expect(service.createTracking(mockInput)).rejects.toThrow(OrderItemException);
    });

    it('should throw exception if order take out but call robot', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT, // The different
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        subtotal: 0,
        status: "",
        type: OrderType.TAKE_OUT, // The different
        id: "",
        slug: "",
      } as Order;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);

      await expect(service.createTracking(mockInput)).rejects.toThrow(TrackingException);
    });

    it('should throw exception when call robot if service.getLocationTableByOrder throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'getLocationTableByOrder').mockRejectedValue(
        new TableException(TableValidation.TABLE_NOT_FOUND)
      );

      await expect(service.createTracking(mockInput)).rejects.toThrow(TableException);
    });

    it('should throw exception when call robot if service.getWorkflowIdByOrder throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'getLocationTableByOrder').mockResolvedValue('mock-table-location');
      jest.spyOn(service, 'getWorkflowIdByOrder').mockRejectedValue(
        new WorkflowException(WorkflowValidation.MUST_ADD_WORKFLOW_FOR_BRANCH)
      );

      await expect(service.createTracking(mockInput)).rejects.toThrow(WorkflowException);
    });

    it('should throw exception when call robot if service.checkRobotStatusBeforeCall throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'getLocationTableByOrder').mockResolvedValue('mock-table-location');
      jest.spyOn(service, 'getWorkflowIdByOrder').mockResolvedValue('mock-workflow-id');
      jest.spyOn(service, 'checkRobotStatusBeforeCall').mockRejectedValue(
        new RobotConnectorException(RobotConnectorValidation.ROBOT_BUSY)
      );

      await expect(service.createTracking(mockInput)).rejects.toThrow(RobotConnectorException);
    });

    it('should throw exception when call robot if robotConnectorClient.runWorkflow throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'getLocationTableByOrder').mockResolvedValue('mock-table-location');
      jest.spyOn(service, 'getWorkflowIdByOrder').mockResolvedValue('mock-workflow-id');
      jest.spyOn(service, 'checkRobotStatusBeforeCall').mockResolvedValue();
      (robotConnectorClientMock.runWorkflow as jest.Mock).mockRejectedValue(
        new RobotConnectorException(RobotConnectorValidation.RUN_WORKFLOW_FROM_ROBOT_API_FAILED)
      )
      await expect(service.createTracking(mockInput)).rejects.toThrow(RobotConnectorException);
    });

    it('should throw exception when call robot if service.createTrackingAndTrackingOrderItem throws', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'getLocationTableByOrder').mockResolvedValue('mock-table-location');
      jest.spyOn(service, 'getWorkflowIdByOrder').mockResolvedValue('mock-workflow-id');
      jest.spyOn(service, 'checkRobotStatusBeforeCall').mockResolvedValue();
      (robotConnectorClientMock.runWorkflow as jest.Mock).mockResolvedValue(
        {workflow_execution_id: 'mock-workflow-execution-id'} as WorkflowExecutionResponseDto
      );
      jest.spyOn(service, 'createTrackingAndTrackingOrderItem').mockRejectedValue(
        new TrackingException(TrackingValidation.CREATE_TRACKING_FAILED)
      );
      await expect(service.createTracking(mockInput)).rejects.toThrow(TrackingException);
    });

    it('should create success and return created tracking when call robot', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_ROBOT,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      const mockOutput = {
        workflowExecution: "",
        status: "",
        trackingOrderItems: [],
        id: "",
        slug: "",
      } as Tracking;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'getLocationTableByOrder').mockResolvedValue('mock-table-location');
      jest.spyOn(service, 'getWorkflowIdByOrder').mockResolvedValue('mock-workflow-id');
      jest.spyOn(service, 'checkRobotStatusBeforeCall').mockResolvedValue();
      (robotConnectorClientMock.runWorkflow as jest.Mock).mockResolvedValue(
        {workflow_execution_id: 'mock-workflow-execution-id'} as WorkflowExecutionResponseDto
      );
      jest.spyOn(service, 'createTrackingAndTrackingOrderItem').mockResolvedValue('mock-tracking-id');
      (trackingSchedulerMock.startUpdateStatusTracking as jest.Mock).mockReturnValue(undefined); // void function
      (trackingRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);

      expect(await service.createTracking(mockInput)).toEqual(mockOutput);
    });

    it('should throw exception if service.createTrackingAndTrackingOrderItem when ship by staff', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_STAFF,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'createTrackingAndTrackingOrderItem').mockRejectedValue(
        new TrackingException(TrackingValidation.CREATE_TRACKING_FAILED)
      );

      await expect(service.createTracking(mockInput)).rejects.toThrow(TrackingException);
    });

    it('should create success and return created tracking when ship by staff', async () => {
      const createTrackingOrderItem: CreateTrackingOrderItemRequestDto = {
        orderItem: "mock-order-item-slug",
        quantity: 1
      };
      const mockInput = {
        type: TrackingType.BY_STAFF,
        trackingOrderItems: [createTrackingOrderItem]
      } as CreateTrackingRequestDto;
      const createTrackingOrderItemWithQuantityAndOrderItem: CreateTrackingOrderItemWithQuantityAndOrderItemEntity = {
        quantity: 1,
        orderItem: {
          quantity: 5,
          subtotal: 0,
          id: "",
          slug: "",
        } as OrderItem
      };
      const orderItemsDataMock = [createTrackingOrderItemWithQuantityAndOrderItem];
      const order = {
        branch: {
          name: "",
          address: "",
          id: "",
          slug: "",
        } as Branch,
        tableName: 'mock-table-name',
        subtotal: 0,
        status: "",
        type: OrderType.AT_TABLE,
        id: "",
        slug: "",
      } as Order;

      const mockOutput = {
        workflowExecution: "",
        status: "",
        trackingOrderItems: [],
        id: "",
        slug: "",
      } as Tracking;

      jest.spyOn(service, 'checkCurrentShipment').mockResolvedValue();
      jest.spyOn(service, 'validateDefinedAndQuantityOrderItem').mockResolvedValue(
        orderItemsDataMock
      );
      jest.spyOn(service, 'validateOrderItemInOneOrder').mockResolvedValue(order);
      jest.spyOn(service, 'createTrackingAndTrackingOrderItem').mockResolvedValue('mock-tracking-id');
      (trackingSchedulerMock.updateStatusOrder as jest.Mock).mockResolvedValue(undefined); // void function
      (trackingRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);

      expect(await service.createTracking(mockInput)).toEqual(mockOutput);
    });
  });
});
