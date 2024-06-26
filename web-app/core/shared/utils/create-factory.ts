import { globalInjectableList, injectsDependencyList } from "./dependency-injection"

export type Dependency = { name: string }

class Factory {
  constructor(protected readonly dependencyList: Dependency[]) {}

  public construct<T extends new (...args: any[]) => any>(
    target: T,
    throwsIfNotFound = process.env.IGNORE_DEPENDENCIES !== "YES",
  ): InstanceType<T> {
    return new Proxy({} as InstanceType<T>, {
      get: (target: T, key: string) => {
        const dependenciesMatcheds = this.dependencyList.filter((dependency) => {
          return dependency.name.toLowerCase().includes(key.toLowerCase())
        })

        if (dependenciesMatcheds.length > 1) {
          throw new Error(
            `There are multiple similar dependencies for ${
              (target as any).name ?? ""
            }.${key}, please check your code (${dependenciesMatcheds
              .map((d) => d.name)
              .join(", ")})`,
          )
        }

        const dependency = dependenciesMatcheds[0]

        return injectsDependencyList<InstanceType<T>>(
          dependency,
          this.dependencyList,
          throwsIfNotFound,
          new Map(),
          true,
        )
      },
    })
  }

  public inject<T extends new (...args: any[]) => any>(
    target: T,
    throwsIfNotFound = process.env.IGNORE_DEPENDENCIES !== "YES",
  ): InstanceType<T> {
    return injectsDependencyList<InstanceType<T>>(
      target,
      this.dependencyList,
      throwsIfNotFound,
      new Map(),
    )
  }

  public extends(dependencyList: Dependency[]): Factory {
    this.dependencyList.push(...dependencyList)
    return this
  }

  // public construct: <T>(withResult: any) => T = eval as any

  // public with(classObject: { name: string; toString(): string }) {
  //   const constructorArguments = /constructor\((.*)\)\s{0,}{/.exec(
  //     classObject.toString(),
  //   )?.[1]

  //   if (!constructorArguments) {
  //     throw new TypeError("It was not possible to construct the class")
  //   }

  //   const argumentsList = constructorArguments.split(",").map((arg) => {
  //     arg = arg.trim()
  //     return `${arg} = to.inject(${arg[0].toUpperCase()}${arg.substring(1, arg.length)})`
  //   })

  //   const code = `new ${classObject.name}(${argumentsList.join(", ")})`

  //   return code
  // }
}

export function createFactoryWithGlobalDependencyList(groupNames: string[]) {
  const filtered = globalInjectableList.filter((dependency) => {
    if (!dependency.groupName) return true
    return groupNames.some((groupName) => groupName === dependency.groupName)
  })

  const factory = new Factory(filtered.map((dependency) => dependency.target))

  return factory
}

export function createFactory<T>(dependencyList: Dependency[]) {
  return new Factory(dependencyList)
}
