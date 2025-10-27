declare module 'vapi' {
    export default class Vapi {
      constructor(config: { apiKey: string });
  
      start(options: { assistant: string }): void;
      end(): void;
  
      on(event: 'call-start' | 'call-end', callback: () => void): void;
      on(event: 'transcript', callback: (data: any) => void): void;
    }
  }
  