interface SignupFormState {
  fullName: string;
  residentFront: string;
  residentBack: string;
  number: string;
}

interface SignupFormActions {
  setFormField: <K extends keyof SignupFormState>(field: K, value: SignupFormState[K]) => void;
  resetForm: () => void;
}
