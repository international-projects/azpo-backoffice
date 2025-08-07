export type FormItemType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  through_telegram: 0 | 1;
  through_whatsapp: 0 | 1;
  through_email: 0 | 1;
  page_url: string;
  created_at: string;
};
export type FormsType = {
  forms: FormItemType[];
  count: number;
};
