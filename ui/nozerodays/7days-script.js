$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: BACKEND_URL + "activitylogs/7days",
    success: function (result) {
      map = {};
      result.forEach((element) => {
        var actGroup = element.actGroup.id;

        if (map[actGroup] == undefined) {
          map[actGroup] = {};
          map[actGroup].name = element.actGroup.name;
        }
        if (map[actGroup]["count"] == undefined) {
          map[actGroup]["count"] = 1;
        } else {
          map[actGroup]["count"] += 1;
        }
      });

      var dateHeader = populateDateHeader();

      var html = ``;

      Object.keys(map).forEach((element) => {
        map[element]["past"] = "";
      });

      var array = [];

      Object.keys(map).forEach((element) => {
        var percentage = ((map[element]["count"] / 7) * 100).toFixed(2);
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 6);
        for (var i = 0; i < 7; i++) {
          var currentDateStr = dateToStr(currentDate);
          if (findInResultByDate(result, currentDateStr, element)) {
            map[element]["past"] += "✅";
          } else {
            map[element]["past"] += "❌";
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        var color = "";
        if (percentage >= 0 && percentage < 20) {
          color = "#de425b";
        } else if (percentage >= 20 && percentage < 40) {
          color = "#f8995e";
        } else if (percentage >= 40 && percentage < 60) {
          color = "#ffe692";
        } else if (percentage >= 60 && percentage < 80) {
          color = "#a9ba59";
        } else if (percentage >= 80 && percentage < 100) {
          color = "#488f31";
        }
        var barGraph = `<div class="bar-graph" style="background-color: ${color}; width: ${percentage}%"></div>`;
        arr = [];
        arr[0] = map[element]["name"];
        arr[1] = map[element]["past"];
        arr[2] = map[element]["count"];
        arr[3] = percentage;
        arr[4] = barGraph;
        array.push(arr);
      });
      $(".table tbody").html(html);
      $(".table").DataTable({
        data: array,
        pageLength: 50,
        columns: [
          { title: "Name" },
          { title: dateHeader, orderable: false },
          { title: "Count" },
          { title: "Percentage" },
          { title: "BarGraph", orderable: false },
        ],
      });
    },
  });
});

function findInResultByDate(result, date, actGroup) {
  var found = false;

  result.forEach((element) => {
    if (
      element.createdDate === date &&
      element.actGroup.id === parseInt(actGroup)
    ) {
      found = true;
    }
  });
  return found;
}

function populateDateHeader() {
  var dateHeader = "";

  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 6);
  for (var i = 0; i < 7; i++) {
    if (i != 0) {
      dateHeader += "-";
    }
    dateHeader += currentDate.getDate();
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateHeader;
}
