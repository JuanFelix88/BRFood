class InjectInspect {
  public unique: symbol
  constructor() {
    this.unique = Symbol("inject")
  }
}

interface Injectable {
  groupName?: string
  target: { name: string }
  name: string
}

export const globalInjectableList: Injectable[] = []

/**
 * @decorator
 */
export function injectable<T extends { new (...args: any[]): {} }>(groupName?: string) {
  return function (target: T) {
    if (globalInjectableList.some((d) => d.name === target.name)) {
      return target
    }

    globalInjectableList.push({
      target,
      groupName,
      name: target.name,
    })
    return target
  }
}

export function injectsDependencyList<T = any, J = any>(
  target: J,
  dependencyList: Array<{ name: string }>,
  throwsIfNotFound = false,
  cachedMap: Map<string, any> = new Map(),
  getSetter = false,
): T {
  const isClass = (target as any)?.toString().startsWith("class ")

  if (!isClass) {
    // return the function
    return target as any
  }

  const constructorArguments = /constructor\((.*)\)\s{0,}{/.exec((target as any).toString())?.[1]

  const injectableList = constructorArguments
    ? constructorArguments.split(",").map(() => new InjectInspect())
    : dependencyList.map(() => new InjectInspect())

  const instance = new (target as any)(...injectableList)

  for (const key of Object.keys(instance)) {
    const foundedInjectable = injectableList.some((injectable) => instance[key] === injectable)

    if (!foundedInjectable) {
      continue
    }

    if (cachedMap.has(key)) {
      Object.defineProperty(instance, key, {
        value: cachedMap.get(key),
      })

      continue
    }

    const dependenciesMatcheds = dependencyList.filter((dependency) =>
      dependency.name.toLowerCase().includes(key.toLowerCase()),
    )

    if (throwsIfNotFound && dependenciesMatcheds.length === 0) {
      throw new Error(
        `❌ Do not resolve the [[${(target as any).name}.${key}]] injectable dependency`,
      )
    }

    if (dependenciesMatcheds.length === 0) {
      console.log(`❌ Do not resolve the [[${(target as any).name}.${key}]] injectable dependency`)
      continue
    }

    if (dependenciesMatcheds.length > 1) {
      throw new Error(
        `There are multiple similar dependencies for ${
          (target as any).name
        }${key}, please check your code (${dependenciesMatcheds.map((d) => d.name).join(", ")})`,
      )
    }

    if (getSetter) {
      Object.defineProperty(instance, key, {
        get: () =>
          injectsDependencyList(
            dependenciesMatcheds[0],
            dependencyList,
            throwsIfNotFound,
            cachedMap,
          ),
      })
    } else {
      Object.defineProperty(instance, key, {
        value: injectsDependencyList(
          dependenciesMatcheds[0],
          dependencyList,
          throwsIfNotFound,
          cachedMap,
        ),
      })
    }

    cachedMap.set(key, instance[key])
  }

  return instance
}
