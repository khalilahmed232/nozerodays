$(document).ready(function () {
  showAllActivites();
  $("#addActivityBtn").on("click", function () {
    $("#addActivityForm").css({ display: "block" });
    $(".editActivity").css({ display: "none" });
    $("#addActivitySubmitBtn").css({ display: "block" });
  });

  $("#addActivitySubmitBtn").on("click", function () {
    var data = {
      activityGroup: $("#actionDoneSelect").val(),
      createdDate: $("#activityLoggedDate").val(),
    };
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/activitylogs",
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
      activityGroup: $("#actionDoneSelect").val(),
      createdDate: $("#activityLoggedDate").val(),
    };
    var id = $("#activityId").val();
    $.ajax({
      type: "PUT",
      url: "http://localhost:8080/activitylogs/" + id,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
      success: function (result) {
        showAllActivites();
      },
    });
  });
});

function mySubmitFunction(event) {
  return false;
}

function showAllActivites() {
  $("#addActivityForm").hide();
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/activitylogs",
    success: function (result) {
      console.dir(result);
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
          <td> ${element.activityGroup} </td> 
          <td> ${element.createdDate} </td> 
          <td> <button onclick='editActivity(${element.id}, ${elementStr})'>Edit</button> </td>
          <td> <button onclick="deleteActivity(${element.id})">Delete</button> </td> 
        </tr>`;
      });
      $("#activityTable").html(html);
    },
  });
}

function deleteActivity(id) {
  $.ajax({
    type: "DELETE",
    url: "http://localhost:8080/activitylogs/" + id,
    success: function (result) {
      showAllActivites();
    },
  });
}

function editActivity(id, activity) {
  $("#actionDoneSelect").val(activity.activityGroup);
  $("#activityLoggedDate").val(activity.createdDate);
  $("#addActivityForm").css({ display: "block" });
  $("#activityId").val(id);
  $(".editActivity").css({ display: "block" });
  $("#addActivitySubmitBtn").css({ display: "none" });
}
