var submit = function() {
  let students = [];
  let avg = 0;
  let offSet = 1;

  for (let i = 1; i < studentCount; i++) {
    students[i - offSet] = calcStudentMean(i);
    // not show students with no grades in final result
    if (isNaN(students[i - offSet].mean)) {
      students.splice(i - offSet);
      offSet++;
    } else {
      avg += students[i - offSet].mean;
    }
  }
  // translate all numbers into form "a.bc" (9.61, 6.92, 2.11)
  avg = ~~(avg * 100 / (students.length)) / 100;

  //download the table
  function debugBase64(base64URL) {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  // construct the table
  let file = 'Average grades\r\nName \tAverage\r\n';
  students.forEach(function(row) {
    let a = [row.name, row.mean];
    file += a.join(':\t');
    file += '\r\n';
  });
  file += "Over all:  " + avg;
  file += '\r\n \r\n';
  file += 'All grades\r\n';

  for (let i = 0; i < students.length; i++) {
    file += students[i].name + ': ';
    for (let j = 0; j < students[i].grades.length; j++) {
      file += students[i].grades[j];
      file += (students[i].grades[j] === 10) ? ' ' : '  ';
    }
    file += '\r\n';
  }

  let d = new Date();

  $(this)
    .parent()
    .filter("a")
    .attr("href", "data:text/plain;charset=utf-16," + encodeURIComponent(file))
    .attr("download", d.getMinutes() + '-' + d.getDay()
      + '-' + d.getMonth() + '-' + d.getFullYear() + ".txt");
}

var calcStudentMean = function(row) {
  let gradesCount = $(".num-" + row + ".grades .grade.grade-buttons input")
    .map(function() {
      return parseInt($(this).val());
    })
    .get();

  let grades = [];

  for (let i = 0; i < gradesCount.length; i++) {
    for (let j = 0; j < gradesCount[i]; j++) {
      grades.push(i + 1);
    }
  }

  let count = gradesCount.reduce((a, b) => a + b);
  let sum = (grades.length > 0) ? grades.reduce((a, b) => a + b) : 0;
  // calculate the mean
  // translate all numbers into form "a.bc" (9.61, 6.92, 2.11)
  let mean = ~~(sum / count * 100) / 100;

  return {
    name: $(".num-" + row + ".person .name").val(),
    grades: grades,
    mean: mean
  }
}
