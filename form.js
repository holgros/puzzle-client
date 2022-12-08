const url = "https://holgros-puzzle-api.herokuapp.com/puzzles";

window.onload = () => {
  const input = document.querySelector("#teacher");
  const suggestions = document.querySelector(".suggestions ul");
  const student = document.getElementById("student");
  const input2 = document.querySelector("#puzzle");
  const suggestions2 = document.querySelector(".suggestions2 ul");
  let teacher = [];
  let puzzle = [];
  let teacherInputs = document.getElementsByClassName("teacher");
  let puzzleInputs = document.getElementsByClassName("puzzle");
  let submit = document.getElementById("submit");

  fetch(url + "/users/")
    .then((response) => response.json())
    .then((data) => {
      teacher = data;
    })
    .catch((error) => {
      console.log(error);
    });

  function search(str, htmlElem) {
    let results = [];
    const val = str.toLowerCase();
    let elem = teacher;
    if (htmlElem.id == "puzzle") elem = puzzle;
    for (i = 0; i < elem.length; i++) {
      if (elem[i].toLowerCase().indexOf(val) > -1) {
        results.push(elem[i]);
      }
    }
    return results;
  }

  function searchHandler(e) {
    let found = false;
    for (i = 0; i < teacher.length; i++) {
      if (teacher[i] == teacherInputs[1].value) {
        for (j = 0; j < puzzle.length; j++) {
          if (puzzle[j] == puzzleInputs[1].value) {
            found = true;
            break;
          }
        }
        break;
      }
    }
    if (!found) submit.style.display = "none";
    else submit.style.display = "inline";
    //submit.style.display = "none";
    const inputVal = e.currentTarget.value;
    let results = [];
    if (inputVal.length > 0) {
      results = search(inputVal, e.currentTarget);
    }
    showSuggestions(results, inputVal, e.currentTarget);
  }

  function showSuggestions(results, inputVal, htmlElem) {
    let sug = suggestions;
    if (htmlElem.id == "puzzle") sug = suggestions2;
    sug.innerHTML = "";

    if (results.length > 0) {
      for (i = 0; i < results.length; i++) {
        let item = results[i];
        // Highlights only the first match
        // TODO: highlight all matches
        const match = item.match(new RegExp(inputVal, "i"));
        item = item.replace(match[0], `<strong>${match[0]}</strong>`);
        sug.innerHTML += `<li>${item}</li>`;
      }
      sug.classList.add("has-suggestions");
    } else {
      results = [];
      sug.innerHTML = "";
      sug.classList.remove("has-suggestions");
    }
  }

  function checkStudent(e) {
    let display = "none";
    if (student.value) display = "inline";
    teacherInputs[0].style.display = display;
    teacherInputs[1].style.display = display;
    if (display == "none") {
      puzzleInputs[0].style.display = display;
      puzzleInputs[1].style.display = display;
    }
  }

  function useSuggestion(e) {
    suggestions.innerHTML = "";
    suggestions.classList.remove("has-suggestions");
    suggestions2.innerHTML = "";
    suggestions2.classList.remove("has-suggestions");
    input.value = e.target.innerText;
    input.focus();

    //console.log(url + "?user=" + input.value);
    fetch(url + "?user=" + input.value)
    .then((response) => response.json())
    .then((data) => {
      puzzle = [];
      for (i = 0; i < data.length; i++) {
        puzzle.push(data[i].title);
      }
      //console.log(puzzle);
      let display = "none";
      if (data.length > 0) display = "inline";
      puzzleInputs[0].style.display = display;
      puzzleInputs[1].style.display = display;
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function useSuggestion2(e) {
    suggestions.innerHTML = "";
    suggestions.classList.remove("has-suggestions");
    suggestions2.innerHTML = "";
    suggestions2.classList.remove("has-suggestions");
    input2.value = e.target.innerText;
    input2.focus();
    submit.style.display = "inline";
  }

  student.addEventListener("keyup", checkStudent);
  input.addEventListener("keyup", searchHandler);
  input2.addEventListener("keyup", searchHandler);
  suggestions.addEventListener("click", useSuggestion);
  suggestions2.addEventListener("click", useSuggestion2);
};
