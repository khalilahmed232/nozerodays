var BACKEND_URL = "http://192.168.0.182:8080/";
var pendingTasks = [];

$(document).ready(function () {
  defaultFunction();
});

function getAndShowPendingTasks() {
  $.ajax({
    type: "GET",
    url: BACKEND_URL + "activitylogs/PendingToday",
    success: function (result) {
      pendingTasks = result;
      pendingTasks = pendingTasks.sort((a, b) =>
        a.sortIndex > b.sortIndex ? 1 : -1
      );

      showPendingTasks();
    },
  });
}

function mySubmitFunction(event) {
  return false;
}

function showAllActivites() {
  $("#addActivityForm").hide();
  $.ajax({
    type: "GET",
    url: BACKEND_URL + "activitylogs",
    success: function (result) {
      var html = "";
      $("#activityTable").html(`<th>
        <td>Id</td>
        <td>Group</td>
        <td>Date</td>
      </th>`);
      result.forEach((element) => {
        var elementStr = JSON.stringify(element);
        html += `<tr> 
          <td> ${element.id} </td> 
          <td> ${element.actGroup.name} </td> 
          <td> ${element.createdDate} </td> 
          <td> <button onclick='editActivity(${elementStr})'>Edit</button> </td>
          <td> <button onclick="deleteActivity(${element.id})">Delete</button> </td> 
        </tr>`;
      });
      $("#activityTable").html(html);
    },
  });
  showPendingTasks();
}

function deleteActivity(id) {
  $.ajax({
    type: "DELETE",
    url: BACKEND_URL + "activitylogs/" + id,
    success: function (result) {
      showAllActivites();
    },
  });
}

function editActivity(activity) {
  $("#actionDoneSelect").val(activity.actGroup.id);
  $("#activityLoggedDate").val(activity.createdDate);
  $("#addActivityForm").css({ display: "block" });
  $("#activityId").val(activity.id);
  $(".editActivity").css({ display: "block" });
  $("#addActivitySubmitBtn").css({ display: "none" });
}

function fetchActiivtyGroups() {
  $.ajax({
    type: "GET",
    url: BACKEND_URL + "activitylogs/getActivityGroups",
    success: function (result) {
      var html = "";
      result.forEach((actGroup) => {
        html += `<option value="${actGroup.id}">${actGroup.name}</option>`;
      });
      $("#actionDoneSelect").html(html);
    },
  });
}

function showPendingTasks() {
  var html = "";
  pendingTasks.forEach((actGroup, i) => {
    html += `<li><p class="pending-item" >${actGroup.name}</p> 
    <button onclick="completedToday('${actGroup.id}')">Completed Today</button>  
  </li>`;
  });
  $("#PendingToday").html(html);
}

function completedToday(actGroupId) {
  var data = {
    createdDate: getCurrentDate(),
    actGroup: {
      id: actGroupId,
    },
  };

  $.ajax({
    type: "POST",
    url: BACKEND_URL + "activitylogs",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),
    success: function (result) {
      showAllActivites();
      getAndShowPendingTasks();
    },
  });
}

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
  activityGroups.forEach((val) => (activityGroupsMap[val.id] = val));

  console.dir(activityGroupsMap);

  activitylogslast7days.forEach(function (val) {
    console.log(val.createdDate);
    console.log(new Date(val.createdDate));
    activityGroupsMap[val.actGroup.id][val.createdDate] = true;
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

  mainHtml += "</thead>";
  mainHtml += "<tbody>";

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

      var done = activityGroupsMap[actGroup.id][currentDateStr] === true;

      mainHtml += `
        <a href='#' onclick="changeLog('${currentDateStr}','${actGroup.id}','${done}')"> Change </a> </td>`;

      currentDate.setDate(currentDate.getDate() + 1);

      console.log(currentDate);
    }

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

function changeLog(currentDateStr, actGroupId, done) {
  if (done) {
    // delete
    $.ajax({
      type: "DELETE",
      url: BACKEND_URL + "activitylogs/" + actGroupId,
      success: function (result) {
        showAllActivites();
      },
    });
  } else {
    var data = {
      actGroup: {
        id: payload.actGroup.id,
      },
      createdDate: $("#activityLoggedDate").val(),
    };
    var id = $("#activityId").val();
    $.ajax({
      type: "PUT",
      url: BACKEND_URL + "activitylogs/" + id,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
      success: function (result) {
        showAllActivites();
      },
    });
  }

  alert("heellooooo");
}
