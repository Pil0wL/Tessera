
const sortingLambdas = [
  (a, b) => {return a.timestamp.localeCompare(b.timestamp);},
  (a, b) => {return b.timestamp.localeCompare(a.timestamp);},
  (a, b) => {return a.data.ti.localeCompare(b.data.ti);},
  (a, b) => {return b.data.ti.localeCompare(a.data.ti);}
]
export function filter_ticketData(arrayOfTickets, filterInfo) {

  /*
  arrayOfTickets = [
    {
      "ID": "d4797470-e1a0-4849-8217-7cb8b4d60cdc",
      "data": {
        "des": "nga but",
        "ti": "yeah"
      },
      "category": 0,
      "ownerID": "393a15cc-3031-70de-5d9e-3ecb604a7f50",
      "timestamp": "2026-05-16T20:08:14.783Z"
    },
    {...},
    ...
  ]
  */
  /*
  filterInfo = {
    sortBy = 0, // defaults to zero
    searchString = "..."
  }
  */

  const filterted = [];
  const maxSize = arrayOfTickets.length;
  if (!maxSize) return filterted;

  const searchString = filterInfo.hasOwnProperty("searchString") ? filterInfo.searchString.toLowerCase() : "";
  for (const indexData of arrayOfTickets) {
    if (indexData.data.ti.toLowerCase().includes(searchString)) {
      filterted.push(indexData);
    }
  }

  filterInfo.sortBy = filterInfo.hasOwnProperty("sortBy") ? filterInfo.sortBy : 0;
  filterted.sort(sortingLambdas[filterInfo.sortBy]);

  return filterted;
}