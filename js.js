var small = ($(window).width() <= 570);

$(document).ready(function() {
  studentFactory();

  $(window).resize(function() {
  	small = ($(window).width() <= 570);
  });

  $(window).click(function() {
    $(".person, .grades, .controls").css("background-color", "unset");
    if (!alwaysShow) {
      $("button.grade.minus, input.grade").hide();
    }
    focused = 0;
  });

  $(window).keypress(function(event) {
    if (focused === 0) return;
    for (let i = 0; i < 10; i++) {
      if (event.which === i + 48) {
        $("div.num-" + focused + " .grade-buttons")
          .find("input")
          .get( (i === 0) ? 9 : i-1)
          .value++;
        }
      }
  }).keydown(function(event) {
    if ($("input:focus").length === 0) {
      if (event.keyCode === 32) {studentFactory();}
      if (event.keyCode === 46) {deleteStudent(focused);}
      if (event.keyCode === 40) {
        $('.person.num-' + ((focused < studentCount - 1) ? focused+1 : 1))
        .click();
      }
      if (event.keyCode === 38) {
        $('.person.num-' + ((focused === 1) ? studentCount - 1 : focused-1))
        .click();
      }
      if (event.keyCode === 13) {submit(); $("button.submit").trigger("click");}
    }
 });

  $(".submit").click(submit);

  // checkbox
  $(".alwaysShow").change(function() {
    alwaysShow = !alwaysShow;
    if (alwaysShow) {
      $("button.grade.minus, input.grade").show();
    } else {
      $("button.grade.minus, input.grade").hide();
    }
  });
});
