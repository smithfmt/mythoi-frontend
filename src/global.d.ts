// global.d.ts
declare interface NodeRequire {
    context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => __WebpackModuleApi.RequireContext;
  }
  