export default async function fetchCountries(name) {
  let url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;

  return fetch(url).then(res => res.json());
}
