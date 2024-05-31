export type ConstructProps<T> = { [key in keyof T]: T[key] }
