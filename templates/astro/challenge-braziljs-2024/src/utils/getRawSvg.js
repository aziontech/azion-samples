
/** imageCollection = import meta glob, with eager and raw params */
/** paths is the array of the images path */
export default function getRawSvg(paths, imageCollection) {
  return paths.map(c => {
    const logoPathName = Object.keys(imageCollection).find((i) => {
      return i.includes(c) ? i : null;
    });

    return logoPathName ? imageCollection[logoPathName] : null
  })
}
