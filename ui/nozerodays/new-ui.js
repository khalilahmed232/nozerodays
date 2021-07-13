var BACKEND_URL = "http://192.168.0.182:8080/";
var pendingTasks = [];
var NO_OF_DAYS_TO_SHOW = 7;

$(document).ready(function () {
  defaultFunction({ status: "ALL" });
});

function getCurrentDate() {
  return dateToStr(new Date());
}

function dateToStr(date) {
  var str = date.getFullYear() + "-";
  var month = date.getMonth() + 1;
  var days = date.getDate();
  if (month < 10) {
    str += "0";
  }
  str += month + "-";
  if (days < 10) {
    str += "0";
  }
  str += days;
  return str;
}

async function fetchActiivtyGroupsAsync() {
  let actGroupsAll = await fetch(
    BACKEND_URL + "activitylogs/getActivityGroups"
  );
  let actGroupsJSON = await actGroupsAll.json();
  return actGroupsJSON;
}

async function activitylogs7daysFn() {
  let activitylogs = await fetch(BACKEND_URL + "activitylogs/7days");
  return activitylogs.json();
}

async function defaultFunction(options) {
  var activityGroups = await fetchActiivtyGroupsAsync();
  var activitylogslast7days = await activitylogs7daysFn();
  createMainTableData({ activityGroups, activitylogslast7days, options });
}

function createMainTableData({
  activityGroups,
  activitylogslast7days,
  options,
}) {
  let activityGroupsMap = {};
  activityGroups.forEach(function (val) {
    activityGroupsMap[val.id] = val;
    activityGroupsMap[val.id]["count"] = 0;
  });

  activitylogslast7days.forEach(function (val) {
    activityGroupsMap[val.actGroup.id][val.createdDate] = true;
    if (activityGroupsMap[val.actGroup.id][val.createdDate] === true) {
      activityGroupsMap[val.actGroup.id]["count"] += 1;
    }
  });

  var mainHtml = "<table> ";

  mainHtml += "<thead>";
  mainHtml += "<td> S No  </td>";
  mainHtml += "<td> Group Name </td>";

  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 6);
  for (var i = 0; i < 7; i++) {
    mainHtml += "<td> " + currentDate.getDate() + " </td>";
    currentDate.setDate(currentDate.getDate() + 1);
  }
  mainHtml += "<td> Count </td>";
  mainHtml += "<td> Percentage </td>";

  mainHtml += "</thead>";
  mainHtml += "<tbody>";

  activityGroups = activityGroups.sort(function (a, b) {
    return a.sortIndex - b.sortIndex;
  });

  var todayCount = 0;
  activityGroups.forEach(function (actGroup) {
    var currentDate = new Date();
    var currentDateStr = dateToStr(currentDate);

    if (
      (options.status == "PENDING" &&
        activityGroupsMap[actGroup.id][currentDateStr] === undefined) ||
      options.status == "ALL"
    ) {
      mainHtml += "<tr>";
      mainHtml += "<td>" + actGroup.sortIndex + "</td>";
      mainHtml += "<td>" + actGroup.name + "</td>";

      currentDate.setDate(currentDate.getDate() - 6);
      for (var i = 0; i < 7; i++) {
        currentDateStr = dateToStr(currentDate);
        if (activityGroupsMap[actGroup.id][currentDateStr] === true) {
          mainHtml += "<td> ✅";
        } else {
          mainHtml += "<td> ❌";
          if (i == 6) {
            todayCount++;
          }
        }
        mainHtml += `
        <a onclick="changeLog('${currentDateStr}','${actGroup.id}')"> Change </a> </td>`;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      mainHtml += "<td> " + activityGroupsMap[actGroup.id]["count"] + " </td>";
      mainHtml +=
        "<td> " +
        Math.round((activityGroupsMap[actGroup.id]["count"] / 7) * 100) +
        " </td>";

      mainHtml += "</tr>";
    }
  });

  $("#PendingTasks").html(
    "<h1>" + todayCount + " tasks are pending today.</h1>"
  );

  mainHtml += "</tbody>";

  mainHtml += "</table>";

  $("#main-new-table").html(mainHtml);
}
function dateToStr(date) {
  var str = date.getFullYear() + "-";
  var month = date.getMonth() + 1;
  var days = date.getDate();
  if (month < 10) {
    str += "0";
  }
  str += month + "-";
  if (days < 10) {
    str += "0";
  }
  str += days;
  return str;
}

function changeLog(dateStr, actGroupId) {
  var y = window.scrollY;
  var data = {
    actGroupId,
    dateStr,
  };

  $.ajax({
    type: "POST",
    url: BACKEND_URL + "activitylogs/change",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),
    success: function () {
      defaultFunction({ status: "ALL" });
    },
    error: function (err, mess) {},
  });
}
