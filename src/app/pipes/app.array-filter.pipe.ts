import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'exclude',
  standalone: true
})
export class ArrayFilter implements PipeTransform {
  transform(value: any, ...args: any[]) {
    if (!Array.isArray(value)) {
      throw new Error('Value supplied to filter pipe must be an array')
    }

    if (!args[0] || !args[1]) {
      console.warn(`Exclude pipe expects key and value. May behave unexpectedly if both values are not supplied`)
      return value
    }

    const excludeKey = args[0]
    const excludeValue = args[1]

    return value.filter((val: any) => val[excludeKey] != excludeValue)

  }
}
