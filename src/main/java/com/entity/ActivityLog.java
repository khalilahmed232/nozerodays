package com.entity;

import java.sql.Date;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Entity
public @Data class ActivityLog {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) 
	public long id;
	public ActivityGroup activityGroup;
	@Column(
		    name = "created_on",
		    nullable = false
		)
	public Date createdDate = Date.valueOf( LocalDate.now());  
}


