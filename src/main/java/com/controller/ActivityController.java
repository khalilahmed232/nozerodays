package com.controller;

import java.sql.Date;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.entity.ActGroup;
import com.entity.ActivityLog;
import com.repo.ActGroupRepo;
import com.repo.ActivityRepo;

import vo.ChangeVO;
import vo.ResultVO;

@RestController
@RequestMapping("/activitylogs")
public class ActivityController {

	@Autowired
	private ActivityRepo activityRepo;

	@Autowired
	private ActGroupRepo actGroupRepo;

	@GetMapping
	public List<ActivityLog> getAllActivities() {
		return activityRepo.findAll();
	}

	@PostMapping
	public ResponseEntity<?> save(@RequestBody ActivityLog activityLog) {

		String message = "";

		ActGroup actGroup = activityLog.getActGroup();
		if (actGroup != null) {
			if (actGroup.getId() != 0) {
				Optional<ActGroup> actGroupOptional = actGroupRepo.findById(actGroup.getId());
				if (actGroupOptional.isPresent()) {
					actGroup = actGroupOptional.get();
					activityLog.setActGroup(actGroup);
					return ResponseEntity.ok(activityRepo.save(activityLog));
				} else {
					message = "Cannot find Activity group with id " + actGroup.getId();
				}
			} else {
				message = "Please include activity group id in payload";
			}
		} else {
			message = "Please include activity group and id in payload ";
		}
		return ResponseEntity.badRequest().body(message);

	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) {
		Optional<ActivityLog> activity = activityRepo.findById(id);
		if (activity.isPresent()) {
			activityRepo.delete(activity.get());
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody ActivityLog activityLog) {
		Optional<ActivityLog> activity = activityRepo.findById(id);
		String message = "";
		if (activity.isPresent()) {
			ActivityLog _activity = activity.get();
			_activity.setCreatedDate(activityLog.getCreatedDate());
			if (activityLog.getActGroup() != null
					&& _activity.getActGroup().getId() == activityLog.getActGroup().getId()) {
				activityRepo.save(_activity);
				return ResponseEntity.ok(_activity);
			} else {
				ActGroup actGroup = activityLog.getActGroup();
				if (actGroup != null) {
					if (actGroup.getId() != 0) {
						Optional<ActGroup> actGroupOptional = actGroupRepo.findById(actGroup.getId());
						if (actGroupOptional.isPresent()) {
							actGroup = actGroupOptional.get();
							_activity.setActGroup(actGroup);
							return ResponseEntity.ok(activityRepo.save(_activity));
						} else {
							message = "Cannot find Activity group with id " + actGroup.getId();
						}
					} else {
						message = "Please include activity group id in payload";
					}
				} else {
					message = "Please include activity group and id in payload ";
				}
			}
		}
		return ResponseEntity.badRequest().body(message);
	}

	@GetMapping("/7days")
	public List<ActivityLog> getLast7DaysActivities() {
		LocalDate localDate = LocalDate.now();
		Date today = Date.valueOf(localDate);
		Date before7days = Date.valueOf(localDate.minusDays(6));
		return activityRepo.findByCreatedDateBetween(before7days, today);
	}

	@GetMapping("/getActivityGroups")
	public List<ActGroup> getAllActivityGrouos() {
		return actGroupRepo.findAll();
	}

	@GetMapping("/PendingToday")
	public HashSet<ActGroup> getPendingToday() {

		HashSet<ActGroup> allActivityGroups = new HashSet<ActGroup>();
		for (ActGroup eachActivityGrp : actGroupRepo.findAll()) {

			LocalDate today = LocalDate.now();
			LocalDate beforeXdays = today.minusDays(eachActivityGrp.getRemindInDays());

			Date todayDt = Date.valueOf(today);
			Date beforeXdaysDt = Date.valueOf(beforeXdays);

			// isActivityPending based on remind_in_days
			List<ActivityLog> listOfactivitiesDone = activityRepo.findCompletedActForActGroup(beforeXdaysDt, todayDt,
					eachActivityGrp.getId());
			// activity is already done in last x days so donot show in pending
			if (listOfactivitiesDone.size() == 0) {
				allActivityGroups.add(eachActivityGrp);
			}
		}
		return allActivityGroups;
	}

	@PostMapping("/change")
	public ResponseEntity<?> changeActivityLog(@RequestBody ChangeVO changeVO) {
		System.out.println(changeVO);

		String dateStr = changeVO.getDateStr();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		try {
			changeVO.setCeatedDate(new java.sql.Date(dateFormat.parse(dateStr).getTime()));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		List<ActivityLog> activitLogList = activityRepo.findActivityByGroupAndDate(changeVO.getCeatedDate(),
				changeVO.getActGroupId());
		if (activitLogList.size() > 0) {
			for (ActivityLog actLog : activitLogList) {
				this.delete(actLog.id);
			}
		} else {
			ActGroup actGroup = new ActGroup();
			actGroup.setId(changeVO.getActGroupId());
			ActivityLog activityLog = new ActivityLog();
			activityLog.setActGroup(actGroup);
			activityLog.setCreatedDate(changeVO.getCeatedDate());
			this.save(activityLog);
		}
		ResultVO resultVO = new ResultVO();
		resultVO.setMessage("done");
		return ResponseEntity.ok().body(resultVO);
	}
}
