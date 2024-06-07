class InjectInspect {
  public unique: symbol
  constructor() {
    this.unique = Symbol("inject")
  }
}

export function injectsDependencyList<T = any, J = any>(
  target: J,
  dependencyList: Array<{ name: string }>
): T {
  const injectableList = dependencyList.map(() => new InjectInspect())

  const isClass = (target as any).toString().startsWith("class ")

  if (!isClass) {
    // return the function
    return target as any
  }

  const instance = new (target as any)(...injectableList)

  for (const key of Object.keys(instance)) {
    const foundedInjectable = injectableList.some(
      (injectable) => instance[key] === injectable
    )

    if (!foundedInjectable) {
      continue
    }

    const dependenciesMatcheds = dependencyList.filter((dependency) =>
      dependency.name.toLowerCase().includes(key.toLowerCase())
    )

    if (!dependenciesMatcheds.some(() => true)) {
      throw new Error(
        `Do not resolve the ${target}${key} injectable dependency`
      )
    }

    if (dependenciesMatcheds.length > 1) {
      throw new Error(
        `There are multiple similar dependencies for ${target}${key}, please check your code (${dependenciesMatcheds
          .map((d) => d.name)
          .join(", ")})`
      )
    }

    Object.defineProperty(instance, key, {
      value: injectsDependencyList(dependenciesMatcheds[0], dependencyList),
    })
  }

  return instance
}
