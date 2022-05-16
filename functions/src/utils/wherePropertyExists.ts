/**
 * @param {object} property
 * @return {any}
 */
export function wherePropertyExists(property: any[]) {
  return [...property].filter((obj) => obj != undefined)[0];
}
