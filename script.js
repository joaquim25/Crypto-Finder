const searchInput = document.getElementById("searchCoin");
const list = document.getElementById("list");
let coins = [];

searchInput.addEventListener("input", apiCall);

// API call or reset autocomplete results
function apiCall() {
  let searchData = searchInput.value;

  if (searchData.length > 0) {
    fetchData(searchData);
  } else {
    coins = [];
    updateAutocomplete(coins);
  }
}

function fetchData(searchData) {
  fetch("https://api.coincap.io/v2/assets")
    .then((response) => response.json())
    .then((response) => {
      coins = [];
      const regex = new RegExp(searchData.toLowerCase(), "gi");
      const data = response.data;

      for (let i = 0; i < data.length; i++) {
        const coin = data[i];
        const coinName = coin.name.toLowerCase();

        if (coinName.match(regex)) {
          coins.push(coin);
        }
      }

      updateAutocomplete(coins);
    });
}

function removeListItems () {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function updateAutocomplete(data) {
  // Remove existing list items
  removeListItems();

  // Update list with new results
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const icon = document.createElement("img");

    listItem.textContent = item.name;
    link.href = item.explorer;
    link.target = "_blank";
    link.classList.add("list__item");
    icon.src = "link-icon.png";
    icon.classList.add("icon__link");

    const matchedIndex = item.name.toLowerCase().indexOf(searchInput.value.toLowerCase());

    if (matchedIndex >= 0) {
      const beforeMatch = item.name.substring(0, matchedIndex);
      const match = item.name.substring(matchedIndex, matchedIndex + searchInput.value.length);
      const afterMatch = item.name.substring(matchedIndex + searchInput.value.length);

      listItem.textContent = "";
      listItem.appendChild(document.createTextNode(beforeMatch));
      listItem.appendChild(document.createElement("strong")).textContent = match;
      listItem.appendChild(document.createTextNode(afterMatch));
    }

    link.appendChild(listItem);
    link.appendChild(icon);
    list.appendChild(link);
  }
}

