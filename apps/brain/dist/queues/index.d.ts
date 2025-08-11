import { Queue, Worker } from 'bullmq';
export declare const ingestQueue: Queue<any, any, string, any, any, string>;
export declare const embeddingQueue: Queue<any, any, string, any, any, string>;
export declare const enrichmentQueue: Queue<any, any, string, any, any, string>;
export declare const ingestWorker: Worker<any, any, string>;
export declare const embeddingWorker: Worker<any, any, string>;
export declare const enrichmentWorker: Worker<any, any, string>;
//# sourceMappingURL=index.d.ts.map