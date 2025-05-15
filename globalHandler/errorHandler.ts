// utils/withErrorHandler.ts
import { NextResponse } from 'next/server';
import logger from '@/globalHandler/winstonlogs';


export function withErrorHandler(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error: any) {
      const err = error as { message: string; status?: number };
      const shouldLogError = (status: number) => {
        return status >= 500 || status === 400 || status === 422;
      };
      const status = err.status;
      if (shouldLogError(status || 500)) {
        logger.error(`[${req.method} ${req.url}] ${err.message}`);
      }

      return NextResponse.json(
        { success: false, message: err.message || 'Internal Server Error', status: status || 500 },
        { status: status || 500 }
      );
    }
  };
}
