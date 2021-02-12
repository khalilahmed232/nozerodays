package com.controller;
import java.sql.Date;
import java.time.LocalDate;
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

import com.entity.ActivityLog;
import com.repo.ActivityRepo;

@RestController
@RequestMapping("/activitylogs")
public class ActivityController {
	
	@Autowired
	private ActivityRepo activityRepo;
	
	@GetMapping
	public List<ActivityLog> getAllActivities ()
	{
		return activityRepo.findAll();
	}
	
	@PostMapping
	public ResponseEntity<ActivityLog> save(@RequestBody ActivityLog activityLog) {
		return ResponseEntity.ok(activityRepo.save(activityLog));
	}
	
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id)
	{
		Optional<ActivityLog> activity = activityRepo.findById(id);
		if ( activity.isPresent() ) {
			activityRepo.delete(activity.get());			
		}
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<ActivityLog> updateActivity(@PathVariable Long id,@RequestBody ActivityLog activityLog) {
		Optional<ActivityLog> activity = activityRepo.findById(id);
		if ( activity.isPresent() ) {
			ActivityLog _activity = activity.get() ;
			_activity.setActivityGroup(activityLog.getActivityGroup());
			_activity.setCreatedDate(activityLog.getCreatedDate());
			activityRepo.save(_activity);
			return ResponseEntity.ok(_activity);
		}
		return ResponseEntity.ok(null);
	}
	
	@GetMapping("/7days")
	public List<ActivityLog> getLast7DaysActivities(){
		
		LocalDate localDate = LocalDate.now();
		Date today =  Date.valueOf(localDate);
		Date before7days =  Date.valueOf(localDate.minusDays(7));
		
		return activityRepo.findByCreatedDateBetween(before7days, today);
	}
}
