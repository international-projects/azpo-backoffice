export type FeatureItem = {
  id: number;
  name: string;
};
export type TagItemType = {
  id: number;
  name: string;
  tag_key: string;
};
export type ErrorFormHook = {
  location?: {
    message: string;
  };
  area?: {
    message: string;
  };
  type?: {
    message: string;
  };
};
