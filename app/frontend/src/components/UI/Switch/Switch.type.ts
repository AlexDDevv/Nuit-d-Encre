export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, React.AriaAttributes {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  labelClassName?: string
}
