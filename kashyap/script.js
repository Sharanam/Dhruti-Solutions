let storedCountry = document.getElementById("country");
let storedYear = document.getElementById("year");

let inpConfirm = document.getElementById("inpConfirm");
let inpDeath = document.getElementById("inpDeath");
let inpRecover = document.getElementById("inpRecovered")

const relationalRequirements = {
  confirm: 1,
  death: 1,
  recovered: 1
}

let subBtn = document.getElementById("subBtn");

let tableData = document.getElementById("table-data");

let jsonData;
const year = new Set();

subBtn.addEventListener("click", () => {
  if (jsonData) updateData({ considerInput: true });
})

function toggle(key){
  if(relationalRequirements[key] === 1){
    relationalRequirements[key] = 0;
  }else{
    relationalRequirements[key] = 1;
  }

  document.getElementById(`toggleConfirm`).innerText = relationalRequirements.confirm ? "Greater Than" : "Less Than";
  document.getElementById(`toggleDeath`).innerText = relationalRequirements.death ? "Greater Than" : "Less Than";
  document.getElementById(`toggleRecovered`).innerText = relationalRequirements.recovered ? "Greater Than" : "Less Than";
}

function updateData(option = {}) {
  let selected = {
    data:
      jsonData[storedCountry.value]?.filter((d) =>
        d?.date?.includes(storedYear.value)
      )
      || []
    , country: storedCountry.value
  };
  tableData.innerHTML = "";
  if (option.considerInput) {
    selected.data = selected.data.filter((d) => {
      if (inpConfirm.value && relationalRequirements.confirm === 1 && +inpConfirm.value > +d.confirmed) return false;
      if (inpConfirm.value && relationalRequirements.confirm === 0 && +inpConfirm.value < +d.confirmed) return false;
      if (inpDeath.value && relationalRequirements.death === 1 && +inpDeath.value > +d.deaths) return false;
      if (inpDeath.value && relationalRequirements.death === 0 && +inpDeath.value < +d.deaths) return false;
      if (inpRecover.value && relationalRequirements.recovered === 1 && +inpRecover.value > +d.recovered) return false;
      if (inpRecover.value && relationalRequirements.recovered === 0 && +inpRecover.value < +d.recovered) return false;

      return true;
    })
  }

  selected.data?.forEach((d) => {
    tableData.innerHTML += `
    <tr>
    <td>${d.date}</td>
    <td>${d.confirmed}</td>
    <td>${d.deaths}</td>
    <td>${d.recovered}</td>
    </tr>`;
  });

  if (selected.data?.length === 0) {
    tableData.innerHTML = `
    <tr><td colspan="4" style="text-align:center">
      No Data Found
    </td></tr>`;
  }
}

function getDefaultOption(string = "Select Default", disabled = true, selected = true) {
  let optionElem = document.createElement("option");
  optionElem.setAttribute("value", "");
  if (disabled)
    optionElem.setAttribute("disabled", true);
  optionElem.setAttribute("selected", selected);
  optionElem.innerText = string;
  return optionElem;
}

function setup() {
  tableData.innerHTML = `
  <tr>
  <td colspan="4" style="text-align:center">
    Select Country and Year to see data
  </td>
  </tr>`

  Object.keys(jsonData).forEach(function (key) {
    let optionElem = document.createElement("option");
    optionElem.setAttribute("value", key);
    optionElem.innerText = key;
    country.appendChild(optionElem);

    for (let i = 0; i < jsonData[key].length; i++) {
      year.add(new Date(jsonData[`${key}`][i].date).getFullYear());
    }
  });

  storedYear.appendChild(getDefaultOption("For Each Year", false));

  year.forEach(function (key) {
    let x = document.createElement("option");
    x.setAttribute("value", key);
    x.innerText = key;
    storedYear.appendChild(x);
  });

  storedCountry.addEventListener("change", updateData);
  storedYear.addEventListener("change", updateData);

  updateData();
}

window.onload = function () {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      jsonData = data;
      setup();
    });
}