#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const clientPath = join(process.cwd(), 'node_modules/.prisma/client');
const indexPath = join(clientPath, 'index.js');
const typesPath = join(clientPath, 'index.d.ts');

// Check if Prisma client exists
if (!existsSync(indexPath)) {
  console.log('Prisma client not found, creating fallback...');
  
  // Create directory if it doesn't exist
  mkdirSync(dirname(indexPath), { recursive: true });
  
  // Create minimal stub client
  const stubClient = `
export class PrismaClient {
  constructor() {
    console.warn('Using fallback Prisma client stub');
  }
  
  $connect() { return Promise.resolve(); }
  $disconnect() { return Promise.resolve(); }
  
  // Add basic model stubs
  source = {};
  item = {};
  user = {};
  filter = {};
  annotation = {};
  embedding = {};
}

export default PrismaClient;
`;

  const stubTypes = `
export declare class PrismaClient {
  constructor(): void;
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  source: any;
  item: any;
  user: any;
  filter: any;
  annotation: any;
  embedding: any;
}

export default PrismaClient;
`;

  writeFileSync(indexPath, stubClient);
  writeFileSync(typesPath, stubTypes);
  
  console.log('Fallback Prisma client created');
} else {
  console.log('Prisma client exists');
}