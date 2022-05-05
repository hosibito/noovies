export const makeImgPath = (imgpath: string, width: string = "w500") =>
  `https://image.tmdb.org/t/p/${width}${imgpath}`;