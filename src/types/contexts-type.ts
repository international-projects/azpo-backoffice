export type AppReducerType = {
  language:string,
  changeLanguage: (language : string) => void,
  changeTheme: (theme : string) => void,
  theme : string,
  showSidebar : boolean,
  toggleSidebar : ()=> void,
}

export type DispatchAppLanguageType = {
  type: string;
  payload: string;
};
