import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'objectCount',
  standalone: true
})
export class ObjectCountPipe implements PipeTransform {
  transform(value: object[], ...args: any[]) {

    const fieldToSearch = args[0]
    const valueToMatch = args[1]

    if (!fieldToSearch || args.length < 2) {
      // TODO if in local developmnent environment warn that parameters were not suppled
      console.warn("Are you supplying both field to search for and its corresponssing value?")
      return []
    }

    if (typeof (value) != 'object') {
      throw new Error("Value supplied to object count pipe must be an object array");
    }

    if (!args.length) {
      throw new Error("Invalid parameter supplied to object count pipe. What values should be counted?");
    }

    return value.filter((item: any) => item[fieldToSearch] == valueToMatch).length

  }

}
