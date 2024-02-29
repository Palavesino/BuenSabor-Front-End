export interface Rubro {
  id: number;
  denomination: string;
  availability: boolean;
  type: boolean;
  categoryFatherId?: number;
  categoryFatherDenomination: string;
}
export enum ModalType {
  None,
  Create,
  Edit,
  Delete,
  ChangeStatus,
  Details,
  SingUp,
  ChangePass,
}
