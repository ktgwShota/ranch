declare module '../../.open-next/worker.js' {
  const worker: {
    fetch: (request: Request, env: any, ctx: ExecutionContext) => Promise<Response>;
  };
  export default worker;
}
