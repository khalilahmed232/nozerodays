var BACKEND_URL = "http://192.168.0.182:8080/";
var pendingTasks = [];

$(document).ready(function () {
  defaultFunction();
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

async function defaultFunction() {
  var activityGroups = await fetchActiivtyGroupsAsync();
  var activitylogslast7days = await activitylogs7daysFn();

  console.table(activityGroups);
  console.table(activitylogslast7days);

  createMainTableData({ activityGroups, activitylogslast7days });
}

function createMainTableData({ activityGroups, activitylogslast7days }) {
  let activityGroupsMap = {};
  activityGroups.forEach(function (val) {
    activityGroupsMap[val.id] = val;
    activityGroupsMap[val.id]["count"] = 0;
  });

  console.dir(activityGroupsMap);

  activitylogslast7days.forEach(function (val) {
    console.log(val.createdDate);
    console.log(new Date(val.createdDate));
    activityGroupsMap[val.actGroup.id][val.createdDate] = true;
    if (activityGroupsMap[val.actGroup.id][val.createdDate] === true) {
      activityGroupsMap[val.actGroup.id]["count"] += 1;
    }
    console.log(val);
  });

  var mainHtml = "<table>";

  mainHtml += "<thead>";
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

  activityGroups.forEach(function (actGroup) {
    mainHtml += "<tr>";
    mainHtml += "<td>" + actGroup.name + "</td>";

    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 6);
    for (var i = 0; i < 7; i++) {
      console.log(currentDate);
      var currentDateStr = dateToStr(currentDate);
      if (activityGroupsMap[actGroup.id][currentDateStr] === true) {
        mainHtml += "<td> ✅";
      } else {
        mainHtml += "<td> ❌";
      }
      mainHtml += `
        <a onclick="changeLog('${currentDateStr}','${actGroup.id}')"> Change </a> </td>`;
      currentDate.setDate(currentDate.getDate() + 1);
      console.log(currentDate);
    }
    mainHtml += "<td> " + activityGroupsMap[actGroup.id]["count"] + " </td>";
    mainHtml +=
      "<td> " +
      Math.round((activityGroupsMap[actGroup.id]["count"] / 7) * 100) +
      " </td>";

    mainHtml += "</tr>";
  });
  mainHtml += "</tbody>";

  mainHtml += "</table>";

  $("#main-new-table").html(mainHtml);
  console.dir(activityGroupsMap);
  console.table(activityGroupsMap);
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
      defaultFunction();
    },
    error: function (err, mess) {},
  });
}
