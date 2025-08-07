// register
export type IdentityProp = {
  login: boolean;
  useNavigate?: boolean;
};
export interface FormHookType {
  mobile?: {
    message: string;
  };
  password?: {
    message: string;
  };
  confirmPassword?: {
    message: string;
  };
}
export type RegisterAction = {
  request?: any;
};
export type FormIdentityData = {
  mobile?: string;
  confirmPassword?: string;
  password?: string;
};
// login
export type OnSubmitPropFunc = {
  username? : string,
  password? : string
}
export type RouteErrorItem = 
{
  code : string,
  description : string
}
