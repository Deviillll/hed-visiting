// // utils/withErrorHandler.ts
// import { NextResponse } from 'next/server';
// import logger from '@/globalHandler/winstonlogs';


// export function withErrorHandler(
//   handler: (req: Request) => Promise<Response>
// ): (req: Request,context: { params: Record<string, string> }) => Promise<Response> {
//   return async (req: Request,context) => {
//     try {
//       return await handler(req);
//     } catch (error: any) {
//       const err = error as { message: string; status?: number };
//       const shouldLogError = (status: number) => {
//         return status >= 500 || status === 400 || status === 422;
//       };
//       const status = err.status;
//       if (shouldLogError(status || 500)) {
//         logger.error(`[${req.method} ${req.url}] ${err.message}`);
//       }

//       return NextResponse.json(
//         { success: false, message: err.message || 'Internal Server Error', status: status || 500 },
//         { status: status || 500 }
//       );
//     }
//   };
// }



// import { NextRequest, NextResponse } from 'next/server';
// import logger from '@/globalHandler/winstonlogs';

// type RouteHandler = (
//   req: NextRequest,
//   context: { params: Record<string, string> }
// ) => Promise<Response>;

// export function withErrorHandler(handler: RouteHandler) {
//   return async (req: NextRequest, context: { params: Record<string, string> }) => {
//     try {
//       return await handler(req, context);
//     } catch (error: any) {
//       const err = error as { message: string; status?: number };
//       const status = err.status || 500;

//       const shouldLogError = status >= 500 || status === 400 || status === 422;

//       if (shouldLogError) {
//         logger.error(`[${req.method} ${req.url}] ${err.message}`);
//       }

//       return NextResponse.json(
//         { success: false, message: err.message || 'Internal Server Error', status },
//         { status }
//       );
//     }
//   };
// }


import { NextRequest, NextResponse } from "next/server";
import logger from "@/globalHandler/winstonlogs";

export function withErrorHandler(
  handler: (
    req: NextRequest,
    context: any // <-- loosen this to any to fix Vercel build error
  ) => Promise<NextResponse>
): (req: NextRequest, context: any) => Promise<NextResponse> {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      const status = error.status || 500;

      const shouldLogError = status >= 500 || status === 400 || status === 422;

      if (shouldLogError) {
        logger.error(`[${req.method} ${req.url}] ${error.message}`);
      }

      return NextResponse.json(
        {
          success: false,
          message: error.message || "Internal Server Error",
          status,
        },
        { status }
      );
    }
  };
}


