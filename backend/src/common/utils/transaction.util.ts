import { Connection, ClientSession } from 'mongoose';

/**
 * Transaction helper utility
 * Wraps a database operation in a MongoDB transaction
 * 
 * @param connection - MongoDB connection
 * @param operation - Async function to execute within transaction
 * @returns Result of the operation
 * 
 * @example
 * ```typescript
 * const result = await withTransaction(this.connection, async (session) => {
 *   const user = await this.userModel.create([userData], { session });
 *   const profile = await this.profileModel.create([profileData], { session });
 *   return { user, profile };
 * });
 * ```
 */
export async function withTransaction<T>(
  connection: Connection,
  operation: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = await connection.startSession();
  
  try {
    session.startTransaction();
    
    const result = await operation(session);
    
    await session.commitTransaction();
    return result;
    
  } catch (error) {
    await session.abortTransaction();
    throw error;
    
  } finally {
    session.endSession();
  }
}

/**
 * Retry logic for database operations
 * Useful for handling temporary network issues or conflicts
 * 
 * @param operation - Async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param delayMs - Delay between retries in milliseconds
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}
