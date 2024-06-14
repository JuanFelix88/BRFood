import { injectsDependencyList } from "./dependency-injection"

type Dependency = { name: string }

class Factory {
  constructor(protected readonly dependencyList: Dependency[]) {}

  public inject<T extends new (...args: any[]) => any>(
    target: T,
    throwsIfNotFound = process.env.IGNORE_DEPENDENCIES !== "YES",
  ): InstanceType<T> {
    return injectsDependencyList<InstanceType<T>>(
      target,
      this.dependencyList,
      throwsIfNotFound,
    )
  }
}

export function createFactory<T>(dependencyList: Dependency[]) {
  return new Factory(dependencyList)
}
