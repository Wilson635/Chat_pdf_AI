import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();
    
    if (!user || !user.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
      ctx: {
        userId: user.id,
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource'
    });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);