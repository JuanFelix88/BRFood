export interface Usecase {
  handle(...args: unknown[]): Promise<unknown>;
}