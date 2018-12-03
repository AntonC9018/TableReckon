var studentCount = 1;
var focused = 0;
var alwaysShow = false;
var tabbing = false;

var deleteStudent = function(elem) {

  // Quick check if the function is called on a concrete element
  let clickedRow;
  if (elem != null && isNaN(elem)) {
    clickedRow = getClickedRow(elem);
  } else if (elem === undefined || elem === 0) {
    clickedRow = studentCount - 1;
  } else {
    clickedRow = elem;
  }
  // Not delete the only one
  if (studentCount === 2) return;
  // Delete the whole row
  $("div.num-" + clickedRow).remove();
  // Move indeces of rows below deleted one up
  for (let i = clickedRow; i < studentCount - 1; i++) {
    $("div.num-" + (i + 1) + ",button.num-" + (i + 1))
      .removeClass("num-" + (i + 1))
      .addClass("num-" + i)
      .find("strong")
      .html("Student #" + i); // change the label
  }
  studentCount--; // decrease the total # of students
}

var debug = function() { // show css "num-" classes
  for (let i = 1; i < studentCount; i++) {
    $("div.num-" + i)
      .find("strong")
      .html("class = " + i);
  }
}

var getClickedRow = function(elem) {
  // get all classes
  if (elem instanceof jQuery) {
    elem = elem.get(0);
  }
  let classes = elem.className.split(' ');

  for (let i = 0; i < classes.length; i++) {
    if (classes[i].indexOf('num-') == 0) { // find "num-" class
      return parseInt(classes[i].substr(4)); // get the index
    }
  }
  return -1;
}

var giveClickListeners = function() {
  let numClass = ".num-" + studentCount;

  // input field for name of students
  $(".person" + numClass + " .name")
    .focusin(function() {
      // select text if the name has not been set yet
      if (this.value === "Name") {
        this.select();
      }
      // light up this row (in case of tabbing it wouldn't light up itself)
      $(this).parent().click();
    }).keypress(function(event) {
    // enter
    if (event.which === 13) {
      $(this).blur();
      return;
    }
    // not type in digits (from 0 through 9)
    for (let i = 0; i < 10; i++) {
      if (event.which === i + 48) {
        event.preventDefault();
      }
    }

  });
  // 'student' and 'grades' divs
  $(".person, .grades, .controls")
    .filter(numClass)
    .click(function(event) {
      // get the row clicked
      let clickedRow = getClickedRow(this);
      let rowClass = '.num-' + clickedRow;

      // put out everything else
      $(".person, .grades, .controls")
        .not(rowClass)
        .css("background-color", "unset");

      // change bg to green
      $(rowClass).css("background-color", "rgb(117, 227, 125)");

      if (!alwaysShow) {
        // hide minus buttons and input boxes
        $("button.grade.minus, input.grade").hide();
        // light up minuses and input boxes
        $(`${rowClass} button.grade.minus,${rowClass} input.grade`)
          .toggle();
      }

      // prevent the window's event listener's actions
      // that could put out the new bg right away
      event.stopPropagation();

      // register the focus
      focused = clickedRow;

    }).mouseenter(function() {
    if (focused != getClickedRow(this)) {
      $(this).css("background-color", "rgb(254, 255, 191)");
    }

  }).mouseleave(function() {
    if (focused != getClickedRow(this)) {
      $(this).css("background-color", "unset");
    }
  });

  // "delete" button
  $(numClass + ".delete").click(function() {

    if (!alwaysShow) {
      $("button.grade.minus, input.grade").hide();
    }
    deleteStudent(this);
  });

  // "create" button
  $(numClass + ".plus").click(function(event) {
    studentFactory();
    event.stopPropagation();
  });

  $(".grades" + numClass + " .grade.grade-buttons input")
    .keypress(function(event) {
      // only type in numbers while not tweaking other values
      if (event.which >= 48 && event.which <= 58) {
        event.stopPropagation();
      } else {
        event.preventDefault();
      }
      ;
    }).on('blur', function() {
    // default to '0' if the user left input box empty
    if (this.value === '') {
      this.value = 0;
    }
  }).focusin(function() {
    if (small) $(this).blur();
    else $(this).select();
  });
}
