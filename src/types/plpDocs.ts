export type DocItemType = {
  area: string;
  audio: string | null;
  description: string | null;
  header1: string | null;
  header2: null | null;
  id: number;
  image: string | null;
  location: string;
  pdf: string | null;
  tag: string;
  type: string;
  video: string | null;
  title: string | null;
  meta_description: string | null;
  keywords: string | null;
  faqs : {id:number ,question: string ,answer:string , pages_content_id : number }[]
};
export type SearchContent = {
  docs : DocItemType[]
  locs: {
    id: number;
    location_name: string;
    location_key: string;
  }[];
  types: { id: number; name: string; filter: string }[];
  tags: { id: number; name: string; tag_key: string; filter: string }[];
  docInfo: DocItemType;
}
export type NewDocType = {
  locs: {
    id: number;
    location_name: string;
    location_key: string;
  }[];
  types: { id: number; name: string; filter: string }[];
  tags: { id: number; name: string; tag_key: string; filter: string }[];
  docInfo: DocItemType;
};
export type EditDocType = {
  locs: {
    id: number;
    location_name: string;
    location_key: string;
  }[];
  types: { id: number; name: string; filter: string }[];
  tags: { id: number; name: string; tag_key: string; filter: string }[];
};

export type DocItemComType = {
  index: number;
  area: string;
  audio: string | null;
  description: string | null;
  header1: string | null;
  header2: null | null;
  id: number;
  image: string | null;
  location: string;
  pdf: string | null;
  tag: string;
  type: string;
  video: string | null;
  title: string | null;
  meta_description: string | null;
  keywords: string | null;
};
