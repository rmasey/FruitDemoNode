function pageLoad() {

  let fruitsHTML = `<table>` +
      '<tr>' +
      '<th>Id</th>' +
      '<th>Name</th>' +
      '<th>Image</th>' +
      '<th>Colour</th>' +
      '<th>Size</th>' +
      '<th class="last">Options</th>' +
      '</tr>';

  fetch('/fruit/list', {method: 'get'}
  ).then(response => response.json()
  ).then(fruits => {

      for (let fruit of fruits) {

          fruitsHTML += `<tr>` +
              `<td>${fruit.id}</td>` +
              `<td>${fruit.name}</td>` +
              `<td><img src='/client/img/${fruit.image}' alt='Picture of ${fruit.name}' height='100px'></td>` +
              `<td><span class="fruitColour" style="background-color:${fruit.colour};"></span></td>` +
              `<td>${fruit.size}</td>` +
              `<td class="last">` +
              `<button class='editButton' data-id='${fruit.id}'>Edit</button>` +
              `<button class='deleteButton' data-id='${fruit.id}'>Delete</button>` +
              `</td>` +
              `</tr>`;

      }

      fruitsHTML += '</table>';

      document.getElementById("listDiv").innerHTML = fruitsHTML;

      let editButtons = document.getElementsByClassName("editButton");
      for (let button of editButtons) {
          button.addEventListener("click", editFruit);
      }

      let deleteButtons = document.getElementsByClassName("deleteButton");
      for (let button of deleteButtons) {
          button.addEventListener("click", deleteFruit);
      }

  });

  document.getElementById("saveButton").addEventListener("click", saveEditFruit);
  document.getElementById("cancelButton").addEventListener("click", cancelEditFruit);

}

function editFruit(event) {

  const id = event.target.getAttribute("data-id");

  if (id === null) {

      document.getElementById("editHeading").innerHTML = 'Add new fruit:';

      document.getElementById("fruitId").value = '';
      document.getElementById("fruitName").value = '';
      document.getElementById("fruitImage").value = '';
      document.getElementById("fruitColour").value = '';
      document.getElementById("fruitSize").value = '';

      document.getElementById("listDiv").style.display = 'none';
      document.getElementById("editDiv").style.display = 'block';

  } else {

      fetch('/fruit/get/' + id, {method: 'get'}
      ).then(response => response.json()
      ).then(fruit => {

          if (fruit.hasOwnProperty('error')) {
              alert(fruit.error);
          } else {

              document.getElementById("editHeading").innerHTML = 'Editing ' + fruit.name + ':';

              document.getElementById("fruitId").value = id;
              document.getElementById("fruitName").value = fruit.name;
              document.getElementById("fruitImage").value = fruit.image;
              document.getElementById("fruitColour").value = fruit.colour;
              document.getElementById("fruitSize").value = fruit.size;

              document.getElementById("listDiv").style.display = 'none';
              document.getElementById("editDiv").style.display = 'block';
              
          }

      });

  }

}

function saveEditFruit(event) {

  event.preventDefault();

  if (document.getElementById("fruitName").value.trim() === '') {
      alert("Please provide a fruit name.");
      return;
  }

  if (document.getElementById("fruitImage").value.trim() === '') {
      alert("Please provide a fruit image.");
      return;
  }

  if (document.getElementById("fruitColour").value.trim() === '') {
      alert("Please provide a fruit colour.");
      return;
  }

  if (document.getElementById("fruitSize").value.trim() === '') {
      alert("Please provide a fruit size.");
      return;
  }

  const id = document.getElementById("fruitId").value;
  const form = document.getElementById("fruitForm");
  const formData = new FormData(form);

  let apiPath = '';
  if (id === '') {
      apiPath = '/fruit/new';
  } else {
      apiPath = '/fruit/update';
  }

  fetch(apiPath, {method: 'post', body: formData}
  ).then(response => response.json()
  ).then(responseData => {

      if (responseData.hasOwnProperty('error')) {
          alert(responseData.error);
      } else {
          document.getElementById("listDiv").style.display = 'block';
          document.getElementById("editDiv").style.display = 'none';
          pageLoad();
      }
  });

}

function cancelEditFruit(event) {

  event.preventDefault();

  document.getElementById("listDiv").style.display = 'block';
  document.getElementById("editDiv").style.display = 'none';

}


function deleteFruit(event) {

  const ok = confirm("Are you sure?");

  if (ok === true) {

      let id = event.target.getAttribute("data-id");
      let formData = new FormData();
      formData.append("id", id);

      fetch('/fruit/delete', {method: 'post', body: formData}
      ).then(response => response.json()
      ).then(responseData => {

              if (responseData.hasOwnProperty('error')) {
                  alert(responseData.error);
              } else {
                  pageLoad();
              }
          }
      );
  }

}