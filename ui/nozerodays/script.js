var BACKEND_URL = "http://192.168.0.182:8080/";
var pendingTasks = [];

$(document).ready(function () {
  fetchActiivtyGroups();
  showAllActivites();
  getAndShowPendingTasks();
  $("#addActivityBtn").on("click", function () {
    $("#addActivityForm").css({ display: "block" });
    $(".editActivity").css({ display: "none" });
    $("#addActivitySubmitBtn").css({ display: "block" });
  });

  $("#addActivitySubmitBtn").on("click", function () {
    var data = {
      createdDate: $("#activityLoggedDate").val(),
      actGroup: {
        id: $("#actionDoneSelect").val(),
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
      },
    });
  });

  $("#editActivitySubmitBtn").on("click", function () {
    var data = {
      actGroup: {
        id: $("#actionDoneSelect").val(),
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
  });

  $("#getPending").on("click", getAndShowPendingTasks);
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
