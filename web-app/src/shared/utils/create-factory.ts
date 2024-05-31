import { injectsDependencyList } from "./dependency-injection"

type Dependency = { name: string }

class Factory {
  constructor(protected readonly dependencyList: Dependency[]) {}

  public inject<T = any>(target: any): T {
    return injectsDependencyList<T>(target, this.dependencyList)
  }
}

export function createFactory<T>(dependencyList: Dependency[]) {
  return new Factory(dependencyList)
}
