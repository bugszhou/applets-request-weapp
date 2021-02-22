function getDataType(val: any): string {
  return Object.prototype.toString.call(val);
}

export function isPlainObject(val: any): val is Record<string, any> {
  if (val === null || getDataType(val) !== "[object Object]") {
    return false;
  }
  const prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

export function assign<T, U>(to: T, from: U): T & U {
  if (isString(from)) {
    return to as T & U;
  }

  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }

  return to as T & U;
}

export function isUndefined(val: any): boolean {
  return typeof val === "undefined";
}

export function merge(
  ...objs: Record<string, any>[]
): any[] | Record<string, any> {
  if (objs.length === 0) {
    return Object.create(null);
  }

  let result: any = Object.create(null);
  function assignValue(val: any, key: string | number): void {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (Array.isArray(val)) {
      result[key] = merge(val);
    } else {
      result[key] = val;
    }
  }

  if (Array.isArray(objs[0])) {
    result = [];
  } else {
    result = Object.create(null);
  }

  objs.forEach((obj) => {
    forEach(obj, assignValue);
  });

  return result;
}
