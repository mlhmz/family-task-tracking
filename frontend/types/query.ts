export interface Operator {
  title: string;
  char: string;
}

export enum FieldType {
  Switch,
  Input,
  Datefield,
}

export interface SwitchValues {
  falseValue: string;
  trueValue: string;
}

export interface QueryFilter {
  title: string;
  key: string;
  defaultQueryChar: string;
  variousOperators: boolean;
  /**
   * Can be used if various operators is on
   */
  operators?: Operator[];
  fieldType: FieldType;
  /**
   * Can be used if field is switch
   */
  switchValues?: SwitchValues;
}
