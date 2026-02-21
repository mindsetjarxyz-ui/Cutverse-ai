declare module 'bytez.js' {
  interface ModelRunResult {
    error: any;
    output: any;
  }

  interface Model {
    run(input: any): Promise<ModelRunResult>;
  }

  class Bytez {
    constructor(apiKey: string);
    model(modelName: string): Model;
  }

  export default Bytez;
}
