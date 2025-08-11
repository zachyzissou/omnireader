-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector index on embeddings table (will be created by Prisma migration)
-- This is just a placeholder for when the embeddings table exists
-- ALTER TABLE "embeddings" ADD COLUMN IF NOT EXISTS vector vector(1536);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS embeddings_vector_idx ON "embeddings" USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);