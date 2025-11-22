import { Test, TestingModule } from '@nestjs/testing';
import { FeedGateway } from './feed.gateway';

describe('FeedGateway', () => {
  let gateway: FeedGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedGateway],
    }).compile();

    gateway = module.get<FeedGateway>(FeedGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
