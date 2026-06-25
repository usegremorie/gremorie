import { buttonGroup } from './button-group.contract';
import { calendar } from './calendar.contract';
import { checkbox } from './checkbox.contract';
import { datePicker } from './date-picker.contract';
import { form } from './form.contract';
import { input } from './input.contract';
import { inputGroup } from './input-group.contract';
import { inputOtp } from './input-otp.contract';
import { label } from './label.contract';
import { radioGroup } from './radio-group.contract';
import { select } from './select.contract';
import { slider } from './slider.contract';
import { switchContract } from './switch.contract';
import { textarea } from './textarea.contract';
import { toggle } from './toggle.contract';
import { toggleGroup } from './toggle-group.contract';

/** All `forms` category contracts. */
export const FORMS_CONTRACTS = [
  input,
  label,
  textarea,
  checkbox,
  radioGroup,
  select,
  switchContract,
  slider,
  toggle,
  toggleGroup,
  buttonGroup,
  inputOtp,
  inputGroup,
  calendar,
  datePicker,
  form,
];
