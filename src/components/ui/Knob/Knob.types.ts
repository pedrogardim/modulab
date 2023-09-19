export interface KnobProps {
  defaultValue?: number;
  min: number;
  max: number;
  size?: number;
  step?: number;
  color?: string;
  label?: string;
  disabled?: boolean;
  polar?: boolean;
  logScale?: boolean;
  style?: Object;
  showValue?: boolean;
  onChange: (value: number) => void;
  onChangeCommited: (value: number) => void;
}
