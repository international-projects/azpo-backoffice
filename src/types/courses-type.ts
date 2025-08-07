type n = number;
type s = string;
export type ListDataType = {
  id: n;
  averageReviewRating?: n;
  basePrice?: n;
  courseCategory?: n;
  courseLevel: s;
  coverImageUrl: s;
  createdAt?: s;
  description: s;
  duration: n;
  numOfChapters?: n;
  numOfLectures?: n;
  numOfReviews: n;
  title: s;
};
export type LoaderDataType ={
  courses : {
    _data: []
  }
}